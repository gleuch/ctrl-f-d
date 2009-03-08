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


var hide_bg = true;
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
	var tb = '<span class="ctrlfd">';
	var te = '</span>';
	$('#guser a:eq(0)').html();
	$.fn.ctrlfd = function(c) {
		return this.filter(function() {if (this.nodeType == 1) {var g = this.tagName.toLowerCase(); return !(this.className == 'ctrlfd' || g == 'head' || g == 'img' || g == 'script');} else {return true;}}).each(function() {
			if (this.nodeType == 3) {
				if (this.nodeValue.replace(/\s/ig, '') != '') {
					if (!c) c = '#000000';
					var ntb = '<span class="ctrlfd" style="color: '+ c +'; background-color:'+c+';">';
					$(this).after(ntb+ this.nodeValue.replace(/\s\s/ig, ' ').replace(/\n/ig, '').split(' ').join(te +' '+ ntb)+te);
					this.nodeValue = '';
				}
			} else if (this.nodeType == 1) {
				var c = rgb2hex($(this).css('color'));
				if ($(this).children().length > 0) {
					$(this).contents().ctrlfd(c);
				} else if ($(this).children().length == 0) {
					$(this).html(tb+ $(this).text() +te).addClass('ctrlfd').css({'background-color': c});
				} else {
					$(this).addClass('ctrlfd');
				}
			}
		});
	};
	$('html').ctrlfd('#000000');

	$(document).each(function() {
		var r = this.title.split(" ");
		for (var i=0; i<r.length; i++) if (!(/(\||\-)/ig).test(r[i])) r[i] = r[i].replace(/\S/ig, '-');
		this.title = r.join(' ');
	});

	setTimeout(function() {
		$('object,embed,iframe').each(function() {
			var r = $(this);
			r.wrap(document.createElement('div'));
			var s = $(this).parent();
			s.css({width: r.width(), height: r.height()}).addClass('ctrlfd');
			r.remove();
		});
	}, 1000);

	$('img, input[type=image]').each(function() {
		var r = $(this);
		var w = r.width(); var h = r.height();
		r.css({width: r.width(), height: r.height()}).attr('src', 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Blank.png').width(w).height(h);
	});
	var s = document.createElement("style");
	document.body.appendChild(s);
	s.innerHTML = ".ctrlfd {"+ (hide_bg ? "background-image: none !important;" : "") +"} .bg_ctrlfd {"+ (hide_bg ? "background-image: none !important;" : "") +"} select, input, textarea, object, embed, img, button, hr {background: #000 !important; color: #000 !important; border-color: #000 !important;}";

	//if (hide_bg) $('body *, body, html').each(function() {$(this).addClass('bg_ctrlfd');});
}