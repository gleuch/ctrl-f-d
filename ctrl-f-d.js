// ==UserScript==
// @name Ctrl+F'd
// @namespace by halvfet <http://www.halvfet.com>
// @description Rush Limbaugh believes a censored internet can't be Ctrl+F'd (or Cmd+F for Mac users).
// @include *
// ==/UserScript==
 
/*
  Ctrl+F'd
  A GreaseMonkey script to censor text on a web page, in the Rush Limbaugh style.
  by Greg Leuch <http://www.halvfet.com>
 
  ------------------------------------------------------------------------------------
 
  Why Rush, you ask? Read this: http://mediamatters.org/items/200902130016
 
*/
 
var hide_bg = false;
 
 
var GM_JQ = document.createElement('script');
GM_JQ.src = 'http://jquery.com/src/jquery-latest.js';
GM_JQ.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JQ);
function GM_wait() {if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); } else {unsafeWindow.jQuery.fn.reverse = function(){return this.pushStack(this.get().reverse(), arguments);}; $ = unsafeWindow.jQuery; $(document).ready(function() {ctrlfd();});}}
Array.prototype.in_array = function(p_val, sensitive) {for(var i = 0, l = this.length; i < l; i++) {if ((sensitive && this[i] == p_val) || (!sensitive && this[i].toLowerCase() == p_val.toLowerCase())) {return true;}} return false;}
function rgb2hex(rgb) {rgb = rgb.replace(/\s/g, "").replace(/^(rgb\()(\d+),(\d+),(\d+)(\))$/, "$2|$3|$4").split("|"); return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);}
function hex(x) {var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8","9", "A", "B", "C", "D", "E", "F"); return isNaN(x) ? "00" : hexDigits[(x-x%16)/16] + hexDigits[x%16];}
GM_wait();
 
function ctrlfd() {
  var rc = new RegExp("ctrlfd");
  var rs = new RegExp("(>)$");
  var re = new RegExp('^(!)');
  var rb = new RegExp(" ", "ig");
  var rx = new RegExp("^\s+|\s+$", "g");
  var rt = new RegExp("^(script|textarea|style)");
  setTimeout(function() {
    $('object,embed,iframe').each(function() {
      var r = $(this);
      r.wrap(document.createElement('div'));
      var s = $(this).parent();
      s.css({width: r.width(), height: r.height()}).addClass('ctrlfd');
      r.remove();
    });
  }, 1000);
 
  var x = $('body *');
  x.each(function(n) {
    var g = this.tagName.toLowerCase();
    if (!(this.className == 'ctrlfd' || g == 'img' || g == 'script' || g == 'input' || g == 'textarea' || g == 'param' || g == 'embed' || g == 'object' || g == 'nobr' || g == 'select' || g == 'button' || g == 'br' || g == 'hr' || g == 'style' || g == 'meta' || g == 'link')) {// || a.in_array(this.tagName))) {
      var r = $(this);
      var t = r.html().replace(/\n/, "").split("<");
      var tag_s = '<span class="ctrlfd" style="color: '+rgb2hex(r.css('color'))+' !important; background: '+ rgb2hex(r.css('color')) +' !important;">';
      var tag_e = '</span>';
      for (var i=0; i<t.length; i++) {
        if (re.test(t[i]) || rt.test(t[i])) {
          t[i] = '<'+t[i];
        } else if (!(rs.test(t[i].replace(rx,"")))) {
          var u = t[i].split(">");
          if (u[1]) {
            if (u[1].replace(rx,"") != '' && !(rc.test(u[0]))) u[1] = tag_s + u[1].replace(rx,"").replace(rb, tag_e +' '+ tag_s) + tag_e;
            if (i > 0) u[0]='<'+u[0] +'>';
          } else if (u[0].replace(rx,"") != '') {
            u[0] = tag_s + u[0].replace(rx,"").replace(rb, tag_e+' '+tag_s) + tag_e;
          }
          t[i] = u.join("");
        } else {
          t[i] = '<'+t[i];
        }
      }
      r.addClass('bg_ctrlfd').html(t.join(""));
    }
  });
  $('img, input[type=image]').each(function() {
    var r = $(this);
    var w = r.width(); var h = r.height();
    r.css({width: r.width(), height: r.height()}).attr('src', 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Blank.png').width(w).height(h);
  });
  var s = document.createElement("style");
  document.body.appendChild(s);
  s.innerHTML = ".ctrlfd {display: inline !important; clear: none !important; float: none !important; "+ (hide_bg ? " background-image: none;" : "") +"} .bg_ctrlfd {"+ (hide_bg ? "background-image: none !important;" : "") +"} select, input, textarea, object, embed, img, button, hr {background: #000 !important; color: #000 !important; border-color: #000 !important;}";
  if (hide_bg) $('body *, body, html').each(function() {$(this).addClass('bg_ctrlfd');});
}