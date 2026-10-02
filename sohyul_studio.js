"use strict";

// The original mouse-following bubble: all ten rings have their OWN transition
// durations, so the white and soft green outlines trail organically behind.
const balls = document.getElementsByClassName('ball');
document.addEventListener('mousemove', actionMoveMouse, {passive:true});
function actionMoveMouse(event) {
  for (let i = 0; i < balls.length; i++) {
    balls[i].style.left = (event.clientX - 5) + 'px';
    balls[i].style.top = (event.clientY - 5) + 'px';
  }
}

// The redesigned site uses REAL vertical document scrolling (not scrollLeft).
document.addEventListener('DOMContentLoaded', () => {
  const tabs = [...document.querySelectorAll('.tab')];
  const panels = [...document.querySelectorAll('.panel')];
  const portfolio = document.getElementById('portfolio');
  const names = new Set(panels.map(p => p.id));

  function selectTab(name, pushHistory = true, scrollToTop = true) {
    if (!names.has(name)) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === name;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      const selected = panel.id === name;
      panel.classList.toggle('active', selected);
      panel.hidden = !selected;
    });
    if (pushHistory && location.hash !== '#' + name) {
      history.pushState(null, '', '#' + name);
    }
    // Reset to the TOP of the portfolio when switching from a longer panel.
    if (scrollToTop) portfolio.scrollIntoView({behavior:'smooth', block:'start'});
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab.dataset.tab));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index+1)%tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index-1+tabs.length)%tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = tabs.length-1;
      else return;
      event.preventDefault();
      tabs[nextIndex].focus();
      selectTab(tabs[nextIndex].dataset.tab);
    });
  });
  function fromHash() {
    const name = decodeURIComponent(location.hash.slice(1));
    if (names.has(name)) selectTab(name, false, true);
  }
  window.addEventListener('hashchange', fromHash);
  if (names.has(location.hash.slice(1))) fromHash();
});
