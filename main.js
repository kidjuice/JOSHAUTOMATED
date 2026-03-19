/* ============================================
   JOSH AUTOMATED STB™ — main.js
   ============================================ */

/* ── NAV SCROLL ─────────────────────────────── */
window.addEventListener('scroll', function () {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 20);
}, { passive: true });

/* ── MOBILE NAV ─────────────────────────────── */
document.getElementById('hamburger').addEventListener('click', function () {
  document.getElementById('mobile-nav').classList.add('open');
});
document.getElementById('mobile-close').addEventListener('click', function () {
  document.getElementById('mobile-nav').classList.remove('open');
});
function closeMobileNav() {
  document.getElementById('mobile-nav').classList.remove('open');
}

/* ── PARTICLES ──────────────────────────────── */
(function () {
  var canvas = document.getElementById('particles');
  var ctx = canvas.getContext('2d');
  var W, H, pts = [], mx = null, my = null;
  var N = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function Pt() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.28;
    this.vy = (Math.random() - 0.5) * 0.28;
    this.r  = Math.random() * 1.3 + 0.4;
    this.a  = Math.random() * 0.32 + 0.07;
  }

  for (var i = 0; i < N; i++) pts.push(new Pt());

  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      if (mx !== null) {
        var dx = mx - p.x, dy = my - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { p.x -= dx * 0.01; p.y -= dy * 0.01; }
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,180,255,' + p.a + ')';
      ctx.fill();
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j];
        var ddx = p.x - q.x, ddy = p.y - q.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(0,180,255,' + (0.05 * (1 - d / 90)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
})();

/* ── SCROLL REVEAL ──────────────────────────── */
var revealObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });

document.querySelectorAll('.rv').forEach(function (el) {
  revealObs.observe(el);
});

/* ── COUNTER ANIMATION ──────────────────────── */
function animateCounter(el, target, suffix, duration) {
  var start = performance.now();
  (function tick(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  })(start);
}

var counterObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      var el     = e.target;
      var target = parseInt(el.dataset.count, 10);
      var suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix, 1600);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(function (el) {
  counterObs.observe(el);
});

/* ── BOT CARD 3D TILT (desktop only) ───────── */
if (window.innerWidth > 768) {
  document.querySelectorAll('.bot-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width  - 0.5;
      var y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = [
        'perspective(600px)',
        'rotateX(' + (-y * 6) + 'deg)',
        'rotateY(' + ( x * 6) + 'deg)',
        'translateY(-4px)'
      ].join(' ');
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
}

/* ── BOT CARD TAP (mobile — toggle features) ─ */
document.querySelectorAll('.bot-card').forEach(function (card) {
  card.addEventListener('click', function (e) {
    if (e.target.classList.contains('buy-btn')) return;
    if (window.innerWidth <= 768) {
      var was = card.classList.contains('tapped');
      document.querySelectorAll('.bot-card.tapped').forEach(function (c) {
        c.classList.remove('tapped');
      });
      if (!was) card.classList.add('tapped');
    }
  });
});

/* ── FAQ ACCORDION ──────────────────────────── */
document.querySelectorAll('.faq-q').forEach(function (q) {
  q.addEventListener('click', function () {
    var item   = q.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (i) {
      i.classList.remove('open');
    });
    if (!isOpen) item.classList.add('open');
  });
});

/* ── EXIT INTENT (desktop only) ─────────────── */
if (window.innerWidth > 768) {
  var exitShown = false;
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY < 8 && !exitShown) {
      exitShown = true;
      document.getElementById('exit-overlay').classList.add('show');
    }
  });
  document.getElementById('exitClose').addEventListener('click', function () {
    document.getElementById('exit-overlay').classList.remove('show');
  });
  document.getElementById('exitDismiss').addEventListener('click', function () {
    document.getElementById('exit-overlay').classList.remove('show');
  });
  document.getElementById('exit-overlay').addEventListener('click', function (e) {
    if (e.target === document.getElementById('exit-overlay')) {
      document.getElementById('exit-overlay').classList.remove('show');
    }
  });
}

/* ── REVIEW SYSTEM ──────────────────────────── */
var userRating = 0;
var reviews    = [];

try {
  reviews = JSON.parse(localStorage.getItem('joshstb_reviews') || '[]');
} catch (e) {
  reviews = [];
}

/* star hover + click */
var starPicks = document.querySelectorAll('.star-pick');
starPicks.forEach(function (s) {
  s.addEventListener('mouseover', function () {
    var v = parseInt(s.dataset.v, 10);
    starPicks.forEach(function (x, i) {
      x.classList.toggle('lit', i < v);
    });
  });
  s.addEventListener('click', function () {
    userRating = parseInt(s.dataset.v, 10);
    starPicks.forEach(function (x, i) {
      x.classList.toggle('lit', i < userRating);
    });
  });
});
var starsRow = document.querySelector('.stars-row');
if (starsRow) {
  starsRow.addEventListener('mouseleave', function () {
    starPicks.forEach(function (x, i) {
      x.classList.toggle('lit', i < userRating);
    });
  });
}

/* order verify */
function verifyOrder() {
  var val = document.getElementById('orderInput').value.trim().toUpperCase();
  var err = document.getElementById('orderErr');
  /* Accept any LS- prefixed ID of reasonable length */
  if (val.startsWith('LS-') && val.length >= 5) {
    document.getElementById('fbGate').classList.add('hidden');
    document.getElementById('fbForm').classList.add('visible');
    err.style.display = 'none';
  } else {
    err.style.display = 'block';
  }
}

/* submit review */
function submitReview() {
  var name    = document.getElementById('fbName').value.trim();
  var tier    = document.getElementById('fbTier').value.trim();
  var country = document.getElementById('fbCountry').value.trim();
  var text    = document.getElementById('fbText').value.trim();

  if (!name || !text || !userRating) {
    alert('Please fill in your name, write a review, and select a star rating.');
    return;
  }

  var review = {
    id:      Date.now(),
    name:    name,
    tier:    tier,
    country: country,
    text:    text,
    rating:  userRating,
    date:    new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  };

  reviews.unshift(review);
  try { localStorage.setItem('joshstb_reviews', JSON.stringify(reviews)); } catch (e) {}

  /* hide form, show success */
  document.getElementById('fbFormInner').style.display = 'none';
  document.getElementById('fbSuccess').style.display   = 'block';
  renderReviews();
}

function starSVG() {
  return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
}

function renderReviews() {
  var el = document.getElementById('reviewsList');
  if (!el) return;
  if (!reviews.length) {
    el.innerHTML = '<p class="no-reviews">No reviews yet. Be the first verified client to leave one.</p>';
    return;
  }
  el.innerHTML = reviews.map(function (r) {
    var stars = '';
    for (var i = 0; i < r.rating; i++) stars += starSVG();
    return '<div class="review-card">' +
      '<div class="review-top">' +
        '<div>' +
          '<div class="review-name">' + r.name + (r.country ? ' <span style="color:var(--t3);font-weight:400">&middot; ' + r.country + '</span>' : '') + '</div>' +
          (r.tier ? '<div class="review-tier">' + r.tier.toUpperCase() + '</div>' : '') +
        '</div>' +
        '<div class="review-stars">' + stars + '</div>' +
      '</div>' +
      '<div class="review-text">&ldquo;' + r.text + '&rdquo;</div>' +
      '<div class="review-date">' + r.date + '</div>' +
    '</div>';
  }).join('');
}

renderReviews();
