/*
 * ibutv-compat.js
 * 在 ibutv.com / xstree.com 页面上，补发网站正在等待的“扩展已就绪”信号。
 *
 * 原理（来自对 xstree 桌面插件的分析）：
 *   网站会监听 window 上的 message 事件，等待 { type: 'RULES_READY' }；
 *   收到就认为插件在线，最多等 8 秒。
 *
 * 注意：扩展的内容脚本运行在隔离世界，无法直接修改页面的 window.__rulesReady，
 *      但 window.postMessage 可以跨世界传递，且 source / origin 都符合网站的校验条件。
 */

(function () {
  'use strict';

  var api = (typeof browser !== 'undefined') ? browser : chrome;
  var enabled = true;      // 默认开启
  var stopBroadcast = false;

  function ready() {
    if (!enabled || stopBroadcast) return;
    try {
      window.postMessage({ type: 'RULES_READY' }, location.origin);
    } catch (e) {
      /* 忽略 */
    }
  }

  // 读取开关状态（兼容 Promise 与回调两种风格）
  function loadState() {
    try {
      var p = api.storage.local.get({ compatEnabled: true });
      if (p && typeof p.then === 'function') {
        p.then(function (v) { enabled = v.compatEnabled !== false; }).catch(function () {});
      } else {
        api.storage.local.get({ compatEnabled: true }, function (v) {
          enabled = !v || v.compatEnabled !== false;
        });
      }
    } catch (e) {
      /* 读取失败就按默认开启处理 */
    }
  }

  loadState();

  // 立即发一次，并在头 10 秒内密集补发，覆盖网站开始等待的时机
  ready();
  var n = 0;
  var fast = setInterval(function () {
    ready();
    if (++n > 40) {
      clearInterval(fast);
      stopBroadcast = true;
    }
  }, 250);

  // 之后低频保持（切回页面、从缓存返回时可能又重新等待）
  setInterval(ready, 3000);
  window.addEventListener('pageshow', function () { stopBroadcast = false; ready(); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) ready();
  });

  // 开关变化时立即生效
  try {
    if (api.storage.onChanged && api.storage.onChanged.addListener) {
      api.storage.onChanged.addListener(function (changes) {
        if (changes && changes.compatEnabled) {
          enabled = changes.compatEnabled.newValue !== false;
          if (enabled) ready();
        }
      });
    }
  } catch (e) {
    /* 忽略 */
  }
})();
