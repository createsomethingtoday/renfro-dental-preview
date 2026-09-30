import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const routes = JSON.parse(await readFile(join(dist, 'route-manifest.json'), 'utf8'));
const failures = [];

for (const route of routes) {
  const file = join(dist, route, 'index.html');
  const html = await readFile(file, 'utf8');
  if (!html.includes('<h1>') || !html.includes('name="robots" content="noindex,nofollow"')) {
    failures.push(`${route}: missing main heading or concept noindex metadata`);
  }
  if (!html.includes('Independent website concept by') || !html.includes('Renfro Family Dental has not endorsed')) {
    failures.push(`${route}: missing independent-concept disclosure`);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const target = match[1].split('#')[0].split('?')[0];
    if (!target || target === '/') continue;
    const targetFile = target.endsWith('/') ? join(dist, target, 'index.html') : join(dist, target.slice(1));
    try { await access(targetFile); } catch { failures.push(`${route}: missing ${target}`); }
  }
  if (/REPLACE_ME|EXAMPLE_URL|TODO_LINK/.test(html)) failures.push(`${route}: unresolved placeholder`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Checked ${routes.length} generated routes, their local links and assets, and concept disclosures.`);
