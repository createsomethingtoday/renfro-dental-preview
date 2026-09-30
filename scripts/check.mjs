import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const routes = JSON.parse(await readFile(join(dist, 'route-manifest.json'), 'utf8'));
const failures = [];
const home = await readFile(join(dist, 'index.html'), 'utf8');
for (const section of ['intro-section', 'doctors-section', 'services-section', 'patient-reviews', 'insurance-and-wellness', 'questions', 'dental-education']) {
  if (!home.includes(section)) failures.push(`/: missing original-homepage area ${section}`);
}
for (const video of ['dkVJwcXUYNg', 'UznnYepsvG4', 'y--hW_9rmd4']) {
  if (!home.includes(`data-video="${video}"`)) failures.push(`/: missing source education video ${video}`);
}
for (const carrier of ['Aetna', 'Cigna', 'Guardian', 'Humana', 'MetLife', 'UnitedHealthcare']) {
  if (!home.includes(carrier)) failures.push(`/: missing source insurance carrier ${carrier}`);
}
const notFound = await readFile(join(dist, '404.html'), 'utf8');
if (!notFound.includes('Page not found') || !notFound.includes('Return to the concept home')) {
  failures.push('404.html: missing intentional not-found experience');
}

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
