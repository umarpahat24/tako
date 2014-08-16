/* TaKo v1.2.1 - 16/08/2014
   http://takojs.com
   Copyright (c) 2014 Iñigo Gonzalez Vazquez <ingonza85@gmail.com> (@haas85) - Under MIT License */
(function() {
  var FOOTER_HEIGHT, HEADER_HEIGHT, NAV_HEIGHT, Select, Tako, generateStyle, _articleListeners, _fallback, _navigate, _style,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.Tako = window.tk = Tako = (function() {
    var callbacks, init, logging, onReady, remaining, viewType, _doubletap, _loaded, _navigate, _onError, _onReceive, _setNavigation, _setup, _tap;
    logging = {};
    Object.defineProperty(logging, "LOG", {
      get: function() {
        return 4;
      }
    });
    Object.defineProperty(logging, "INFO", {
      get: function() {
        return 3;
      }
    });
    Object.defineProperty(logging, "WARN", {
      get: function() {
        return 2;
      }
    });
    Object.defineProperty(logging, "ERROR", {
      get: function() {
        return 1;
      }
    });
    if ($.os.wp) {
      _tap = "click";
      _doubletap = "dblclick";
    } else {
      _tap = "tap";
      _doubletap = "doubletap";
    }
    remaining = 0;
    callbacks = [];
    init = function(options) {
      var article, exception, _i, _len, _ref, _results;
      if (options == null) {
        options = {};
      }
      try {
        Tako.logging.level = options.logging || false;
        if (options.articles != null) {
          remaining = options.articles.length;
          _ref = options.articles;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            article = _ref[_i];
            _results.push($.ajax({
              url: article,
              crossDomain: true,
              dataType: 'html',
              success: _onReceive,
              error: _onError
            }));
          }
          return _results;
        } else {
          return _setup();
        }
      } catch (_error) {
        exception = _error;
        return console.error(exception);
      }
    };
    onReady = function(callback) {
      return callbacks.push(callback);
    };
    viewType = function() {
      var height, width;
      width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      height = window.innerHeight > 0 ? window.innerHeight : screen.height;
      if ((width > 768) && (width > height)) {
        return "TABLET/DESKTOP";
      } else {
        return "PHONE";
      }
    };
    _setup = function() {
      var element, hash, _current_art, _current_section, _i, _len, _ref;
      hash = document.location.hash || "";
      if (hash !== "" && hash !== "#") {
        hash = hash.replace("#", "");
        hash = hash.split("/");
      }
      if (hash.length === 2) {
        document.getElementById(hash[0]).classList.add("active");
        document.getElementById(hash[1]).classList.add("active");
      } else {
        if (document.querySelectorAll("article.active").length === 0) {
          $("article").first().addClass("active");
        }
      }
      Array.prototype.forEach.call(document.getElementsByTagName("section"), function(el) {
        return el.appendChild($(document.createElement("div")).append($(el).children())[0]);
      });
      $("article").each(function() {
        var el, _i, _len, _ref, _results;
        if (this.getElementsByTagName("header").length !== 0) {
          this.setAttribute("data-header", "");
        }
        if (this.getElementsByTagName("footer").length !== 0) {
          this.setAttribute("data-footer", "");
        }
        if (this.querySelector("section.active") == null) {
          _ref = this.children;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            if (el.nodeName === "SECTION") {
              el.classList.add("active");
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        }
      });
      Array.prototype.forEach.call(document.querySelectorAll("article > nav"), function(el) {
        return el.parentElement.setAttribute("data-nav", "");
      });
      _current_section = document.querySelector("article.active section.active");
      _current_art = _current_section.parentElement.id;
      _current_section = _current_section.id;
      Array.prototype.forEach.call(document.querySelectorAll("[data-visible=" + _current_section + "]"), function(el) {
        return el.classList.add("show");
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-section=" + _current_section + "]"), function(el) {
        return el.classList.add("current");
      });
      Array.prototype.forEach.call(document.querySelectorAll("[data-article=" + _current_art + "]"), function(el) {
        return el.classList.add("current");
      });
      _setNavigation("aside", "data-article", Tako.Article, "tap");
      _setNavigation("aside", "data-section", Tako.Section, "tap");
      _setNavigation("article", "data-article", Tako.Article, "click");
      _setNavigation("article", "data-section", Tako.Section, "click");
      _ref = document.querySelectorAll("[data-action=aside]");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element.addEventListener("click", (function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          return Tako.Aside.toggle();
        }), false);
      }
      _fallback();
      _articleListeners();
      return _loaded();
    };
    _setNavigation = function(container, query, action, event) {
      return $("" + container + " [" + query + "]").each(function(element) {
        return $(this).on(event, function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          return _navigate(action, ev.target, query);
        });
      });
    };
    _onReceive = function(data) {
      remaining--;
      $("body").append(data);
      if (remaining === 0) {
        return _setup();
      }
    };
    _onError = function() {
      remaining--;
      console.error("Article not downloaded");
      if (remaining === 0) {
        return _setup();
      }
    };
    _loaded = function() {
      var cb, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        cb = callbacks[_i];
        _results.push(cb.call(cb));
      }
      return _results;
    };
    _navigate = function(action, target, query) {
      var nav;
      if (target != null) {
        nav = target.attributes.getNamedItem(query);
        if (nav != null) {
          return action(nav.value);
        } else {
          return _navigate(action, target.parentElement, query);
        }
      }
    };
    return {
      init: init,
      onReady: onReady,
      viewType: viewType,
      tap: _tap,
      double_tap: _doubletap,
      logging: logging
    };
  })();

  Tako.Article = (function(TK) {
    var current, goTo, _current;
    goTo = function(article_id, back) {
      var el, modifier, width, _current;
      if (back == null) {
        back = false;
      }
      el = current();
      modifier = back ? "back-" : "";
      if (el.length === 0 && el[0].id !== article_id) {
        width = el.offset().width;
        el.removeClass("active");
        el.attr("data-direction", "" + modifier + "out");
        _current = $("article#" + article_id).attr("data-direction", "" + modifier + "in");
        if (Tako.viewType() === "TABLET/DESKTOP" && document.getElementsByTagName("aside").length !== 0) {
          el.addClass("asided").css("width", "" + width + "px");
          _current.addClass("asided").css("width", "" + width + "px");
        }
        $(".current[data-article]").removeClass("current");
        $("[data-article=" + article_id + "]").addClass("current");
        return true;
      } else {
        return false;
      }
    };
    current = function() {
      var _current;
      if (typeof _current !== "undefined" && _current !== null) {
        return _current;
      } else {
        return _current = $("article.active");
      }
    };
    _current = null;
    return function(id, back) {
      if (id != null) {
        return goTo(id, back);
      } else {
        return current();
      }
    };
  })(Tako);

  Tako.Article.title = function(html, article_id) {
    var el;
    if (article_id == null) {
      el = Tako.Article().children("header").children("h1");
    } else {
      el = $("article#" + article_id).children("header").children("h1");
    }
    if (el.length === 1) {
      if (html != null) {
        return el.html(html);
      } else {
        return el.html();
      }
    }
  };

  _articleListeners = function() {
    return $("article").on("animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd", function(event) {
      var _navigate;
      if (event.target.nodeName.toUpperCase() === "ARTICLE") {
        if ((event.target.getAttribute("data-direction") === "in") || (event.target.getAttribute("data-direction") === "back-in")) {
          event.target.classList.add("active");
          $(event.target).trigger("load");
          _navigate = false;
          document.location.hash = "#" + (document.querySelector("article.active").id) + "/" + (document.querySelector("article.active section.active").id);
          _navigate = true;
        } else {
          $(event.target).trigger("unload");
        }
        event.target.removeAttribute("data-direction");
        if (Tako.viewType() === "TABLET/DESKTOP") {
          event.target.classList.remove("asided");
          return event.target.style.width = "auto";
        }
      }
    });
  };

  Tako.Aside = (function(TK) {
    var aside, bck, hide, show, toggle;
    aside = $("aside");
    if (aside.length > 0) {
      bck = null;
      bck = $('<div data-element="aside_background"></div>');
      $("body").append(bck);
      if (aside.hasClass("full")) {
        bck.addClass("full");
      }
      show = function() {
        bck.removeClass("hide").addClass("show");
        return aside.addClass("show");
      };
      hide = function() {
        aside.removeClass("show");
        bck.addClass("hide");
        return setTimeout((function() {
          return bck.removeClass("show");
        }), 150);
      };
      toggle = function() {
        if (TK.viewType() === "PHONE") {
          if (aside.hasClass("show")) {
            return hide();
          } else {
            return show();
          }
        }
      };
      $("aside *").each(function(index) {
        return $(this).on("tap click", function(ev) {
          return hide();
        });
      });
      bck.on("tap click", function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        return hide();
      });
      return {
        show: show,
        hide: hide,
        toggle: toggle
      };
    }
  })(Tako);

  _navigate = true;

  $(window).on("hashchange", function() {
    var hash;
    if (_navigate) {
      hash = document.location.hash || "";
      if (hash !== "" && hash !== "#") {
        hash = hash.replace("#", "");
        hash = hash.split("/");
        if (hash.length = 2) {
          return Tako.Section(hash[1]);
        }
      }
    }
  });

  Tako.Section = (function(TK) {
    var current, goTo, _current;
    goTo = function(section_id, back) {
      var modifier, new_article, new_section, _current, _current_article, _current_section;
      if (back == null) {
        back = false;
      }
      _current_section = current();
      _current_article = _current_section.parent();
      modifier = back ? "back-" : "";
      new_section = $("section#" + section_id);
      if (new_section.length === 0) {
        return false;
      }
      new_article = new_section.parent();
      console.log(new_section);
      console.log(_current_section);
      if (_current_section[0].id !== new_section[0].id) {
        new_article.children(".active").removeClass("active");
        _current = new_section.addClass("active");
      }
      if (_current_article[0].id !== new_article[0].id) {
        Tako.Article(new_article[0].id, back);
      }
      if (new_section.attr("data-scrolltop") != null) {
        new_section.scrollTop(0);
      }
      _navigate = false;
      document.location.hash = "#" + new_article[0].id + "/" + section_id;
      _navigate = true;
      _current_section.trigger("unload");
      new_section.trigger("load");
      $(".current[data-section]").removeClass("current");
      $("[data-section=" + section_id + "]").addClass("current");
      $("[data-visible]").removeClass("show");
      $("[data-visible=" + section_id + "]").addClass("show");
      return true;
    };
    current = function() {
      var _current;
      if (typeof _current !== "undefined" && _current !== null) {
        return _current;
      } else {
        return _current = $("article.active section.active");
      }
    };
    _current = null;
    return function(id, back) {
      if (id != null) {
        return goTo(id, back);
      } else {
        return current();
      }
    };
  })(Tako);

  Tako.Connection = (function() {
    var _callbacks, _state, _stateChange;
    _state = navigator.onLine;
    _callbacks = [];
    _stateChange = function(online) {
      var cb, _i, _len, _results;
      if (_state !== online) {
        _state = online;
        _results = [];
        for (_i = 0, _len = _callbacks.length; _i < _len; _i++) {
          cb = _callbacks[_i];
          _results.push(cb.call(cb, online));
        }
        return _results;
      }
    };
    $(window).on("online", function() {
      return _stateChange(true);
    });
    $(window).on("offline", function() {
      return _stateChange(false);
    });
    return {
      isOnline: function() {
        return navigator.onLine;
      },
      onChange: function(cb) {
        return _callbacks.push(cb);
      }
    };
  })();

  Tako.DB = (function() {
    return {
      manager: null,
      create: function(name, schema, version, size, callback) {
        this.manager = new WebDB(name, schema, version, size, callback);
        return this.db = this.manager.db;
      },
      select: function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager.select.apply(this.manager, arguments);
      },
      insert: function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager.insert.apply(this.manager, arguments);
      },
      update: function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager.update.apply(this.manager, arguments);
      },
      "delete": function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager["delete"].apply(this.manager, arguments);
      },
      drop: function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager.drop.apply(this.manager, arguments);
      },
      execute: function() {
        if (this.manager == null) {
          throw "Database not initializated";
        }
        return this.manager.execute.apply(this.manager, arguments);
      }
    };
  })();

  _fallback = function() {
    var inputs, section_inputs, _android, _blackberry, _browser, _firefoxOs, _ios, _softKeyboard, _wp;
    inputs = "input[type=\"text\"], input[type=\"password\"], input[type=\"date\"], input[type=\"datetime\"], input[type=\"email\"], input[type=\"number\"], input[type=\"search\"], input[type=\"tel\"], input[type=\"time\"], input[type=\"url\"], textarea";
    section_inputs = "section input[type=\"text\"], section input[type=\"password\"], section input[type=\"date\"], section input[type=\"datetime\"], section input[type=\"email\"], section input[type=\"number\"], section input[type=\"search\"], section input[type=\"tel\"], section input[type=\"time\"], section input[type=\"url\"], section textarea";
    _softKeyboard = function(elem, offset) {
      var container, top;
      if (offset == null) {
        offset = 0;
      }
      top = elem.getBoundingClientRect().top;
      container = $(elem).parents(["section.active"]);
      return container.scrollTop(top - container[0].getBoundingClientRect().top - offset);
    };
    _android = function() {
      var android_23, android_4;
      $("body").attr("data-os", "android");
      android_4 = new RegExp("^4[\.]");
      android_23 = new RegExp("^2[\.]3");
      if (android_4.test($.os.version)) {
        $(section_inputs).on("focus", function() {
          return setTimeout(((function(_this) {
            return function() {
              return _softKeyboard(_this, 20);
            };
          })(this)), 400);
        });
        $("select").on("focus", function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          return Select($(ev.target));
        });
      }
      if (android_23.test($.os.version)) {
        $("body").attr("data-version", "2.3");
        $("body").append($("<article data-selectbox><div></div></article>"));
        return $("select").on("focus", function(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          return Select($(ev.target));
        });
      }
    };
    _ios = function() {
      return $("body").attr("data-os", "ios");
    };
    _wp = function() {
      return $("body").attr("data-os", "wp");
    };
    _blackberry = function() {
      return $("body").attr("data-os", "blackberry");
    };
    _firefoxOs = function() {
      return $("body").attr("data-os", "firefoxos");
    };
    _browser = function() {
      if ($.browser.firefox) {
        return $("body").attr("data-browser", "firefox");
      }
      if ($.browser.ie) {
        return $("body").attr("data-browser", "ie");
      }
      if ($.browser.chrome) {
        return $("body").attr("data-browser", "chrome");
      }
      if ($.browser.safari) {
        return $("body").attr("data-browser", "safari");
      }
    };
    if ($.os.android) {
      return _android();
    }
    if ($.os.ios) {
      return _ios();
    }
    if ($.os.wp) {
      return _wp();
    }
    if ($.os.blackberry || $.os.bb10 || $.os.playbook) {
      return _blackberry();
    }
    if ($.browser.firefox && ($.os.phone || $.os.tablet)) {
      return _firefoxOs();
    }
    if ($.browser != null) {
      return _browser();
    }
  };

  Tako.log = function() {
    if (Tako.logging.level >= 4) {
      return console.log.apply(console, arguments);
    }
  };

  Tako.info = function() {
    if (Tako.logging.level >= 3) {
      return console.info.apply(console, arguments);
    }
  };

  Tako.warn = function() {
    if (Tako.logging.level >= 2) {
      return console.warn.apply(console, arguments);
    }
  };

  Tako.error = function() {
    if (Tako.logging.level >= 1) {
      return console.error.apply(console, arguments);
    }
  };

  Tako.Notification = (function(TK) {
    var active, callback, confirm, custom, error, hide, loading, notification, notification_article, progress, success, timeout, _close, _hide, _iconHtml, _ontap, _show;
    active = false;
    notification = $("<div data-element=\"notification\"><div></div</div>");
    notification_article = $("<article class=\"window\"></article>");
    notification.find("div").append(notification_article);
    $("body").append(notification);
    timeout = null;
    callback = null;
    success = function(icon, title, content, time_out, cb) {
      var html;
      if (icon == null) {
        icon = "ok";
      }
      html = _iconHtml(icon, title, content);
      return _show(html, "success center upwards", time_out, cb);
    };
    error = function(icon, title, content, time_out, cb) {
      var html;
      if (icon == null) {
        icon = "deny";
      }
      html = _iconHtml(icon, title, content);
      return _show(html, "error center downwards", time_out, cb);
    };
    loading = function() {
      var args, cb, classes, html, icon, time_out, title;
      title = arguments[0], time_out = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if ((args[0] != null) && typeof args[0] === "string") {
        icon = args[0];
        cb = args[1];
      } else {
        icon = "spin6";
        cb = args[0];
      }
      html = "";
      classes = "loading center not_clickable";
      if (title != null) {
        html = "<header>\n    <span>" + title + "</span>\n</header>";
      } else {
        classes += " squared";
      }
      html += "<section>\n  <span class=\"icon " + icon + " animated\"></span>\n</section>";
      return _show(html, classes, time_out, cb);
    };
    progress = function(icon, title, content, time_out, cb) {
      var html;
      html = "<header class=\"" + (icon != null ? 'align-left' : 'center') + "\">";
      if (icon != null) {
        html += "<span class=\"icon " + icon + "\"></span>";
      }
      html += "<span>" + title + "</span>\n</header>\n<section>\n  <span class=\"content\">" + content + "</span>\n  <div id=\"notification_progress\"></div><div style=\"clear:both\"></div>\n</section>";
      _show(html, "center progress not_clickable", time_out, cb);
      progress = TK.ProgressBar("notification_progress", 0);
      return {
        percent: function(value) {
          var val;
          val = progress.percent(value);
          if (val === 100) {
            setTimeout((function() {
              return hide();
            }), 150);
          }
          return val;
        }
      };
    };
    confirm = function(icon, title, content, accept, cancel, cb) {
      var buttons, html;
      if (icon == null) {
        icon = "help-circled";
      }
      if (accept == null) {
        accept = "Accept";
      }
      if (cancel == null) {
        cancel = "Cancel";
      }
      html = "<section>\n  <span class=\"icon " + icon + "\"></span>\n  <div>\n    <span class=\"title\">" + title + "</span><br>\n    <span class=\"content padding bottom clear\">" + content + "</span>\n  </div>\n</section>\n<footer>\n  <button class=\"button accept\">" + accept + "</button>\n  <button class=\"button cancel\">" + cancel + "</button>\n</footer>";
      _show(html, "center confirm not_clickable", null, null);
      buttons = notification_article.find("button");
      window.but = buttons;
      return buttons.each(function(index, element) {
        return $(this).on(Tako.tap, (function(_this) {
          return function(ev) {
            $(_this).off(Tako.tap);
            hide();
            if ($(_this).hasClass("accept")) {
              return cb.call(cb, true);
            } else {
              return cb.call(cb, false);
            }
          };
        })(this));
      });
    };
    custom = function(title, content, closable, classes, timeout, cb) {
      var header, html;
      if (closable == null) {
        closable = true;
      }
      if (classes == null) {
        classes = "";
      }
      header = "";
      if ((title != null) && closable) {
        header = "<header>\n  <span class=\"close icon deny\"></span>\n  <h1>\n    <span>" + title + "</span>\n  </h1>\n</header>";
      } else if (title != null) {
        header = "<header><h1>\n  <span>" + title + "</span>\n</h1></header>";
      }
      html = "" + header + "\n<section>";
      if (closable && (title == null)) {
        html += "<span class=\"close black icon deny\"></span>";
      }
      html += "" + content + "\n</section>";
      _show(html, "center custom not_clickable " + classes, timeout, cb);
      return notification.find(".close").on(Tako.tap, _close);
    };
    hide = function() {
      active = false;
      clearTimeout(timeout);
      timeout = null;
      notification_article.removeClass("show");
      return setTimeout(_hide, 500);
    };
    _iconHtml = function(icon, title, content) {
      return "<header>\n  <span class=\"icon " + icon + "\"></span>\n</header>\n<section>\n  <span class=\"title\">" + title + "</span>\n  <span class=\"content\">" + content + "</span>\n</section>";
    };
    _show = function(html, classes, time_out, cb) {
      var original_cb;
      if (!active) {
        active = true;
        notification_article.removeClass();
        notification_article.addClass("window " + classes);
        notification_article.html(html);
        if (cb != null) {
          callback = cb;
        }
        if (time_out != null) {
          timeout = setTimeout(hide, time_out * 1000);
        }
        return setTimeout(((function(_this) {
          return function() {
            notification.addClass("show");
            return setTimeout((function() {
              var header, header_height;
              header = notification_article.children("header");
              header_height = header.length ? header.offset().height : 0;
              notification_article.children("section").css("maxHeight", "" + ((screen.height * 0.9) - header_height) + "px");
              return notification_article.addClass("show");
            }), 100);
          };
        })(this)), 10);
      } else {
        original_cb = callback;
        callback = function() {
          if (original_cb != null) {
            original_cb();
          }
          return _show(html, classes, timeout, cb);
        };
        return hide();
      }
    };
    _ontap = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (!notification_article.hasClass("not_clickable")) {
        active = false;
        clearTimeout(timeout);
        timeout = null;
        notification_article.removeClass("show");
        return setTimeout(_hide, 500);
      }
    };
    _close = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      active = false;
      clearTimeout(timeout);
      timeout = null;
      notification_article.removeClass("show");
      return setTimeout(_hide, 500);
    };
    _hide = function() {
      var cb;
      notification.removeClass("show");
      cb = callback;
      callback = null;
      if (cb != null) {
        return cb.call(cb);
      }
    };
    notification.on(Tako.tap, _ontap);
    return {
      active: function() {
        return active;
      },
      success: success,
      error: error,
      confirm: confirm,
      loading: loading,
      progress: progress,
      custom: custom,
      hide: hide
    };
  })(Tako);

  Tako.ProgressBar = function(container, value) {
    var Progress;
    Progress = (function() {
      Progress.prototype.el = null;

      Progress.prototype.fill = null;

      function Progress(container, value) {
        var PROGRESS;
        this.value = value != null ? value : 0;
        PROGRESS = "<span class=\"progress_bar\">\n  <span class=\"percent\" style=\"width:" + this.value + "%\"></span>\n</span>";
        this.el = $(PROGRESS);
        $("#" + container).append(this.el);
        this.fill = this.el.children(".percent");
      }

      Progress.prototype.percent = function(value) {
        if (value != null) {
          if (value < 0 || value > 100) {
            throw "Invalid value";
          }
          this.value = value;
          this.fill.css("width", "" + this.value + "%");
        }
        return this.value;
      };

      Progress.prototype.remove = function() {
        return this.el.remove();
      };

      return Progress;

    })();
    return new Progress(container, value);
  };

  (function() {
    var lastTime, vendors, x;
    lastTime = 0;
    vendors = ["ms", "moz", "webkit", "o"];
    x = 0;
    while (x < vendors.length && !window.requestAnimationFrame) {
      window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
      window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
      ++x;
    }
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        var currTime, id, timeToCall;
        currTime = new Date().getTime();
        timeToCall = Math.max(0, 16 - (currTime - lastTime));
        id = window.setTimeout(function() {
          return callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
    }
    if (!window.cancelAnimationFrame) {
      return window.cancelAnimationFrame = function(id) {
        return clearTimeout(id);
      };
    }
  })();

  Tako.Pull_Refresh = function(container, options) {
    var PullToRefresh;
    if (options == null) {
      options = {};
    }
    options.pullLabel = options.pullLabel || "Pull to refresh";
    options.releaseLabel = options.releaseLabel || "Release to refresh";
    options.refreshLabel = options.refreshLabel || "Loading...";
    options.onRefresh = options.onRefresh || void 0;
    container = document.getElementById(container);
    PullToRefresh = (function() {
      function PullToRefresh(container, options) {
        var PULLREFRESH, mc;
        this.options = options;
        this.updateHeight = __bind(this.updateHeight, this);
        this.hide = __bind(this.hide, this);
        this.setHeight = __bind(this.setHeight, this);
        this.onPull = __bind(this.onPull, this);
        PULLREFRESH = "<div class=\"pulltorefresh\">\n<span class=\"icon down-big\"></span><span class=\"text\">" + this.options.pullLabel + "</span>\n</div>";
        this.breakpoint = 90;
        this.container = container;
        this.pullrefresh = $(PULLREFRESH)[0];
        $(this.container).prepend(this.pullrefresh);
        this.icon = $(this.pullrefresh).find(".icon");
        this.text = $(this.pullrefresh).find(".text");
        this._slidedown_height = 0;
        this._anim = null;
        this._dragged_down = false;
        this.showRelease = false;
        mc = new Hammer.Manager($(this.container)[0]);
        mc.add(new Hammer.Pan({
          threshold: 0,
          pointers: 0
        }));
        mc.on("panmove", this.onPull);
        $(this.container).on("touchstart", (function(_this) {
          return function() {
            $(_this.container).addClass("pulling");
            if (!_this.refreshing) {
              return _this.hide(false);
            }
          };
        })(this));
        $(this.container).on("touchend", (function(_this) {
          return function() {
            if (_this.refreshing) {
              return;
            }
            cancelAnimationFrame(_this._anim);
            if (_this._slidedown_height >= _this.breakpoint) {
              if (_this.options.onRefresh) {
                return _this.onRefresh();
              } else {
                return _this.hide();
              }
            } else {
              return _this.hide();
            }
          };
        })(this));
      }

      PullToRefresh.prototype.onPull = function(ev) {
        this._dragged_down = true;
        if (this.container.scrollTop > 5) {
          return;
        }
        if (!this._anim) {
          this.updateHeight();
        }
        ev.srcEvent.preventDefault();
        ev.srcEvent.stopPropagation();
        ev.preventDefault();
        if (this._slidedown_height >= this.breakpoint) {
          this.onArrived();
        } else {
          if (this.showRelease) {
            this.onUp();
          }
        }
        if (ev.deltaY > 0) {
          return this._slidedown_height = ev.deltaY * 0.5;
        }
      };

      PullToRefresh.prototype.setHeight = function(height) {
        height -= 511;
        this.pullrefresh.style.transform = "translate(0, " + height + "px)";
        this.pullrefresh.style.webkitTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.mozTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.msTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.marginBottom = "" + height + "px";
        return this.pullrefresh.style.oTransform = "translate(0, " + height + "px)";
      };

      PullToRefresh.prototype.onRefresh = function() {
        this.icon[0].className = "icon spin6 animated";
        this.text.html(this.options.refreshLabel);
        this.setHeight(this.breakpoint - 10);
        this.refreshing = true;
        this.icon.removeClass("rotated");
        return this.options.onRefresh.call(this.options.onRefresh);
      };

      PullToRefresh.prototype.onArrived = function() {
        this.showRelease = true;
        this.icon.addClass("rotated");
        return this.text.html(this.options.releaseLabel);
      };

      PullToRefresh.prototype.onUp = function() {
        this.showRelease = false;
        this.icon.removeClass("rotated");
        return this.text.html(this.options.pullLabel);
      };

      PullToRefresh.prototype.hide = function(remove_pulling) {
        if (remove_pulling == null) {
          remove_pulling = true;
        }
        if (remove_pulling) {
          $(this.container).removeClass("pulling");
        }
        this.icon[0].className = "icon down-big";
        this.text.html(this.options.pullLabel);
        this._slidedown_height = 0;
        this.setHeight(0);
        this.icon.removeClass("rotated");
        cancelAnimationFrame(this._anim);
        this._anim = null;
        this._dragged_down = false;
        return this.refreshing = false;
      };

      PullToRefresh.prototype.updateHeight = function() {
        var height;
        height = this._slidedown_height - 511;
        this.pullrefresh.style.transform = "translate(0, " + height + "px)";
        this.pullrefresh.style.webkitTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.mozTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.msTransform = "translate(0, " + height + "px)";
        this.pullrefresh.style.marginBottom = "" + height + "px";
        this.pullrefresh.style.oTransform = "translate(0, " + height + "px)";
        return this._anim = requestAnimationFrame(this.updateHeight);
      };

      return PullToRefresh;

    })();
    return new PullToRefresh(container, options);
  };

  Select = function(element) {
    var child, container, list, selectbox, _createElement, _i, _len, _ref, _selected;
    _createElement = function(child) {
      var elem;
      elem = $("<li data-value=\"" + child.value + "\">" + child.text + "</li>");
      if (child.value === selectbox[0].value) {
        elem.addClass("theme");
      }
      elem.on("tap", function(ev) {
        return _selected(ev.target);
      });
      return elem;
    };
    _selected = function(el) {
      selectbox[0].value = el.getAttribute("data-value");
      selectbox.hide();
      setTimeout((function() {
        return selectbox.show();
      }), 1);
      return $("article[data-selectbox]").removeClass("show").html("<div></div>");
    };
    selectbox = element;
    container = $("<section data-selectbox=\"" + (selectbox.attr("id")) + "\"></section>");
    list = $("<ul></ul>");
    _ref = element.children();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      list.append(_createElement(child));
    }
    container.append(list);
    return $("article[data-selectbox]>div").append(container).parent().addClass("show");
  };

  HEADER_HEIGHT = 50;

  NAV_HEIGHT = 50;

  FOOTER_HEIGHT = 65;

  _style = document.createElement("style");

  document.body.appendChild(_style);

  generateStyle = function(heights) {
    var orientation, _code, _i, _len, _ref;
    _code = "";
    _ref = ["portrait", "landscape"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      orientation = _ref[_i];
      _code += "@media screen and (orientation: " + orientation + ") {\n  article[data-header] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - HEADER_HEIGHT) + "px;\n  }\n  article[data-nav] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - NAV_HEIGHT) + "px;\n  }\n  article[data-footer] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - FOOTER_HEIGHT) + "px;\n  }\n  article[data-header][data-nav] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - HEADER_HEIGHT - NAV_HEIGHT) + "px;\n  }\n  article[data-header][data-footer] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - HEADER_HEIGHT - FOOTER_HEIGHT) + "px;\n  }\n  article[data-nav][data-footer] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - NAV_HEIGHT - FOOTER_HEIGHT) + "px;\n  }\n  article[data-header][data-nav][data-footer] > section > div:not(.pulltorefresh){\n    min-height: " + (heights[orientation] - HEADER_HEIGHT - NAV_HEIGHT - FOOTER_HEIGHT) + "px;\n  }\n}";
    }
    return _style.innerHTML = _code;
  };

  generateStyle({
    portrait: screen.height,
    landscape: screen.width
  });

  (function() {
    var _clear, _get, _remove, _set;
    _get = function(type, key) {
      return JSON.parse(window[type].getItem(key));
    };
    _set = function(type, key, value) {
      return window[type].setItem(key, JSON.stringify(value));
    };
    _remove = function(type, key) {
      return window[type].removeItem(key);
    };
    _clear = function(type) {
      return window[type].clear();
    };
    Tako.Session = (function() {
      var _name;
      _name = "sessionStorage";
      return {
        get: function(key) {
          return _get(_name, key);
        },
        set: function(key, value) {
          return _set(_name, key, value);
        },
        remove: function(key) {
          return _remove(_name, key);
        },
        clear: function() {
          return _clear(_name);
        }
      };
    })();
    return Tako.Storage = (function() {
      var _name;
      _name = "localStorage";
      return {
        get: function(key) {
          return _get(_name, key);
        },
        set: function(key, value) {
          return _set(_name, key, value);
        },
        remove: function(key) {
          return _remove(_name, key);
        },
        clear: function() {
          return _clear(_name);
        }
      };
    })();
  })();

}).call(this);
