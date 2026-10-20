const POINTER_PREVIEW_DELAY = 90;
const FILTER_QUERY_KEY = 'c';

type CatalogFilter = string;

function readFilter(root: HTMLElement): CatalogFilter | null {
  const params = new URLSearchParams(window.location.search);

  if (!params.has(FILTER_QUERY_KEY)) return 'all';

  const value = params.get(FILTER_QUERY_KEY)?.trim() ?? '';
  if (value === 'all') return 'all';

  const validFilters = new Set(
    Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-filter]')).map(
      (link) => link.dataset.filter ?? '',
    ),
  );

  return validFilters.has(value) ? value : null;
}

function initCatalog(root: HTMLElement): void {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('[data-project-row]'));
  const filterLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>('[data-filter]'),
  );
  const panels = Array.from(
    root.querySelectorAll<HTMLElement>('[data-preview-panel]'),
  );
  const preview = root.querySelector<HTMLElement>('[data-work-preview]');
  const emptyState = root.querySelector<HTMLElement>('[data-catalog-empty]');
  const resetLink = emptyState?.querySelector<HTMLAnchorElement>('a') ?? null;
  const countValue = root.querySelector<HTMLElement>('[data-catalog-count]');
  const countLabel = root.querySelector<HTMLElement>('[data-catalog-count-label]');
  const countWrap = root.querySelector<HTMLElement>('[data-catalog-count-wrap]');

  let activePreview = panels.find((panel) => panel.dataset.active === 'true')?.dataset.project ?? null;
  let pointerTimer: number | undefined;
  let pendingSlug: string | null = null;

  const cancelPointerPreview = (): void => {
    if (pointerTimer !== undefined) {
      window.clearTimeout(pointerTimer);
      pointerTimer = undefined;
    }
    pendingSlug = null;
  };

  const setPreview = (slug: string | null): void => {
    if (slug === activePreview) return;

    activePreview = slug;

    for (const panel of panels) {
      const isActive = panel.dataset.project === slug;
      panel.dataset.active = String(isActive);

      if (isActive) {
        panel.removeAttribute('inert');
        panel.removeAttribute('aria-hidden');
      } else {
        panel.setAttribute('inert', '');
        panel.setAttribute('aria-hidden', 'true');
      }
    }
  };

  const updateCount = (count: number): void => {
    if (countValue) countValue.textContent = String(count);
    if (countLabel && countWrap) {
      countLabel.textContent =
        count === 1
          ? (countWrap.dataset.countOne ?? '')
          : (countWrap.dataset.countMany ?? '');
    }
  };

  const updateFilterLinks = (filter: CatalogFilter | null): void => {
    for (const link of filterLinks) {
      if (link.dataset.filter === filter) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    root.dataset.activeFilter = filter ?? 'none';
  };

  const updateUrl = (filter: CatalogFilter): void => {
    const url = new URL(window.location.href);

    if (filter === 'all') {
      url.searchParams.delete(FILTER_QUERY_KEY);
    } else {
      url.searchParams.set(FILTER_QUERY_KEY, filter);
    }

    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (nextUrl !== currentUrl) {
      window.history.replaceState({ catalogFilter: filter }, '', nextUrl);
    }
  };

  const applyFilter = (
    filter: CatalogFilter | null,
    options: { updateUrl?: boolean } = {},
  ): void => {
    const normalized = filter ?? '__none__';
    let visibleCount = 0;
    let firstVisible: HTMLElement | null = null;

    for (const row of rows) {
      const matches =
        normalized === 'all' || row.dataset.category === normalized;
      row.hidden = !matches;

      if (matches) {
        visibleCount += 1;
        firstVisible ??= row;
      }
    }

    updateFilterLinks(filter);
    updateCount(visibleCount);

    if (emptyState) emptyState.hidden = visibleCount > 0;
    if (preview) preview.hidden = visibleCount === 0;

    const activeRow = rows.find((row) => row.dataset.project === activePreview);
    const activeRowIsVisible = activeRow ? !activeRow.hidden : false;

    if (visibleCount === 0) {
      setPreview(null);
    } else if (!activeRowIsVisible && firstVisible) {
      setPreview(firstVisible.dataset.project ?? null);
    }

    if (options.updateUrl && filter) {
      updateUrl(filter);
    }

    root.dataset.catalogReady = 'true';
  };

  for (const row of rows) {
    const slug = row.dataset.project ?? null;
    if (!slug) continue;

    row.addEventListener('pointerenter', () => {
      cancelPointerPreview();
      pendingSlug = slug;

      pointerTimer = window.setTimeout(() => {
        if (pendingSlug === slug) setPreview(slug);
        pointerTimer = undefined;
        pendingSlug = null;
      }, POINTER_PREVIEW_DELAY);
    });

    row.addEventListener('pointerleave', () => {
      if (pendingSlug === slug) cancelPointerPreview();
    });

    row.addEventListener('focusin', () => {
      cancelPointerPreview();
      setPreview(slug);
    });
  }

  for (const link of filterLinks) {
    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      applyFilter(link.dataset.filter ?? 'all', { updateUrl: true });
    });
  }

  resetLink?.addEventListener('click', (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    applyFilter('all', { updateUrl: true });
  });

  window.addEventListener('popstate', () => {
    applyFilter(readFilter(root));
  });

  applyFilter(readFilter(root));
}

const catalog = document.querySelector<HTMLElement>('[data-catalog]');

if (catalog) {
  initCatalog(catalog);
}

export {};
