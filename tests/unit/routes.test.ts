import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLocalizedUrl, routeHref, switchLocaleHref } from '../../src/i18n/routes.ts';

test('route helpers map home, work, filtered work, project, about, and colophon', () => {
  assert.equal(routeHref('es', { name: 'home' }), '/');
  assert.equal(routeHref('en', { name: 'home' }), '/en/');

  assert.equal(routeHref('es', { name: 'work' }), '/work/');
  assert.equal(routeHref('en', { name: 'work' }), '/en/work/');
  assert.equal(routeHref('es', { name: 'work', category: 'ia' }), '/work/?c=ia');
  assert.equal(routeHref('en', { name: 'work', category: 'ia' }), '/en/work/?c=ia');

  assert.equal(
    routeHref('es', { name: 'project', slug: 'todo-mcp-dual' }),
    '/work/todo-mcp-dual/',
  );
  assert.equal(
    routeHref('en', { name: 'project', slug: 'todo-mcp-dual' }),
    '/en/work/todo-mcp-dual/',
  );

  assert.equal(routeHref('es', { name: 'about' }), '/about/');
  assert.equal(routeHref('en', { name: 'about' }), '/en/about/');
  assert.equal(routeHref('es', { name: 'colophon' }), '/colophon/');
  assert.equal(routeHref('en', { name: 'colophon' }), '/en/colophon/');
  assert.equal(routeHref('es', { name: 'not-found' }), '/404');
  assert.equal(routeHref('en', { name: 'not-found' }), '/en/404');
});

test('the language switch preserves a project slug and the category filter', () => {
  assert.equal(switchLocaleHref('en', '/work/todo-mcp-dual/'), '/en/work/todo-mcp-dual/');
  assert.equal(switchLocaleHref('es', '/en/work/todo-mcp-dual/'), '/work/todo-mcp-dual/');
  assert.equal(switchLocaleHref('en', '/work/', '?c=juegos'), '/en/work/?c=juegos');
  assert.equal(switchLocaleHref('es', '/en/work/', '?c=producto'), '/work/?c=producto');
  assert.equal(switchLocaleHref('en', '/about/'), '/en/about/');
  assert.equal(switchLocaleHref('en', '/cv/'), '/en/');
  assert.equal(switchLocaleHref('en', '/unknown/'), '/en/');
});

test('the route parser recognizes localized work and project routes', () => {
  assert.deepEqual(parseLocalizedUrl('/en/work/'), { name: 'work', category: undefined });
  assert.deepEqual(parseLocalizedUrl('/work/', '?c=ia'), {
    name: 'work',
    category: 'ia',
  });
  assert.deepEqual(parseLocalizedUrl('/en/work/todo-mcp-dual/'), {
    name: 'project',
    slug: 'todo-mcp-dual',
  });
});

test('the route parser rejects malformed project slugs', () => {
  assert.equal(parseLocalizedUrl('/en/work/Not_A_Project/'), null);
  assert.equal(parseLocalizedUrl('/en/work/todo_mcp/'), null);
  assert.equal(parseLocalizedUrl('/en/work/todo-mcp--dual/'), null);
});
