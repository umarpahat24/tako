/* TaKo v1.0.1 - 18/03/2014
   http://takojs.com
   Copyright (c) 2014 Iñigo Gonzalez Vazquez <ingonza85@gmail.com> (@haas85) - Under MIT License */
(function(){var a,b,c=[].slice,d=function(a,b){return function(){return a.apply(b,arguments)}};window.Tako=a=function(){var c,d,e,f,g,h,i,j,k,l;f=0;c=[];d=function(a){var b,c,d,e,g,h;if(a==null){a={}}try{if(a.articles!=null){f=a.articles.length;g=a.articles;h=[];for(d=0,e=g.length;d<e;d++){b=g[d];h.push($.ajax({url:b,crossDomain:true,success:j,error:i}))}return h}else{return l()}}catch(k){c=k;return console.error(c)}};e=function(a){return c.push(a)};g=function(){var a,b;b=window.innerWidth>0?window.innerWidth:screen.width;a=window.innerHeight>0?window.innerHeight:screen.height;if(b>768&&b>a){return"TABLET/DESKTOP"}else{return"PHONE"}};l=function(){var c;if($("article.active").length===0){$("article").first().addClass("active")}$("body").hammer();$("article").each(function(){if($(this).children("section.active").length===0){return $(this).children("section").first().addClass("active")}});c=$("article.active section.active")[0].id;$("[data-visible="+c+"]").addClass("show");$("[data-section="+$("article.active section.active").attr("id")+"]").addClass("current");$("[data-article="+$("article.active").attr("id")+"]").addClass("current");k("data-article",a.Article);k("data-section",a.Section);$("[data-action=aside]").each(function(b){return $(this).on("tap",function(b){b.preventDefault();b.stopPropagation();return a.Aside.toggle()})});b();return h()};k=function(a,b){return $("["+a+"]").each(function(c){if(this.nodeName==="LI"){$(this).children().each(function(){return $(this).bind("tap",function(c){c.preventDefault();c.stopPropagation();return b($(this).parent().attr(a))})})}return $(this).bind("tap",function(c){c.preventDefault();c.stopPropagation();return b($(c.target).attr(a))})})};j=function(a){f--;$("body").append(a);if(f===0){return l()}};i=function(a){f--;console.error("Article not downloaded");if(f===0){return l()}};h=function(){var a,b,d,e;e=[];for(b=0,d=c.length;b<d;b++){a=c[b];e.push(a.call(a))}return e};return{init:d,onReady:e,viewType:g}}();a.Article=function(a){var b,c,d;c=function(a){var c,d;c=b();if(c[0].id!==a){c.removeClass("active");c.children("article.active").trigger("unload");window.scrollTo(0,0);d=$("article#"+a).addClass("active");d.children("article.active").trigger("load");$(".current[data-article]").removeClass("current");return $("[data-article="+a+"]").addClass("current")}};b=function(){var a;if(typeof a!=="undefined"&&a!==null){return a}else{return a=$("article.active")}};d=null;return function(a){console.log(a);if(a!=null){return c(a)}else{return b()}}}(a);a.Article.title=function(b,c){var d;if(c==null){d=a.Article().children("header").children("h1")}else{d=$("article#"+c).children("header").children("h1")}if(d.length===1){if(b!=null){return d.html(b)}else{return d.html()}}};a.Aside=function(a){var b,c,d,e,f;b=$("aside");if(b.length>0){c=null;c=$('<div data-element="aside_background"></div>');$("body").append(c);if(b.hasClass("full")){c.addClass("full")}e=function(){c.removeClass("hide").addClass("show");return b.addClass("show")};d=function(){b.removeClass("show");c.addClass("hide");return setTimeout(function(){return c.removeClass("show")},150)};f=function(){if(a.viewType()==="PHONE"){if(b.hasClass("show")){return d()}else{return e()}}};$("aside *").each(function(a){return $(this).on("tap",function(a){a.preventDefault();a.stopPropagation();return d()})});c.on("tap",function(a){a.preventDefault();a.stopPropagation();return d()});return{show:e,hide:d,toggle:f}}}(a);a.Section=function(b){var c,d,e;d=function(b){var d,e,f,g,h;h=c();g=h.parent();e=$("section#"+b);d=e.parent();if(h[0].id!==e[0].id){d.children().removeClass("active");f=e.addClass("active")}if(g[0].id!==d[0].id){a.Section(d[0].id)}else{h.trigger("unload");f=e.trigger("load")}$(".current[data-section]").removeClass("current");$("[data-section="+b+"]").addClass("current");$("[data-visible]").removeClass("show");return $("[data-visible="+b+"]").addClass("show")};c=function(){var a;if(typeof a!=="undefined"&&a!==null){return a}else{return a=$("article.active section.active")}};e=null;return function(a){console.log(a);if(a!=null){return d(a)}else{return c()}}}(a);a.ProgressBar=function(a,b){var c;c=function(){a.prototype.el=null;a.prototype.fill=null;function a(a,b){var c;this.value=b!=null?b:0;c='<span class="progress_bar">\n  <span class="percent" style="width:'+this.value+'%"></span>\n</span>';this.el=$(c);$("#"+a).append(this.el);this.fill=this.el.children(".percent")}a.prototype.percent=function(a){if(a!=null){if(a<0||a>100){throw"Invalid value"}this.value=a;this.fill.css("width",""+this.value+"%")}return this.value};a.prototype.remove=function(){return this.el.remove()};return a}();return new c(a,b)};a.Connection=function(){var a,b,c;b=navigator.onLine;a=[];c=function(c){var d,e,f,g;if(b!==c){b=c;g=[];for(e=0,f=a.length;e<f;e++){d=a[e];g.push(d.call(d,c))}return g}};$(window).on("online",function(){return c(true)});$(window).on("offline",function(){return c(false)});return{isOnline:function(){return navigator.onLine},onChange:function(b){return a.push(b)}}}();a.DB=function(){return{manager:null,create:function(a,b,c,d,e){this.manager=new WebDB(a,b,c,d,e);return this.db=this.manager.db},select:function(){if(this.manager==null){throw"Database not initializated"}return this.manager.select.apply(this.manager,arguments)},insert:function(){if(this.manager==null){throw"Database not initializated"}return this.manager.insert.apply(this.manager,arguments)},update:function(){if(this.manager==null){throw"Database not initializated"}return this.manager.update.apply(this.manager,arguments)},"delete":function(){if(this.manager==null){throw"Database not initializated"}return this.manager["delete"].apply(this.manager,arguments)},drop:function(){if(this.manager==null){throw"Database not initializated"}return this.manager.drop.apply(this.manager,arguments)},execute:function(){if(this.manager==null){throw"Database not initializated"}return this.manager.execute.apply(this.manager,arguments)}}}();b=function(){var a,b,c,d,e,f,g,h,i;c="<style>";a=$(window).height();c+="";b='input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="time"], input[type="url"], textarea';h=function(a){return a.each(function(){return $(this).append($(document.createElement("div")).append($(this).children()))})};i=function(a,b){var c,d;if(b==null){b=0}d=a.getBoundingClientRect().top;c=$(a).parents(["section.active"]);return c.scrollTop(d-c[0].getBoundingClientRect().top-b)};d=function(){h($("body > article > section"));return $(b).on("focus",function(){return setTimeout(function(a){return function(){return i(a,20)}}(this),400)})};g=function(){h($("body > article > section"));$(b).on("tap",function(){return $(this).focus()});$(b).on("focus",function(){$("body").height($(window).height());return setTimeout(function(a){return function(){return i(a,50)}}(this),700)});return $(b).on("blur",function(){return $("body").height("100%")})};f=function(){if($.os!=null&&$.os.phone){return h($("body > article > section.indented"))}};e=function(){if(!$.os.tablet&&!$.os.phone){return h($("body > article > section.indented"))}};if(navigator.userAgent.toLowerCase().indexOf("firefox")!==-1){f()}if($.os!=null&&$.os.android){d()}if($.os!=null&&$.os.ios){g()}if($.browser!=null){return e()}};a.Notification=function(a){var b,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;b=false;j=$('<div data-element="notification"><div></div</div>');k=$('<article class="window"></article>');j.find("div").append(k);$("body").append(j);n=null;d=null;m=function(a,b,c,d,e){var f;if(a==null){a="ok"}f=q(a,b,c);return s(f,"success center upwards",d,e)};g=function(a,b,c,d,e){var f;if(a==null){a="cancel"}f=q(a,b,c);return s(f,"error center downwards",d,e)};i=function(){var a,b,d,e,f,g,h;h=arguments[0],g=arguments[1],a=3<=arguments.length?c.call(arguments,2):[];if(a[0]!=null&&typeof a[0]==="string"){f=a[0];b=a[1]}else{f="spin6";b=a[0]}e="";d="loading center not_clickable";if(h!=null){e="<header>\n    <span>"+h+"</span>\n</header>"}else{d+=" squared"}e+='<section>\n  <span class="icon '+f+' animated"></span>\n</section>';return s(e,d,g,b)};l=function(b,c,d,e,f){var g;g='<header class="'+(b!=null?"align-left":"center")+'">';if(b!=null){g+='<span class="icon '+b+'"></span>'}g+="<span>"+c+'</span>\n</header>\n<section>\n  <span class="content">'+d+'</span>\n  <div id="notification_progress"></div><div style="clear:both"></div>\n</section>';s(g,"center progress not_clickable",e,f);l=a.ProgressBar("notification_progress",0);return{percent:function(a){var b;b=l.percent(a);if(b===100){setTimeout(function(){return h()},150)}return b}}};e=function(a,b,c,d,e,f){var g,i;if(a==null){a="help-circled"}if(d==null){d="Accept"}if(e==null){e="Cancel"}i='<section>\n  <span class="icon '+a+'"></span>\n  <div>\n    <span class="title">'+b+'</span><br>\n    <span class="content padding bottom clear">'+c+'</span>\n  </div>\n</section>\n<footer>\n  <button class="button accept">'+d+'</button>\n  <button class="button cancel">'+e+"</button>\n</footer>";s(i,"center confirm not_clickable",null,null);g=k.find("button");return g.bind("tap",function(a){g.unbind("tap");h();if($(this).hasClass("accept")){return f.call(f,true)}else{return f.call(f,false)}})};f=function(a,b,c,d,e,f){var g,h;if(c==null){c=true}if(d==null){d=""}g="";if(a!=null&&c){g='<header>\n  <span class="close icon cancel"></span>\n  <h1>\n    <span>'+a+"</span>\n  </h1>\n</header>"}else if(a!=null){g="<header><h1>\n  <span>"+a+"</span>\n</h1></header>"}h=""+g+"\n<section>";if(c&&a==null){h+='<span class="close black icon cancel"></span>'}h+=""+b+"\n</section>";s(h,"center custom not_clickable "+d,e,f);return j.find(".close").on("tap",o)};h=function(){b=false;clearTimeout(n);n=null;k.removeClass("show");return setTimeout(p,500)};q=function(a,b,c){return'<header>\n  <span class="icon '+a+'"></span>\n</header>\n<section>\n  <span class="title">'+b+'</span>\n  <span class="content">'+c+"</span>\n</section>"};s=function(a,c,e,f){var g;if(!b){b=true;k.removeClass();k.addClass("window "+c);k.html(a);j.addClass("show");setTimeout(function(){return k.addClass("show")},100);if(f!=null){d=f}if(e!=null){return n=setTimeout(h,e*1e3)}}else{g=d;d=function(){if(g!=null){g()}return s(a,n,f)};return h()}};r=function(a){a.preventDefault();a.stopPropagation();if(!k.hasClass("not_clickable")){b=false;clearTimeout(n);n=null;k.removeClass("show");return setTimeout(p,500)}};o=function(a){a.preventDefault();a.stopPropagation();b=false;clearTimeout(n);n=null;k.removeClass("show");return setTimeout(p,500)};p=function(){var a;j.removeClass("show");a=d;d=null;if(a!=null){return a.call(a)}};j.on("tap",r);return{success:m,error:g,confirm:e,loading:i,progress:l,custom:f,hide:h}}(a);(function(){var a,b,c;a=0;b=["ms","moz","webkit","o"];c=0;while(c<b.length&&!window.requestAnimationFrame){window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];++c}if(!window.requestAnimationFrame){window.requestAnimationFrame=function(b,c){var d,e,f;d=(new Date).getTime();f=Math.max(0,16-(d-a));e=window.setTimeout(function(){return b(d+f)},f);a=d+f;return e}}if(!window.cancelAnimationFrame){return window.cancelAnimationFrame=function(a){return clearTimeout(a)}}})();a.Pull_Refresh=function(a,b){var c;if(b==null){b={}}b.pullLabel=b.pullLabel||"Pull to refresh";b.releaseLabel=b.releaseLabel||"Release to refresh";b.refreshLabel=b.refreshLabel||"Loading...";b.onRefresh=b.onRefresh||void 0;a=document.getElementById(a);c=function(){function a(a,b){var c;this.options=b;this.updateHeight=d(this.updateHeight,this);this.hide=d(this.hide,this);this.setHeight=d(this.setHeight,this);this.onPull=d(this.onPull,this);c='<div class="pulltorefresh">\n<span class="icon down-big"></span><span class="text">'+this.options.pullLabel+"</span>\n</div>";this.breakpoint=90;this.container=a;this.pullrefresh=$(c)[0];$(this.container).prepend(this.pullrefresh);this.icon=$(this.pullrefresh).find(".icon");this.text=$(this.pullrefresh).find(".text");this._slidedown_height=0;this._anim=null;this._dragged_down=false;this.showRelease=false;Hammer(this.container).on("touch",function(a){return function(){$(a.container).addClass("pulling");if(!a.refreshing){return a.hide(false)}}}(this));Hammer(this.container).on("dragdown",this.onPull);Hammer(this.container).on("release",function(a){return function(){if(!a._dragged_down){return}cancelAnimationFrame(a._anim);if(a._slidedown_height>=a.breakpoint){if(a.options.onRefresh){return a.onRefresh()}else{return a.hide()}}else{return a.hide()}}}(this))}a.prototype.onPull=function(a){this._dragged_down=true;if(this.container.scrollTop>5){return}if(!this._anim){this.updateHeight()}a.gesture.preventDefault();a.gesture.stopPropagation();if(this._slidedown_height>=this.breakpoint){this.onArrived()}else{if(this.showRelease){this.onUp()}}return this._slidedown_height=a.gesture.deltaY*.4};a.prototype.setHeight=function(a){a-=511;this.pullrefresh.style.transform="translate(0, "+a+"px)";this.pullrefresh.style.webkitTransform="translate(0, "+a+"px)";this.pullrefresh.style.mozTransform="translate(0, "+a+"px)";this.pullrefresh.style.msTransform="translate(0, "+a+"px)";this.pullrefresh.style.marginBottom=""+a+"px";return this.pullrefresh.style.oTransform="translate(0, "+a+"px)"};a.prototype.onRefresh=function(){this.icon[0].className="icon spin6 animated";this.text.html(this.options.refreshLabel);this.setHeight(this.breakpoint-10);this.refreshing=true;this.icon.removeClass("rotated");return this.options.onRefresh.call(this.options.onRefresh)};a.prototype.onArrived=function(){this.showRelease=true;this.icon.addClass("rotated");return this.text.html(this.options.releaseLabel)};a.prototype.onUp=function(){this.showRelease=false;this.icon.removeClass("rotated");return this.text.html(this.options.pullLabel)};a.prototype.hide=function(a){if(a==null){a=true}if(a){$(this.container).removeClass("pulling")}this.icon[0].className="icon down-big";this.text.html(this.options.pullLabel);this._slidedown_height=0;this.setHeight(0);this.icon.removeClass("rotated");cancelAnimationFrame(this._anim);this._anim=null;this._dragged_down=false;return this.refreshing=false};a.prototype.updateHeight=function(){var a;a=this._slidedown_height-511;this.pullrefresh.style.transform="translate(0, "+a+"px)";this.pullrefresh.style.webkitTransform="translate(0, "+a+"px)";this.pullrefresh.style.mozTransform="translate(0, "+a+"px)";this.pullrefresh.style.msTransform="translate(0, "+a+"px)";this.pullrefresh.style.marginBottom=""+a+"px";this.pullrefresh.style.oTransform="translate(0, "+a+"px)";return this._anim=requestAnimationFrame(this.updateHeight)};return a}();return new c(a,b)};(function(){var b,c,d,e;c=function(a,b){return JSON.parse(window[a].getItem(b))};e=function(a,b,c){return window[a].setItem(b,JSON.stringify(c))};d=function(a,b){return window[a].removeItem(b)};b=function(a){return window[a].clear()};a.Session=function(){var a;a="sessionStorage";return{get:function(b){return c(a,b)},set:function(b,c){return e(a,b,c)},remove:function(b){return d(a,b)},clear:function(){return b(a)}}}();return a.Storage=function(){var a;a="localStorage";return{get:function(b){return c(a,b)},set:function(b,c){return e(a,b,c)},remove:function(b){return d(a,b)},clear:function(){return b(a)}}}()})()}).call(this);