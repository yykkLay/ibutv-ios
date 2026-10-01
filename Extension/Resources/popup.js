/* popup.js —— 插件弹窗：一个开关 */

(function () {
  'use strict';

  var api = (typeof browser !== 'undefined') ? browser : chrome;
  var box = document.getElementById('compatEnabled');

  function apply(value) {
    box.checked = value !== false;
  }

  try {
    var p = api.storage.local.get({ compatEnabled: true });
    if (p && typeof p.then === 'function') {
      p.then(function (v) { apply(v.compatEnabled); }).catch(function () { apply(true); });
    } else {
      api.storage.local.get({ compatEnabled: true }, function (v) { apply(v && v.compatEnabled); });
    }
  } catch (e) {
    apply(true);
  }

  box.addEventListener('change', function () {
    try {
      api.storage.local.set({ compatEnabled: box.checked });
    } catch (e) {
      /* 忽略 */
    }
  });
})();
