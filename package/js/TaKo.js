/* TaKo v0.1.0 - 11/12/2013
   http://
   Copyright (c) 2013  - Licensed  */
(function(){var a;window.TaKo=a={};a.init=function(){if($("section.active").length===0){$("section").first().addClass("active")}return $("section").each(function(){if($(this).children("article.active").length===0){return $(this).children("article").first().addClass("active")}})}}).call(this);(function(){TaKo.Article=function(a){var b;b=function(a){var b,c,d,e;b=$("section.active article.active");c=b.parent();d=$("article#"+a);e=d.parent();if(b[0].id!==d[0].id){e.children().removeClass("active");d.addClass("active")}if(c[0].id!==e[0].id){return TaKo.Section.goTo(e[0].id)}};$("[data-article]").each(function(a){var c=this;return $(this).bind("click",function(){return b($(c).attr("data-article"))})});return{goTo:b}}(TaKo)}).call(this);(function(){TaKo.Aside=function(a){var b,c,d,e,f;b=$("aside");if(b.length>0){$("body").append('<div data-element="aside_background"></div>')}c=$("[data-element=aside_background]");e=function(){c.addClass("show");return b.addClass("show")};d=function(){b.removeClass("show");return c.removeClass("show")};f=function(){if(b.hasClass("show")){return d()}else{return e()}};$("[data-action=aside]").each(function(a){return $(this).bind("click",function(){return f()})});return{show:e,hide:d,toggle:f}}(TaKo)}).call(this);(function(){TaKo.Notification=function(a){var b,c,d,e,f,g,h;b=false;$("body").append('<div data-element="notification">\n  <div class="window">\n    <span class="title"></span>\n    <div class="content"></div>\n    </div>\n</div>');e=$("div[data-element=notification]");f=e.children(".window");h=null;c=null;g=function(a,g,i,j){if(!b){b=true;f.children(".title").html(a);f.children(".content").html(g);e.addClass("show");if(j!=null){c=j}if(i!=null){return h=setTimeout(d,i*1e3)}}};d=function(){b=false;clearTimeout(h);h=null;e.removeClass("show");if(c!=null){c.call(c)}return c=null};e.bind("click",d);return{show:g,hide:d}}(TaKo)}).call(this);(function(){TaKo.Section=function(a){var b;b=function(a){$("section.active").removeClass("active");return $("section#"+a).addClass("active")};$("[data-section]").each(function(a){var c=this;return $(this).bind("click",function(){return b($(c).attr("data-section"))})});return{goTo:b}}(TaKo)}).call(this);