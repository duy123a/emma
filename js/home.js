import { isMobile } from './utils';

(() => {
  //block visualiser access to mobile android and mac os
  if (isMobile()) {
    const link = document.getElementById('visualiser-link');
    if (!link) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const modal = document.getElementById('home-modal');
      if (!modal) return;
      const modalTitle = modal.querySelector('.modal-title');
      if (modalTitle) modalTitle.textContent = 'Sorry >.<';
      const modalBody = modal.querySelector('.modal-body');
      if (modalBody) modalBody.textContent = 'This feature is not supported for mobile devices!';
      const homeModal = new bootstrap.Modal(modal);
      homeModal.show();
    });
  }
})();
