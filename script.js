(function () {
  'use strict';

  var PHONE = '918126876913';
  var EMAIL = 'punaryard@gmail.com';

  // The only states PunarYard works in.
  var SERVED = [
    'Bihar',
    'Delhi',
    'Haryana',
    'Himachal Pradesh',
    'Madhya Pradesh',
    'Punjab',
    'Rajasthan',
    'Uttar Pradesh',
    'Uttarakhand'
  ];

  var HINDI = {
    'Bihar': 'बिहार',
    'Delhi': 'दिल्ली',
    'Haryana': 'हरियाणा',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Madhya Pradesh': 'मध्य प्रदेश',
    'Punjab': 'पंजाब',
    'Rajasthan': 'राजस्थान',
    'Uttar Pradesh': 'उत्तर प्रदेश',
    'Uttarakhand': 'उत्तराखंड'
  };

  var ALL_STATES = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka',
    'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fillSelect(select, list) {
    list.forEach(function (name) {
      var opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = $('.nav-toggle');
  var navList = $('#nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $all('a', navList).forEach(function (a) {
      a.addEventListener('click', function () {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Before / after slider ---------- */
  var compare = $('.compare');
  var range = $('.compare-range');
  if (compare && range) {
    var setPos = function (v) { compare.style.setProperty('--pos', v + '%'); };
    range.addEventListener('input', function () { setPos(range.value); });

    // One sweep on load: show the full building, then wipe to the clean plot.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'requestAnimationFrame' in window) {
      var from = 96, to = Number(range.value), dur = 1600, start = null, touched = false;
      range.addEventListener('pointerdown', function () { touched = true; }, { once: true });
      range.addEventListener('keydown', function () { touched = true; }, { once: true });
      setPos(from);
      var step = function (t) {
        if (touched) return;
        if (start === null) start = t;
        var p = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        setPos(from + (to - from) * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      setTimeout(function () { requestAnimationFrame(step); }, 500);
      // If animation frames are throttled (background tab), still settle on the resting point.
      setTimeout(function () { if (!touched) setPos(to); }, 500 + dur + 400);
    }
  }

  /* ---------- Area checker ---------- */
  var checkSelect = $('#check-state');
  var checkResult = $('#checker-result');
  var formState = $('#f-state');
  var tiles = $all('.tile');

  if (checkSelect) fillSelect(checkSelect, ALL_STATES);
  if (formState) fillSelect(formState, SERVED);

  function showCheck(state) {
    tiles.forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-state') === state); });
    if (!state) {
      checkResult.textContent = '';
      checkResult.className = 'checker-result';
      return;
    }
    if (SERVED.indexOf(state) !== -1) {
      checkResult.className = 'checker-result yes';
      checkResult.textContent = 'Yes, we work in ' + state + '. Book a free site visit below. हाँ, हम ' + (HINDI[state] || state) + ' में काम करते हैं। नीचे मुफ़्त साइट विज़िट बुक करें।';
      if (formState) formState.value = state;
    } else {
      checkResult.className = 'checker-result no';
      checkResult.textContent = 'Not yet. We only take jobs in Punjab, Haryana, Delhi, Uttar Pradesh, Bihar, Uttarakhand, Rajasthan, Himachal Pradesh and Madhya Pradesh. अभी नहीं। हम सिर्फ़ पंजाब, हरियाणा, दिल्ली, उत्तर प्रदेश, बिहार, उत्तराखंड, राजस्थान, हिमाचल प्रदेश और मध्य प्रदेश में काम करते हैं।';
    }
  }

  if (checkSelect) {
    checkSelect.addEventListener('change', function () { showCheck(checkSelect.value); });
  }
  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      var state = tile.getAttribute('data-state');
      if (checkSelect) checkSelect.value = state;
      showCheck(state);
    });
  });

  /* ---------- Enquiry form ---------- */
  var form = $('#enquiry');
  var errorBox = $('#form-error');
  var via = 'whatsapp';

  if (form) {
    $all('button[type="submit"]', form).forEach(function (btn) {
      btn.addEventListener('click', function () { via = btn.getAttribute('data-via'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      var data = {
        name: f.name.value.trim(),
        mobile: f.mobile.value.replace(/\D/g, ''),
        state: f.state.value,
        city: f.city.value.trim(),
        type: f.type.value,
        floors: f.floors.value,
        message: f.message.value.trim()
      };

      var problems = [];
      var mark = function (field, bad) { f[field].setAttribute('aria-invalid', bad ? 'true' : 'false'); };

      mark('name', !data.name);
      if (!data.name) problems.push(['your name', 'अपना नाम']);

      var mobileOk = /^[6-9]\d{9}$/.test(data.mobile);
      mark('mobile', !mobileOk);
      if (!mobileOk) problems.push(['a 10-digit mobile number', '10 अंकों का मोबाइल नंबर']);

      mark('state', !data.state);
      if (!data.state) problems.push(['your state', 'राज्य']);

      mark('city', !data.city);
      if (!data.city) problems.push(['your city or town', 'शहर या कस्बा']);

      if (problems.length) {
        errorBox.textContent = 'Please add ' + problems.map(function (p) { return p[0]; }).join(', ') + '. ' +
          'कृपया ' + problems.map(function (p) { return p[1]; }).join(', ') + ' भरें।';
        var firstBad = $('[aria-invalid="true"]', form);
        if (firstBad) firstBad.focus();
        return;
      }
      errorBox.textContent = '';

      var lines = [
        'नमस्ते PunarYard, मुझे साइट विज़िट चाहिए।',
        'Site visit request for PunarYard',
        'Name: ' + data.name,
        'Mobile: ' + data.mobile,
        'Location: ' + data.city + ', ' + data.state,
        'Building: ' + data.type + ' (' + data.floors + ')'
      ];
      if (data.message) lines.push('Notes: ' + data.message);
      var text = lines.join('\n');

      if (via === 'email') {
        var subject = 'Site visit request: ' + data.city + ', ' + data.state;
        window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
      } else {
        window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
