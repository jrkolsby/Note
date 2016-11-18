shortcut={all_shortcuts:{},add:function(e,t,i){var n={type:"keydown",propagate:!1,disable_in_input:!1,target:document,keycode:!1};if(i)for(var s in n)"undefined"==typeof i[s]&&(i[s]=n[s]);else i=n;var r=i.target;"string"==typeof i.target&&(r=document.getElementById(i.target)),e=e.toLowerCase();var o=function(n){if(n=n||window.event,i.disable_in_input){var s;if(n.target?s=n.target:n.srcElement&&(s=n.srcElement),3==s.nodeType&&(s=s.parentNode),"INPUT"==s.tagName||"TEXTAREA"==s.tagName)return}n.keyCode?code=n.keyCode:n.which&&(code=n.which);var r=String.fromCharCode(code).toLowerCase();188==code&&(r=","),190==code&&(r=".");var o=e.split("+"),a=0,l={"`":"~",1:"!",2:"@",3:"#",4:"$",5:"%",6:"^",7:"&",8:"*",9:"(",0:")","-":"_","=":"+",";":":","'":'"',",":"<",".":">","/":"?","\\":"|"},c={esc:27,escape:27,tab:9,space:32,"return":13,enter:13,backspace:8,scrolllock:145,scroll_lock:145,scroll:145,capslock:20,caps_lock:20,caps:20,numlock:144,num_lock:144,num:144,pause:19,"break":19,insert:45,home:36,"delete":46,end:35,pageup:33,page_up:33,pu:33,pagedown:34,page_down:34,pd:34,left:37,up:38,right:39,down:40,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123},d={shift:{wanted:!1,pressed:!1},ctrl:{wanted:!1,pressed:!1},alt:{wanted:!1,pressed:!1},meta:{wanted:!1,pressed:!1}};n.ctrlKey&&(d.ctrl.pressed=!0),n.shiftKey&&(d.shift.pressed=!0),n.altKey&&(d.alt.pressed=!0),n.metaKey&&(d.meta.pressed=!0);for(var u=0;k=o[u],u<o.length;u++)"ctrl"==k||"control"==k?(a++,d.ctrl.wanted=!0):"shift"==k?(a++,d.shift.wanted=!0):"alt"==k?(a++,d.alt.wanted=!0):"meta"==k?(a++,d.meta.wanted=!0):k.length>1?c[k]==code&&a++:i.keycode?i.keycode==code&&a++:r==k?a++:l[r]&&n.shiftKey&&(r=l[r],r==k&&a++);return a!=o.length||d.ctrl.pressed!=d.ctrl.wanted||d.shift.pressed!=d.shift.wanted||d.alt.pressed!=d.alt.wanted||d.meta.pressed!=d.meta.wanted||(t(n),i.propagate)?void 0:(n.cancelBubble=!0,n.returnValue=!1,n.stopPropagation&&(n.stopPropagation(),n.preventDefault()),!1)};this.all_shortcuts[e]={callback:o,target:r,event:i.type},r.addEventListener?r.addEventListener(i.type,o,!1):r.attachEvent?r.attachEvent("on"+i.type,o):r["on"+i.type]=o},remove:function(e){e=e.toLowerCase();var t=this.all_shortcuts[e];if(delete this.all_shortcuts[e],t){var i=t.event,n=t.target,s=t.callback;n.detachEvent?n.detachEvent("on"+i,s):n.removeEventListener?n.removeEventListener(i,s,!1):n["on"+i]=!1}}};
var scriptEls = document.getElementsByTagName('script');
var thisScriptEl = scriptEls[scriptEls.length - 1];
var scriptPath = thisScriptEl.src;
var noteDirectory = scriptPath.substr(0, scriptPath.lastIndexOf('/') + 1);
var noteCss = document.createElement("link");
noteCss.rel  = 'stylesheet';
noteCss.type = 'text/css';
noteCss.href = noteDirectory + "note.css";
noteCss.media = 'all';
$("head").append(noteCss);
var filePath = location.protocol + '//' + location.host + location.pathname;
var fileName = filePath.replace(/^.*[\\\/]/, '');
var setCookie =  function(name,value) {
	var date = new Date();
	date.setTime(date.getTime()+(3600*1000));
	var expires = "; expires="+date.toGMTString();
	document.cookie = name+"="+value+expires+"; path=/";
}
$(document).ready(function() {
	var loginObj = {
		"response": "print"
	};
	$.ajax({
		url: noteDirectory + "config.php",
		type: 'POST',
		data: loginObj,
		success: function(data) {
			if (data !== "false") {
				$.getScript(noteDirectory + "main.js", function() {
				}).fail(function(err, status) {
					console.log(status);
				});
			} else {
				var noteLogin = function() {
					if ($("#note-shadow").length == 0) {
						$("<div id='note-shadow'></div>").appendTo("body").fadeIn(300).click(function() {
							$("#note-shadow").delay(400).fadeOut(300, function() {
								$(this).remove();
							});
							$("#note-login").fadeOut(300, function() {
								$(this).remove();
							});							
						});
						$("<div id='note-login'></div>").appendTo("body").delay(400).fadeIn(300);
						$("<h1>Note CMS Login</h1>").appendTo("#note-login");
						$("<input id='username'>").val("Username").appendTo("#note-login").blur(function() {
							if (this.value == "") {
								this.value = "Username";
							}
						}).focus(function() {
							if (this.value == "Username") {
								this.value = "";
							}			
						});
						$("<input id='password'>").val("Password").appendTo("#note-login").blur(function() {
							if (this.value == "") {
								this.value = "Password";
								this.type = "text";
							}
						}).focus(function() {
							if (this.value == "Password") {
								this.value = "";
								this.type = "password";
							}			
						});
						$("<button></button>").appendTo("#note-login").html("Sign In").click(function() {
							var loginObj = {
								"response": "print",
								"pass": $("#note-login input#password").val(),
								"user": $("#note-login input#username").val(),
							};
							$.ajax({
								url: noteDirectory + "config.php",
								type: 'POST',
								data: loginObj,
								success: function(data) {
									if (data == "true") {
										$.getScript(noteDirectory + "main.js", function() {
											setTimeout(function() {
												callNote();
											}, 600);
										}).fail(function(err, status) {
											console.log(status);
										});
										$("#note-shadow").delay(400).fadeOut(300, function() {
											$(this).remove();
										});
										$("#note-login").fadeOut(300, function() {
											$(this).remove();
										});
										setCookie("notecmsuser",loginObj.user);
										setCookie("notecmspass",loginObj.pass);
									} else {
										var l = 20;
										for (var i = 0; i < 6; i++) {
											$("#note-login").animate({'margin-left': "+=" + ( l = -l ) + 'px'}, 80);
										}
									}
								}
							});
						});
					} else {
						$("#note-shadow").delay(400).fadeOut(300, function() {
							$(this).remove();
						});
						$("#note-login").fadeOut(300, function() {
							$(this).remove();
						});
					}
				}
				shortcut.add("Meta+E", function() {
					noteLogin();
				});
				shortcut.add("Ctrl+E", function() {
					noteLogin();
				});
			}
		}
	});
});