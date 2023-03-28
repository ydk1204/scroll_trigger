var doc = document;
var win = window;

let w = {
  width: win.innerWidth,
  height: win.innerHeight,
  scroll: win.pageYOffset
};

function updateGlobals() {
  w.width = win.innerWidth;
  w.height = win.innerHeight;
  w.scroll = win.pageYOffset;
}

win.addEventListener("resize", updateGlobals, true);
win.addEventListener("scroll", updateGlobals, true);
win.addEventListener("load", updateGlobals, true);

$(function scrollTrigger() {
  let triggers = doc.getElementsByClassName("js-trigger");

  let cushionTop = 200;
  let cushionBottom = 300;
  let showLines = true;
  let triggerMode = 'toggle-in';

  let posY = [];
  let state = [];

  function getStates() {
    for (x = 0; x < triggers.length; x++) {
      state.push(triggers[x].getAttribute('data-active') == 'on' ? 1 : 0);
    }
  }

  getStates();

  function getPositions() {
    posY = [];

    for (x = 0; x < triggers.length; x++) {
      posY.push(triggers[x].getBoundingClientRect().top);
    }
  }

  getPositions();
  win.addEventListener("resize", throttle(getPositions, 200));

  function trackScrollInOut() {
    for (x = 0; x < triggers.length; x++) {
      if (state[x] !== 1 && posY[x] > (w.scroll + cushionTop) && posY[x] < (w.scroll + w.height - cushionBottom)) {
        triggers[x].setAttribute('data-active', 'on');
        state[x] = 1;
      } else if (state[x] != 0 && posY[x] < (w.scroll + cushionTop) || state[x] != 0 && posY[x] > (w.scroll + w.height - cushionBottom)) {
        triggers[x].setAttribute('data-active', 'off');
        state[x] = 0;
      }
    }
  }

  function trackScrollIn() {
    for (x = 0; x < triggers.length; x++) {
      if (state[x] != 1 && posY[x] < (w.scroll + w.height - cushionBottom)) {
        triggers[x].setAttribute('data-active', 'on');
        state[x] = 1;
      } else if (state[x] != 0 && posY[x] > (w.scroll + w.height - cushionBottom)) {
        triggers[x].setAttribute('data-active', 'off');
        state[x] = 0;
      }
    }
  }

  function trackScrollSwitch() {
    for (x = 0; x < triggers.length; x++) {
      if (state[x] != 1 && posY[x] > (w.scroll + w.height - cushionBottom)) {
        triggers[x].setAttribute('data-active', 'on');
        state[x] = 1;
      }
    }
  }

  if (triggerMode == 'toggle-in-out') {
    win.addEventListener('scroll', throttle(trackScrollInOut, 50));
  } else if (triggerMode == 'toggle-in') {
    win.addEventListener('scroll', throttle(trackScrollIn, 50));
  } else if (triggerMode == 'switch') {
    win.addEventListener('scroll', throttle(trackScrollSwitch, 50));
  }

  if (showLines) {
    var body = doc.getElementsByTagName('body')[0];
    var topLine = doc.createElement('span');
    var bottomLine = doc.createElement('span');

    if (triggerMode === 'toggle-in-out') {
      topLine.style.width = '100%';
      topLine.style.borderTop = '1px dashed rgba(255, 255, 255, .2';
      topLine.style.position = 'fixed';
      topLine.style.left = '0px';
      topLine.style.top = cushionTop + 'px';

      body.appendChild(topLine);
    }

    bottomLine.style.width = '100%';
    bottomLine.style.borderTop = '1px dashed rgba(255, 255, 255, .2)';
    bottomLine.style.position = 'fixed';
    bottomLine.style.left = '0px';
    bottomLine.style.bottom = cushionBottom + 'px';

    body.appendChild(bottomLine);
  }
});

function throttle(func, wait) {
  var context;
  var args;
  var result;
  var timeout = null;
  var previous = 0;
  var options = {};

  var later = function () {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);

    if (!timeout) {
      context = args = null;
    }
  };

  return function () {
    var now = Date.now();

    if (!previous && options.leading === false) {
      previous = now;
    }

    var remaining = wait - (now - previous);

    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);

      if (!timeout) {
        context = args = null;
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };
};
