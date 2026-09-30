'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { Resvg } = require('@resvg/resvg-js');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules/@fortawesome/fontawesome-free');
const target = path.join(root, 'source/lib/fontawesome');
const version = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8')).version;

for (const dir of ['css', 'webfonts']) fs.mkdirSync(path.join(target, dir), { recursive: true });
const css = fs.readFileSync(path.join(source, 'css/all.min.css'), 'utf8');
fs.writeFileSync(path.join(target, 'css/all.min.css'), css);
// Copy precisely the fonts referenced by this version's CSS, retaining relative paths.
const fonts = new Set([...css.matchAll(/\.\.\/webfonts\/([^)'"\s]+)/g)].map(match => match[1]));
if (!fonts.size) throw new Error('Font Awesome CSS contains no local font references');
for (const name of fonts) {
  if (path.basename(name) !== name) throw new Error(`Unexpected font path: ${name}`);
  fs.copyFileSync(path.join(source, 'webfonts', name), path.join(target, 'webfonts', name));
}
fs.copyFileSync(path.join(source, 'LICENSE.txt'), path.join(target, 'LICENSE.txt'));

const images = path.join(root, 'source/images');
fs.mkdirSync(images, { recursive: true });
const original = fs.readFileSync(path.join(source, 'svgs/solid/rss.svg'), 'utf8');
const svg = original.replace('fill="currentColor"', 'fill="#f26522"');
fs.writeFileSync(path.join(images, 'rss.svg'), svg);
// Give the original icon a square canvas and padding, for feed-reader compatibility.
const square = svg.replace('viewBox="0 0 448 512"', 'width="128" height="128" viewBox="-64 -32 576 576"');
fs.writeFileSync(path.join(images, 'rss.png'), new Resvg(square).render().asPng());
fs.writeFileSync(path.join(target, 'README.txt'),
  `Font Awesome Free ${version}\nSource: https://www.npmjs.com/package/@fortawesome/fontawesome-free/v/${version}\n` +
  'License: LICENSE.txt (icons CC BY 4.0, fonts SIL OFL 1.1, code MIT).\n' +
  'RSS SVG and PNG: /images/rss.svg and /images/rss.png. Icon from svgs/solid/rss.svg; orange fill and padded PNG export.\n' +
  'Refresh with npm run assets:sync after an intentional package version update.\n');
console.log(`Font Awesome ${version}: CSS, ${fonts.size} fonts, license and RSS SVG/PNG saved locally.`);
