/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * test class
 */
 
LazyLoad = (function (win, doc) {
  var env,
  head,
  pending = {},
  pollCount = 0,
  queue = {css: [], js: []},
  styleSheets = doc.styleSheets;

  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      if (!urls.length) {
        if (callback) {
          callback.call(p.context, p.obj);
        }

        pending[type] = null;

        if (queue[type].length) {
          load(type);
        }
      }
    }
  }

  function getEnv() {
    if (env) { return; }

    var ua = navigator.userAgent;

    env = {
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        i, len, node, p, pendingUrls, url;

    getEnv();

    if (urls) {
      urls = typeof urls === 'string' ? [urls] : urls.concat();

       if (isCSS || env.async || env.gecko || env.opera) {
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls;

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
        node = createNode('link', {
          charset: 'utf-8',
          'class': 'lazyload',
          href   : url,
          rel    : 'stylesheet',
          type   : 'text/css'
        });
      } else {
        node = createNode('script', {
          charset: 'utf-8',
          'class': 'lazyload',
          src    : url
        });

        node.async = false;
      }

      if (env.ie) {
        node.onreadystatechange = function () {
          var readyState = this.readyState;

          if (readyState === 'loaded' || readyState === 'complete') {
            this.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        if (env.webkit) {
          p.urls[i] = node.href;
          poll();
        } else {
          setTimeout(_finish, 50 * len);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      head.appendChild(node);
    }
  }

  function poll() {
    var css = pending.css, i;

    if (!css) {
      return;
    }

    i = styleSheets.length;

    while (i && --i) {
      if (styleSheets[i].href === css.urls[0]) {
        finish('css');
        break;
      }
    }

    pollCount += 1;

    if (css) {
      if (pollCount < 200) {
        setTimeout(poll, 50);
      } else {
        finish('css');
      }
    }
  }

  return {
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this, this.document);
