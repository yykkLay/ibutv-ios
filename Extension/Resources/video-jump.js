/*
 * video-jump.js
 * 在 B 站 / 芒果 / 优酷 / 腾讯 / 爱奇艺等视频播放页的右下角，
 * 插入一个「用 ibutv 播放」按钮。点一下，把当前页面的地址交给 ibutv，
 * 效果等同于原桌面插件的“跳转采集”动作。
 *
 * 不做自动跳转，避免影响你在这些网站的正常浏览。
 */

(function () {
  'use strict';

  if (window.top !== window) return;                 // 只在主框架运行
  if (document.getElementById('xstree-ios-jump')) return;   // 防止重复插入

  var IBUTV_BASE = 'https://ibutv.com/#/video/collect?url=';

  function currentPageUrl() {
    // 与原插件一致：丢掉查询参数，只保留干净的播放页地址
    return location.href.split('?')[0];
  }

  function buildTarget() {
    return IBUTV_BASE + encodeURIComponent(currentPageUrl());
  }

  function inject() {
    if (document.getElementById('xstree-ios-jump')) return;

    var box = document.createElement('div');
    box.id = 'xstree-ios-jump';
    box.style.cssText = [
      'position:fixed',
      'right:14px',
      'bottom:96px',
      'z-index:2147483646',
      'display:flex',
      'flex-direction:column',
      'gap:6px',
      'align-items:flex-end',
      'font:13px/1.4 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif'
    ].join(';');

    var btn = document.createElement('a');
    btn.textContent = '用 ibutv 播放';
    btn.href = buildTarget();
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.style.cssText = [
      'display:inline-block',
      'padding:8px 14px',
      'border-radius:999px',
      'background:rgba(20,20,28,.86)',
      'color:#7CFC00',
      'text-decoration:none',
      'box-shadow:0 2px 10px rgba(0,0,0,.35)',
      'white-space:nowrap'
    ].join(';');

    var close = document.createElement('span');
    close.textContent = '×';
    close.style.cssText = [
      'cursor:pointer',
      'color:rgba(255,255,255,.55)',
      'font-size:16px',
      'padding:0 6px'
    ].join(';');
    close.addEventListener('click', function () {
      box.remove();
    });

    box.appendChild(close);
    box.appendChild(btn);
    (document.body || document.documentElement).appendChild(box);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
