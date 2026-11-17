// ============================================================
// ASTRONOMAD — Assignment 6: jQuery Features (FULL FIXED)
// Author: Smail Balaussa | Group: SE-2505
// ============================================================

$(document).ready(function () {
  console.log("jQuery is ready!");

  // ==========================================================
  // TASK 4: SCROLL PROGRESS BAR
  // ==========================================================
  if ($('#scrollProgressBar').length === 0) {
    $('body').prepend('<div id="scrollProgressBar" class="scroll-progress-bar"></div>');
  }

  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $('#scrollProgressBar').css('width', scrollPercent + '%');
  });

  // ==========================================================
  // TASK 7: TOAST NOTIFICATION SYSTEM (all pages)
  // ==========================================================
  if ($('#toastContainer').length === 0) {
    $('body').append('<div id="toastContainer" class="toast-container"></div>');
  }

  window.showToast = function (message, type = 'success') {
    const $toast = $('<div class="toast toast-' + type + '">' + message + '</div>');
    $('#toastContainer').append($toast);

    setTimeout(() => $toast.addClass('show'), 50);

    setTimeout(function () {
      $toast.removeClass('show');
      setTimeout(() => $toast.remove(), 400);
    }, 3000);
  };

  // ==========================================================
  // TASK 1 & 2: REAL-TIME SEARCH & AUTOCOMPLETE (planets.html)
  // ==========================================================
  const $planetSearch = $('#planetSearch');
  if ($planetSearch.length) {
    if ($('#suggestionsBox').length === 0) {
      $planetSearch.after('<div id="suggestionsBox" class="suggestions-box"></div>');
    }
    const $suggestionsBox = $('#suggestionsBox');
    const planetsList = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

    $planetSearch.on('input keyup', function () {
      const query = $(this).val().toLowerCase().trim();

      // --- Real-time Search ---
      $('.accordion-item').each(function () {
        const planetName = $(this).find('.planet-name').text().toLowerCase();
        if (planetName.includes(query)) {
          $(this).show().css('animation', 'fadeIn 0.4s ease');
        } else {
          $(this).hide();
        }
      });

      // --- Autocomplete ---
      $suggestionsBox.empty();
      if (query === '') {
        $suggestionsBox.hide();
        return;
      }

      const matches = planetsList.filter(p => p.toLowerCase().includes(query));
      if (matches.length > 0) {
        matches.forEach(match => {
          $suggestionsBox.append('<div class="suggestion-item">' + match + '</div>');
        });
        $suggestionsBox.show();
      } else {
        $suggestionsBox.hide();
      }
    });

    $suggestionsBox.on('click', '.suggestion-item', function () {
      $planetSearch.val($(this).text()).trigger('keyup');
      $suggestionsBox.hide();
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('#planetSearch, #suggestionsBox').length) {
        $suggestionsBox.hide();
      }
    });
  }

  // ==========================================================
  // TASK 3: SEARCH HIGHLIGHTING (deep-space.html)
  // ==========================================================
  const $highlightSearch = $('#highlightSearch');
  if ($highlightSearch.length) {
    const $highlightTargets = $('.deep-card p, .feature-body p, .page-header p');

    $highlightTargets.each(function () {
      $(this).data('original-html', $(this).html());
    });

    $highlightSearch.on('keyup', function () {
      const query = $(this).val().trim();

      $highlightTargets.each(function () {
        const $el = $(this);
        const original = $el.data('original-html');

        if (query === '') {
          $el.html(original);
          return;
        }

        const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp('(' + safeQuery + ')', 'gi');

        if (regex.test($el.text())) {
          const newHtml = original.replace(regex, '<mark class="highlight">$1</mark>');
          $el.html(newHtml);
        } else {
          $el.html(original);
        }
      });
    });
  }

  // ==========================================================
  // TASK 5: ANIMATED NUMBER COUNTER (index.html)
  // ==========================================================
  const $statNumbers = $('.stat-number');
  if ($statNumbers.length) {
    let counterAnimated = false;

    function animateCounters() {
      if (counterAnimated) return;
      counterAnimated = true;

      $statNumbers.each(function () {
        const $el = $(this);
        const originalText = $el.text();

        const match = originalText.match(/[\d.]+/);
        if (!match) return;

        const targetValue = parseFloat(match[0]);
        const suffix = originalText.replace(match[0], '');
        const isDecimal = match[0].includes('.');

        $({ count: 0 }).animate({ count: targetValue }, {
          duration: 2000,
          easing: 'swing',
          step: function () {
            const value = isDecimal ? this.count.toFixed(1) : Math.floor(this.count);
            $el.text(value + suffix);
          },
          complete: function () {
            $el.text(originalText);
          }
        });
      });
    }

    $(window).on('scroll', function () {
      const $statsSection = $('.stats-section');
      if ($statsSection.length) {
        const statsTop = $statsSection.offset().top;
        const windowBottom = $(window).scrollTop() + $(window).height();
        if (windowBottom > statsTop + 100) {
          animateCounters();
        }
      }
    });

    setTimeout(function () {
      const $statsSection = $('.stats-section');
      if ($statsSection.length) {
        const statsTop = $statsSection.offset().top;
        if ($(window).scrollTop() + $(window).height() > statsTop) {
          animateCounters();
        }
      }
    }, 500);
  }

  // ==========================================================
  // TASK 6: LOADING SPINNER — REMOVED
  // ==========================================================
  // NOTE: The spinner logic is now inside script.js section 12.
  // This avoids double-submit / infinite loop issues between
  // script.js and jquery-features.js.
  // ==========================================================

  // ==========================================================
  // TASK 8: COPY TO CLIPBOARD (deep-space.html / missions.html)
  // ==========================================================
  $('.deep-card p, .mission-card p').each(function () {
    const $p = $(this);
    if ($p.next('.copy-btn').length > 0) return;

    const $btn = $('<button class="copy-btn">📋 Copy</button>');

    $btn.on('click', function () {
      const $this = $(this);
      const textToCopy = $p.text().trim().substring(0, 200);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(function () {
          $this.html('✅ Copied!').addClass('copied');
          showToast('📋 Copied to clipboard!', 'success');

          setTimeout(function () {
            $this.html('📋 Copy').removeClass('copied');
          }, 2000);
        }).catch(function () {
          fallbackCopy(textToCopy, $this);
        });
      } else {
        fallbackCopy(textToCopy, $this);
      }
    });

    $p.after($btn);
  });

  function fallbackCopy(text, $btn) {
    const $temp = $('<textarea>').val(text).appendTo('body').select();
    document.execCommand('copy');
    $temp.remove();
    $btn.html('✅ Copied!').addClass('copied');
    showToast('📋 Copied to clipboard!', 'success');
    setTimeout(function () {
      $btn.html('📋 Copy').removeClass('copied');
    }, 2000);
  }

  // ==========================================================
  // TASK 9: IMAGE LAZY LOADING (gallery, deep-space, missions)
  // ==========================================================
  const $lazyImages = $('img[data-src]');
  if ($lazyImages.length) {
    function loadVisibleImages() {
      const windowTop = $(window).scrollTop();
      const windowBottom = windowTop + $(window).height();

      $lazyImages.each(function () {
        const $img = $(this);
        if ($img.hasClass('lazy-loaded')) return;

        const imgTop = $img.offset().top;

        if (imgTop < windowBottom + 200 && imgTop > windowTop - 200) {
          const realSrc = $img.data('src');
          if (realSrc) {
            $img.attr('src', realSrc).removeAttr('data-src').addClass('lazy-loaded');
            $img.css('opacity', 0).animate({ opacity: 1 }, 500);
          }
        }
      });
    }

    $(window).on('scroll', loadVisibleImages);
    loadVisibleImages();
    setTimeout(loadVisibleImages, 100);
  }

  // ==========================================================
  // BONUS: POPUP SUBSCRIBE FORM (index.html)
  // ==========================================================
  const $subscribeForm = $('#subscribeForm');
  if ($subscribeForm.length) {
    $subscribeForm.on('submit', function (e) {
      e.preventDefault();
      const email = $('#subEmail').val().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        showToast('❌ Please enter a valid email.', 'error');
        return;
      }

      showToast('✅ Subscribed! Welcome to Astronomad.', 'success');
      $subscribeForm[0].reset();

      setTimeout(function () {
        $('#popupOverlay').removeClass('show');
      }, 1500);
    });
  }

});