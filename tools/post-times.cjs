'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const yaml = require('js-yaml');
const moment = require('moment-timezone');

function split(raw, file) {
  const match = raw.match(/^(\uFEFF?---\r?\n)([\s\S]*?)(^---[ \t]*(?:\r?\n|$))([\s\S]*)$/m);
  if (!match || match.index !== 0) throw new Error(`Expected YAML front matter: ${file}`);
  const meta = yaml.load(match[2], { schema: yaml.JSON_SCHEMA }) || {};
  if (typeof meta !== 'object' || Array.isArray(meta)) throw new Error(`Invalid front matter: ${file}`);
  return { prefix: match[1], head: match[2], separator: match[3], body: match[4], meta };
}

function synchronize(base, timezone = 'Asia/Shanghai') {
  const source = path.join(base, 'source');
  const stateFile = path.join(base, 'data', 'post-times.json');
  const previous = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : { version: 1, posts: {} };
  if (previous.version !== 1 || !previous.posts) throw new Error('Unsupported post-times state');
  const state = { version: 1, posts: {} };
  const plans = [];
  const format = date => moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
  const parse = value => {
    const date = moment.tz(String(value), moment.ISO_8601, true, timezone);
    if (!date.isValid()) throw new Error(`Invalid article date: ${value}`);
    return date;
  };
  function visit(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { visit(file); continue; }
      if (!entry.isFile() || !/\.md$/i.test(entry.name)) continue;
      const stats = fs.statSync(file);
      const raw = fs.readFileSync(file, 'utf8');
      const parts = split(raw, file);
      const key = path.relative(source, file).split(path.sep).join('/');
      const old = previous.posts[key];
      // Exclude date fields and normalize line endings; touching or checking out a file is not an edit.
      const meaningful = { ...parts.meta };
      delete meaningful.date;
      delete meaningful.updated;
      const hash = crypto.createHash('sha256').update(JSON.stringify(meaningful) + '\n' + parts.body.replace(/\r\n/g, '\n')).digest('hex');
      const date = parts.meta.date || format(stats.birthtime);
      let updated = parts.meta.updated || format(stats.mtime);
      const manuallyUpdated = old && parts.meta.updated && String(parts.meta.updated) !== old.updated;
      if (old && old.hash !== hash && !manuallyUpdated) updated = format(stats.mtime);
      parse(date); parse(updated);
      let head = parts.head;
      const eol = raw.includes('\r\n') ? '\r\n' : '\n';
      for (const [name, value] of Object.entries({ date, updated })) {
        if (String(parts.meta[name] || '') === String(value)) continue;
        const field = new RegExp(`^${name}:[^\\r\\n]*(?:\\r?\\n|$)`, 'm');
        if (field.test(head)) head = head.replace(field, `${name}: ${value}${eol}`);
        else head += `${name}: ${value}${eol}`;
      }
      const next = parts.prefix + head + parts.separator + parts.body;
      state.posts[key] = { hash, updated: String(updated) };
      plans.push({ file, key, raw, next, stats, date: parse(date).toDate(), updated: parse(updated).toDate() });
    }
  }
  visit(path.join(source, '_posts'));
  visit(path.join(source, '_drafts'));
  // Validate all articles before any write; never overwrite an edit made during this scan.
  for (const plan of plans) {
    if (fs.readFileSync(plan.file, 'utf8') !== plan.raw) throw new Error(`Article changed during date sync; retry: ${plan.key}`);
  }
  for (const plan of plans) {
    if (plan.raw === plan.next) continue;
    fs.writeFileSync(plan.file, plan.next);
    // Metadata backfill must not itself become the next modification timestamp.
    fs.utimesSync(plan.file, plan.stats.atime, plan.stats.mtime);
  }
  const serialized = JSON.stringify(state, null, 2) + '\n';
  if (!fs.existsSync(stateFile) || fs.readFileSync(stateFile, 'utf8') !== serialized) {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true });
    fs.writeFileSync(stateFile + '.tmp', serialized);
    fs.renameSync(stateFile + '.tmp', stateFile);
  }
  return plans;
}

module.exports = { synchronize };
if (require.main === module) {
  const plans = synchronize(path.resolve(__dirname, '..'));
  console.log(`Article dates: ${plans.length} checked, ${plans.filter(p => p.raw !== p.next).length} updated`);
}
