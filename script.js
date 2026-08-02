document.addEventListener('DOMContentLoaded', () => {
  const viewport = document.getElementById('viewport');
  const scene1 = document.getElementById('scene-1');
  const scene2 = document.getElementById('scene-2');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  const bgPainting = document.querySelector('.painting-bg');
  const bgTvRoad = document.querySelector('.tv-road-bg');
  const centerArrowWrapper = document.querySelector('.center-arrow-wrapper');

  const editorialLeft = document.querySelector('.editorial-left');
  const editorialRight = document.querySelector('.editorial-right-rotated');
  const editorialCenter = document.querySelector('.editorial-center');

  const letters = document.querySelectorAll('.letter');
  const workItems = document.querySelectorAll('.work-item');

  let targetScroll = 0;
  let currentScroll = 0;
  const ease = 0.075;
  let maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  window.addEventListener('resize', () => {
    maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  });

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
  });

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function updateNavLinks(progress) {
    if (progress < 0.45) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#intro') link.classList.add('active');
      });
    } else {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#work') link.classList.add('active');
      });
    }
  }

  function tick() {
    currentScroll = lerp(currentScroll, targetScroll, ease);

    if (Math.abs(targetScroll - currentScroll) < 0.05) {
      currentScroll = targetScroll;
    }

    const progress = Math.max(0, Math.min(1, currentScroll / maxScroll));

    updateNavLinks(progress);

    if (progress < 0.65) {
      scene1.classList.add('scene-active');

      const s1Opacity = Math.max(0, 1 - (progress - 0.28) / 0.22);
      const s1Z = -progress * 600;
      scene1.style.opacity = s1Opacity;
      scene1.style.transform = `translate3d(0, 0, ${s1Z}px)`;
      scene1.style.visibility = s1Opacity > 0 ? 'visible' : 'hidden';

      const paintingScale = 1.0 + progress * 0.3;
      const paintingY = progress * -80;
      bgPainting.style.transform = `scale(${paintingScale}) translate3d(0, ${paintingY}px, 0)`;

      if (editorialCenter) {
        editorialCenter.style.transform = `translate3d(0, ${currentScroll * -0.2}px, 0)`;
        editorialCenter.style.opacity = Math.max(0, 1 - progress * 3.5);
      }

      if (editorialLeft) {
        editorialLeft.style.transform = `translate3d(0, ${currentScroll * -0.55}px, 0)`;
      }
      if (editorialRight) {
        editorialRight.style.transform = `translate3d(0, ${currentScroll * 0.45}px, 0) rotate(180deg)`;
      }

      if (centerArrowWrapper) {
        const arrowRot = currentScroll * 0.12;
        const arrowScale = 1.0 + progress * 1.5;
        centerArrowWrapper.style.transform = `translate(-50%, -50%) rotate(${arrowRot}deg) scale(${arrowScale})`;
      }

      letters.forEach(letter => {
        const speedX = parseFloat(letter.style.getPropertyValue('--speed-x') || 0);
        const speedY = parseFloat(letter.style.getPropertyValue('--speed-y') || 0);
        const speedRotX = parseFloat(letter.style.getPropertyValue('--speed-rot-x') || 0);
        const speedRotY = parseFloat(letter.style.getPropertyValue('--speed-rot-y') || 0);

        const tx = currentScroll * speedX * 0.75;
        const ty = currentScroll * speedY * 0.75;
        const tz = currentScroll * 1.2;

        const rx = currentScroll * speedRotX * 0.08;
        const ry = currentScroll * speedRotY * 0.08;

        letter.style.transform = `translate3d(${tx}px, ${ty}px, ${tz}px) rotateX(${rx}deg) rotateY(${ry}deg)`;

        const letterFadeThreshold = 0.35 + (speedX * 0.05);
        const letterOpacity = Math.max(0, 1 - (progress / letterFadeThreshold));
        letter.style.opacity = letterOpacity;
      });

    } else {
      scene1.classList.remove('scene-active');
      scene1.style.visibility = 'hidden';
    }

    if (progress > 0.25) {
      scene2.style.visibility = 'visible';

      const s2Progress = (progress - 0.25) / 0.45;
      const s2Opacity = Math.min(1, Math.max(0, s2Progress));

      const s2Z = -300 + Math.min(300, s2Progress * 300);
      const s2Y = 150 - Math.min(150, s2Progress * 150);

      scene2.style.opacity = s2Opacity;
      scene2.style.transform = `translate3d(0, ${s2Y}px, ${s2Z}px)`;

      if (s2Opacity > 0.01) {
        scene2.classList.add('scene-active');
      } else {
        scene2.classList.remove('scene-active');
      }

      const tvRoadScale = 1.15 - Math.max(0, s2Progress * 0.12);
      const tvRoadY = -40 + s2Progress * 60;
      bgTvRoad.style.transform = `scale(${tvRoadScale}) translate3d(0, ${tvRoadY}px, 0)`;

      workItems.forEach(item => {
        const itemIndex = parseInt(item.style.getPropertyValue('--item-index') || 0);
        const itemDrift = (currentScroll - maxScroll * 0.35) * (0.05 + itemIndex * 0.02);
        item.style.transform = `translate3d(0, ${itemDrift * -0.6}px, ${itemDrift * 0.1}px) rotateY(${itemDrift * 0.02}deg)`;
      });

    } else {
      scene2.classList.remove('scene-active');
      scene2.style.visibility = 'hidden';
    }

    requestAnimationFrame(tick);
  }

  tick();

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');

      let targetY = 0;
      if (targetId === '#intro') {
        targetY = 0;
      } else if (targetId === '#work') {
        targetY = maxScroll * 0.65;
      } else {
        targetY = maxScroll * 0.85;
      }

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    });
  });
});


// nombre de usuario + . + github.io/ + nombre del proyecto