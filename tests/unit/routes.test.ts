import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLocalizedUrl, routeHref, switchLocaleHref } from '../../src/i18n/routes.ts';

test('route helpers map home, work, filtered work, project, about, and CV', () => {
  assert.equal(routeHref('es', { name: 'home' }), '/');
  assert.equal(routeHref('en', { name: 'home' }), '/en/');

  assert.equal(routeHref('es', { name: 'work' }), '/work/');
  assert.equal(routeHref('en', { name: 'work' }), '/en/work/');
  assert.equal(routeHref('es', { name: 'work', category: 'ia' }), '/work/?category=ia');
  assert.equal(routeHref('en', { name: 'work', category: 'ia' }), '/en/work/?category=ia');

  assert.equal(routeHref('es', { name: 'project', slug: 'todo-mcp' }), '/work/todo-mcp/');
  assert.equal(routeHref('en', { name: 'project', slug: 'todo-mcp' }), '/en/work/todo-mcp/');

  assert.equal(routeHref('es', { name: 'about' }), '/about/');
  assert.equal(routeHref('en', { name: 'about' }), '/en/about/');
  assert.equal(routeHref('es', { name: 'cv' }), '/cv/');
  assert.equal(routeHref('en', { name: 'cv' }), '/en/cv/');
  assert.equal(routeHref('es', { name: 'not-found' }), '/404');
  assert.equal(routeHref('en', { name: 'not-found' }), '/en/404');
});

test('the language switch preserves a project slug and the category filter', () => {
  assert.equal(switchLocaleHref('en', '/work/todo-mcp/'), '/en/work/todo-mcp/');
  assert.equal(switchLocaleHref('es', '/en/work/todo-mcp/'), '/work/todo-mcp/');
  assert.equal(switchLocaleHref('en', '/work/', '?category=juegos'), '/en/work/?category=juegos');
  assert.equal(switchLocaleHref('es', '/en/work/', '?category=producto'), '/work/?category=producto');
  assert.equal(switchLocaleHref('en', '/about/'), '/en/about/');
  assert.equal(switchLocaleHref('en', '/unknown/'), '/en/');
});

test('the route parser recognizes localized work and project routes', () => {
  assert.deepEqual(parseLocalizedUrl('/en/work/'), { name: 'work', category: undefined });
  assert.deepEqual(parseLocalizedUrl('/work/', '?category=ia'), {
    name: 'work',
    category: 'ia',
  });
  assert.deepEqual(parseLocalizedUrl('/en/work/portfolio-2026/'), {
    name: 'project',
    slug: 'portfolio-2026',
  });
  assert.equal(parseLocalizedUrl('/en/work/not-a-project/'), null);
});
