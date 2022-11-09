import { getCharacterList } from './api/fetchClient';
import RELEASED_UNITS from './constants/releasedUnits';
import { isIpad, isMobile } from './utils';
import spine from './utils/spine-player';

// global var
let currentSpine = '';
let currentId = '';
let currentTransparent = false;
let currentSkin = '';
let currentColorBackground = '';
let currentL2D = 'fb';
let move = false;
let oldx = '';
let oldy = '';
// maybe i can put them to the localStorage but whatever

async function renderVisualiserList() {
  try {
    const list = document.getElementById('visualiser__list');
    const data = await getCharacterList();
    if (!data || !list) return;
    data.map((val) => {
      if (!RELEASED_UNITS.includes(val.name)) return;
      const charElement = document.createElement('li');

      charElement.innerHTML =
        "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + ' ' + val.name;

      charElement.classList.add('visualiser__card');

      charElement.addEventListener('click', (e) => {
        renderVisualiserCharacter(val.id);
      });
      list.appendChild(charElement); //div character list
    });
  } catch (error) {
    console.log("can't get character list", error);
  }
}

const renderVisualiserCharacter = (id) => {
  // empties the div to clear the current spine
  if (currentSpine) {
    currentSpine.dispose();
  }
  document.getElementById('player-container').innerHTML = '';

  currentId = id;

  // skin exception list , if not it'll go to default skin
  if (currentSkin !== 'weapon_2' || id !== 'c220') {
    currentSkin = 'default';
  }
  //rapi_old and shifty_old exception
  if (id === 'c010_01' || id === 'c907_01') {
    currentSkin = '00';
  }
  if (currentL2D === 'fb') {
    //if snow white or maxine > use skin acc
    if (id === 'c220' || id === 'c102') currentSkin = 'acc';

    currentSpine = new spine.SpinePlayer('player-container', {
      skelUrl: '/l2d/' + id + '/' + id + '_00.skel',
      atlasUrl: '/l2d/' + id + '/' + id + '_00.atlas',
      animation: 'idle',
      skin: currentSkin,
      backgroundColor: currentTransparent ? '#00000000' : currentColorBackground,
      alpha: currentTransparent ? true : false,
      debug: false,
      preserveDrawingBuffer: true,
    });
  }
  if (currentL2D === 'cover') {
    //if snow white and weapon_2 not selected -> use weapon2
    if (id === 'c220' && skin !== 'weapon_2') currentSkin = 'weapon_1';

    currentSpine = new spine.SpinePlayer('player-container', {
      skelUrl: '/l2d/' + id + '/cover/' + id + '_cover_00.skel',
      atlasUrl: '/l2d/' + id + '/cover/' + id + '_cover_00.atlas',
      skin: currentSkin,
      backgroundColor: currentColorBackground,
      animation: 'cover_idle',
      alpha: false,
      debug: false,
      preserveDrawingBuffer: true,
    });
  }
  if (currentL2D === 'aim') {
    currentSpine = new spine.SpinePlayer('player-container', {
      skelUrl: '/l2d/' + id + '/aim/' + id + '_aim_00.skel',
      atlasUrl: '/l2d/' + id + '/aim/' + id + '_aim_00.atlas',
      skin: currentSkin,
      animation: 'aim_idle',
      backgroundColor: currentColorBackground,
      alpha: false,
      debug: false,
      preserveDrawingBuffer: true,
    });
  }

  const canvas = document.querySelector('.spine-player-canvas');
  if (canvas) {
    canvas.width = canvas.height;
    canvas.style.width = null;
    canvas.style.display = 'inline';
  }
};

function zoomWithMouse() {
  let canvas = document.getElementById('player-container');
  document.addEventListener('wheel', (event) => {
    // Ignore if wheeling in the list
    const list = document.getElementById('visualiser__list');
    if (list && list.contains(event.target)) return;

    let height = canvas.style.height.replaceAll('vh', '');
    switch (event.deltaY > 0) {
      case true:
        if (parseInt(canvas.style.height.replaceAll('vh', '')) <= 20) return;
        canvas.style.height = parseInt(height) - 5 + 'vh';
        break;
      case false:
        if (parseInt(canvas.style.height.replaceAll('vh', '')) >= 500) return;
        canvas.style.height = parseInt(height) + 5 + 'vh';
        break;
    }
  });

  document.addEventListener('mousedown', (event) => {
    // Ignore if click in the list
    const list = document.getElementById('visualiser__list');
    if (list && list.contains(event.target)) return;

    move = true;
    oldx = event.clientX;
    oldy = event.clientY;
  });

  document.addEventListener('mouseup', (event) => {
    oldx = '';
    oldy = '';
    move = false;
  });

  document.addEventListener('mousemove', (event) => {
    if (!move) return;
    let newx = event.clientX;
    let newy = event.clientY;

    let stylel = canvas.style.left.replaceAll('px', '');
    let stylet = canvas.style.top.replaceAll('px', '');

    if (newx !== oldx) {
      canvas.style.left = parseInt(stylel) + (newx - oldx) + 'px';
    }
    if (newy !== oldy) {
      canvas.style.top = parseInt(stylet) + (newy - oldy) + 'px';
    }
    oldx = newx;
    oldy = newy;
  });

  // For mobile users

  document.addEventListener('touchstart', (event) => {
    // Ignore if click in the list
    const list = document.getElementById('visualiser__list');
    if (list && list.contains(event.target)) return;

    move = true;
    oldx = event.touches[0].clientX;
    oldy = event.touches[0].clientY;
  });

  document.addEventListener('touchend', (event) => {
    oldx = '';
    oldy = '';
    move = false;
  });

  document.addEventListener('touchmove', (event) => {
    if (!move) return;
    let newx = event.touches[0].clientX;
    let newy = event.touches[0].clientY;

    let stylel = canvas.style.left.replaceAll('px', '');
    let stylet = canvas.style.top.replaceAll('px', '');

    if (newx !== oldx) {
      canvas.style.left = parseInt(stylel) + (newx - oldx) + 'px';
    }
    if (newy !== oldy) {
      canvas.style.top = parseInt(stylet) + (newy - oldy) + 'px';
    }
    oldx = newx;
    oldy = newy;
  });
}

(() => {
  // init background color
  if (localStorage.getItem('bg_hex') === null) {
    localStorage.setItem('bg_hex', '#2f353a');
  }
  currentColorBackground = localStorage.getItem('bg_hex');
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = currentColorBackground;
  // get and render characer list
  renderVisualiserList();
  renderVisualiserCharacter('c090');
  // add mouse event
  zoomWithMouse();
  // responsive for mobile users
  if (isIpad()) {
    const newStyle = document.createElement('style');
    newStyle.innerHTML = `
  .spine-player-canvas {margin-left: -40%;}
  .spine-player-controls {position: absolute; left: -15%;}
  #visualiser__list {position: relative; bottom: 0;margin-left:0;}
  #visualiser .visualiser__card{margin-left: -30px;}
  `;
    document.body.appendChild(newStyle);
  } else if (isMobile()) {
    const newStyle = document.createElement('style');
    newStyle.innerHTML = `
    .spine-player-canvas {margin-left: -70%;}
    .spine-player-controls {position: absolute; left: -15%;}
    #visualiser__list {position: relative; bottom: 0;margin-left:0;}
    #visualiser .visualiser__card{margin-left: -30px;}
    `;
    document.body.appendChild(newStyle);
  }
})();
