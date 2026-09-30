'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { synchronize } = require('../tools/post-times.cjs');

function fixture(t, text) {
  const testRoot = path.resolve(__dirname, '../.cache');
  fs.mkdirSync(testRoot, { recursive: true });
  const base = fs.mkdtempSync(path.join(testRoot, 'dumblog-post-times-'));
  const file = path.join(base, 'source/_posts/example.md');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
  const mtime = new Date('2025-04-05T06:07:08Z');
  fs.utimesSync(file, mtime, mtime);
  t.after(() => {
    const relative = path.relative(testRoot, base);
    assert.ok(relative.startsWith('dumblog-post-times-') && !relative.includes(path.sep));
    fs.rmSync(base, { recursive: true, force: true });
  });
  return { base, file, mtime };
}

test('backfills updated, preserves existing date, body, CRLF and filesystem mtime', t => {
  const { base, file, mtime } = fixture(t, '---\r\ntitle: Example\r\ndate: 2021-01-02 03:04:05\r\n---\r\nBody\r\n');
  const [post] = synchronize(base);
  assert.equal(post.date.toISOString(), '2021-01-01T19:04:05.000Z');
  assert.equal(post.updated.toISOString(), mtime.toISOString());
  assert.equal(fs.readFileSync(file, 'utf8'), '---\r\ntitle: Example\r\ndate: 2021-01-02 03:04:05\r\nupdated: 2025-04-05 14:07:08\r\n---\r\nBody\r\n');
  assert.ok(Math.abs(fs.statSync(file).mtimeMs - mtime.getTime()) < 2);
});

test('repeated builds and touching a file do not refresh updated', t => {
  const { base, file } = fixture(t, '---\ntitle: Example\n---\nBody\n');
  synchronize(base);
  const first = fs.readFileSync(file, 'utf8');
  const state = fs.readFileSync(path.join(base, 'data/post-times.json'), 'utf8');
  fs.utimesSync(file, new Date(), new Date());
  const [post] = synchronize(base);
  assert.equal(post.next, first);
  assert.equal(fs.readFileSync(path.join(base, 'data/post-times.json'), 'utf8'), state);
  assert.ok(first.includes('date: '));
});

test('body changes refresh updated but never move the publication date', t => {
  const { base, file } = fixture(t, '---\ndate: 2021-01-02 03:04:05\n---\nBody\n');
  synchronize(base);
  fs.appendFileSync(file, 'Edit\n');
  const time = new Date('2026-05-06T07:08:09Z');
  fs.utimesSync(file, time, time);
  const [post] = synchronize(base);
  assert.equal(post.updated.toISOString(), time.toISOString());
  assert.equal(post.date.toISOString(), '2021-01-01T19:04:05.000Z');
  assert.equal(synchronize(base)[0].raw, post.next);
});

test('explicit manual updated wins for the same edit', t => {
  const { base, file } = fixture(t, '---\ndate: 2021-01-02\n---\nBody\n');
  synchronize(base);
  const text = fs.readFileSync(file, 'utf8').replace(/^updated:.*$/m, 'updated: 2025-07-08 09:10:11');
  fs.writeFileSync(file, text + 'Edit\n');
  assert.equal(synchronize(base)[0].updated.toISOString(), '2025-07-08T01:10:11.000Z');
});

test('invalid date aborts before modifying any article', t => {
  const { base, file } = fixture(t, '---\ntitle: Example\n---\nBody\n');
  const text = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(path.join(path.dirname(file), 'invalid.md'), '---\ndate: wrong\n---\nBody\n');
  assert.throws(() => synchronize(base), /Invalid article date/);
  assert.equal(fs.readFileSync(file, 'utf8'), text);
});

test('Hexo watcher writes updated after a save and exposes it to templates', async t => {
  const Hexo = require('hexo');
  const { base, file } = fixture(t, '---\ntitle: Watch test\ndate: 2021-01-02 03:04:05\n---\nBody\n');
  // A junction reuses installed dependencies without downloading or modifying them.
  const junction = path.join(base, 'node_modules');
  fs.symlinkSync(path.resolve(__dirname, '../node_modules'), junction, 'junction');
  fs.writeFileSync(path.join(base, 'package.json'), JSON.stringify({ hexo: { version: '6.3.0' }, dependencies: {
    'hexo-renderer-ejs': '*', 'hexo-renderer-markdown-it-plus': '*', 'hexo-generator-index': '*'
  } }));
  fs.writeFileSync(path.join(base, '_config.yml'), 'theme: test\ntimezone: Asia/Shanghai\nurl: https://example.test\n');
  for (const name of ['scripts/post-times.js', 'tools/post-times.cjs']) {
    fs.mkdirSync(path.dirname(path.join(base, name)), { recursive: true });
    fs.copyFileSync(path.resolve(__dirname, '..', name), path.join(base, name));
  }
  const layout = path.join(base, 'themes/test/layout');
  fs.mkdirSync(layout, { recursive: true });
  fs.writeFileSync(path.join(base, 'themes/test/_config.yml'), '{}');
  fs.writeFileSync(path.join(layout, 'index.ejs'), '<%= page.posts.toArray()[0].updated.toISOString() %>');
  const hexo = new Hexo(base, { silent: true });
  try {
    await hexo.init();
    await hexo.watch();
    assert.ok(hexo.model('Post').findOne({ source: '_posts/example.md' }), 'Fixture post must load before editing');
    const expected = '2026-05-06T07:08:09.000Z';
    const finished = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Hexo watcher did not refresh article date: ' + fs.readFileSync(file, 'utf8'))), 15000);
      hexo.on('generateAfter', () => {
        const post = hexo.model('Post').findOne({ source: '_posts/example.md' });
        if (post && post.updated.toISOString() === expected) { clearTimeout(timer); resolve(); }
      });
    });
    fs.appendFileSync(file, '\nSaved edit\n');
    fs.utimesSync(file, new Date(expected), new Date(expected));
    await finished;
    assert.match(fs.readFileSync(file, 'utf8'), /updated: 2026-05-06 15:08:09/);
    const post = hexo.model('Post').findOne({ source: '_posts/example.md' });
    assert.equal(post.date.toISOString(), '2021-01-01T19:04:05.000Z');
    let html = '';
    for await (const chunk of hexo.route.get('index.html')) html += chunk;
    assert.ok(html.includes(expected));
  } finally {
    hexo.unwatch();
    await hexo.exit();
    // Remove the junction itself before the fixture directory cleanup.
    fs.unlinkSync(junction);
  }
});
