import { isMobile } from './utils';

(() => {
  //block access to mobile android and mac os
  if (isMobile()) {
    location.href = '.';
  }
})();
