const SCROLL_LOCK_CLASS = 'lightbox-open';

let lastTrigger: HTMLElement | null = null;
let scrollPosition = 0;

function lockPageScroll(): void {
  scrollPosition = window.scrollY;
  document.documentElement.classList.add(SCROLL_LOCK_CLASS);
}

function unlockPageScroll(): void {
  document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
  window.scrollTo(0, scrollPosition);
}

function getDialog(id: string): HTMLDialogElement | null {
  const element = document.getElementById(id);

  return element instanceof HTMLDialogElement ? element : null;
}

for (const trigger of document.querySelectorAll<HTMLElement>('[data-lightbox-open]')) {
  trigger.addEventListener('click', () => {
    const id = trigger.dataset.lightboxOpen;
    const dialog = id ? getDialog(id) : null;

    if (!dialog || dialog.open) {
      return;
    }

    lastTrigger = trigger;
    lockPageScroll();
    dialog.showModal();
  });
}

for (const dialog of document.querySelectorAll<HTMLDialogElement>('[data-lightbox]')) {
  dialog.addEventListener('close', () => {
    unlockPageScroll();
    lastTrigger?.focus({ preventScroll: true });
    lastTrigger = null;
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.querySelectorAll<HTMLElement>('[data-lightbox-close]').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      dialog.close();
    });
  });
}
