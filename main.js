/*
	To the brave person about to read this code,
	I wish you luck on your adventure.
*/

$("body").prepend("<div id='note-announce'></div>");
var noteAnnounce = function(message) {
	$("<div class='note-announce'></div>").prependTo("#note-announce").css({opacity: 0, marginBottom: "-60px"}).html(message)
	.animate({opacity: 1, marginBottom: "30px"})
	.delay(10000).fadeOut(800, function() {$(this).remove()});
}
noteAnnounce("<b>Note Initialized</b>");
var getUrlVars = function() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
setTimeout(function() {
	if (getUrlVars()["note"] !== undefined) {
		var noteUrlVar = getUrlVars()["note"];
		if (noteUrlVar.substring(0,3) == "fil") {
			noteUrlVar = noteUrlVar.substring(4, noteUrlVar.length);
			noteAnnounce("<b>file successfully uploaded</b> " + noteDirectory + "uploads/" + noteUrlVar);	
		} else if (noteUrlVar.substring(0,3) == "err") {
			noteUrlVar = noteUrlVar.substring(4, noteUrlVar.length);
			noteAnnounce("<b>file upload error</b><br/> " + noteUrlVar);
		} else if (noteUrlVar.substring(0,3) == "mes") {
			noteUrlVar = noteUrlVar.substring(4, noteUrlVar.length);
			noteAnnounce(noteUrlVar);
		}	
	}
}, 500);
var srcNodes = ["img", "iframe", "source"];
var hrefNodes = ["a", "link"];
var editAdjust = function(o, resize) {
	var length = o.value.length;
	if (length <= 120) {
		o.style.fontSize = "18px";
	} else if (120 < length && length <= 190) {
		o.style.fontSize = "16px";
	} else if (190 < length) {
		o.style.fontSize = "14px";
		resize = false;
	}
	if (resize) {
		o.style.height = "1px";
		o.style.height = o.scrollHeight + 62 + "px";
	} else {
		o.style.overflow = "auto";
		o.style.height = "240px";
	}
};
var getBlockId = function(o) {
	var classList = $(o).attr('class').split(/\s+/);
	var newClass = "";
	for (var i = 0; i < classList.length; i++) {
		if (classList[i].indexOf("note-block_") > -1) {
			newClass = classList[i];
		}
	}
	return newClass;
};
var getNoteElement = function(o) {
	return $(".note." + $(o).attr("id"));
};
var isInit = false;
var isHidden = false;
var makeClasses = function() {
	var i = 1;
	var j = 1;
	$(".note").each(function() {
		if ($(this).hasClass("post")) {
			if ($(this).attr("class").indexOf("note-block_") == -1) {
				$(this).addClass("note-block_" + i);
				$(this).find(".note").each(function() {
					$(this).addClass("note-block_" + i + "_" + j);
					j++;
				});
				j = 1;
			}
		} else {
			if ($(this).attr("class").indexOf("note-block_") == -1) {
				$(this).addClass("note-block_" + i);	
			} else {
				i--;
			}
		}
		i++;
	});
};
var makeHighlights = function() {
	$(".note").each(function() {
		if (getBlockId(this).split("_").length - 1 <= 1) {
			var highlightString = "";
			if ($(this).hasClass("post")) {
				highlightString = "<div class='note-highlight note-comp'></div>";
			} else {
				highlightString = "<div class='note-highlight'></div>";
			}
			$(highlightString).appendTo("body").css({
				top: $(this).offset().top - 10,
				left: $(this).offset().left - 10,
				width: $(this).width() + 20,
				height: $(this).height() + 20
			}).attr("id", getBlockId(this)).mouseenter(function() {
				$(this).clearQueue().animate({
					opacity: 0.4
				}, 200);
			}).mouseout(function() {
				$(this).clearQueue().animate({
					opacity: 0.5
				}, 200);
			}).attr("data-method", "update");	
		}
	});
};
var fadeOutLeft = function(editArrayId) {
	$(".note-edit#" + editArrayId).animate({
		opacity: 0,
		left: "-=20px"
	}, 200, function() {
		$(".note-edit#" + editArrayId).css({
			left: "+=20px",
			display: "none",
			opacity: 0.9
		});
	});
	$(".note-edit-arrow#" + editArrayId).animate({
		opacity: 0,
		left: "-=20px"
	}, 200, function() {
		$(".note-edit-arrow#" + editArrayId).css({
			left: "+=20px",
			display: "none",
			opacity: 0.9
		});
	});
}
var fadeOutRight = function(editArrayId) {
	$(".note-edit#" + editArrayId).animate({
		opacity: 0,
		left: "+=20px"
	}, 200, function() {
		$(".note-edit#" + editArrayId).css({
			left: "-=20px",
			display: "none",
			opacity: 0.9
		});
	});
	$(".note-edit-arrow#" + editArrayId).animate({
		opacity: 0,
		left: "+=20px"
	}, 200, function() {
		$(".note-edit-arrow#" + editArrayId).css({
			left: "-=20px",
			display: "none",
			opacity: 0.9
		});
	});
}
var makeToolbar = function(highlight,childArray) {
	var toggleTool = function(toolElement) {
		if ($(toolElement).hasClass("note-selected")) {
			$(toolElement).parent().find(".note-toolbar-delete").removeClass("note-selected");
			$(toolElement).parent().find(".note-toolbar-copy").removeClass("note-selected");
			$(toolElement).parent().find(".note-toolbar-upload").removeClass("note-selected");
			$(".note-highlight#" + $(toolElement).parent().attr("id")).attr("data-method", "update");
		} else {
			$(toolElement).parent().find(".note-toolbar-delete").removeClass("note-selected");
			$(toolElement).parent().find(".note-toolbar-copy").removeClass("note-selected");
			$(toolElement).parent().find(".note-toolbar-upload").removeClass("note-selected");
			$(".note-highlight#" + $(toolElement).parent().attr("id")).attr("data-method", $(toolElement).attr("data-newmethod"));
			$(toolElement).addClass("note-selected");			
		}
	}
	var uploadFile = function(toolElement) {
		if ($(toolElement).hasClass("note-selected")) {
			$(toolElement).parent().find("form").remove();
			toggleTool(toolElement);
		} else {
			var formElement = $("<form class='note-upload' method='POST' enctype='multipart/form-data' action='" + noteDirectory + "upload.php'></form>").insertBefore(toolElement);
			$(formElement).append("<input value='104857600' name='MAX_FILE_SIZE'>");
			$(formElement).append("<input value='" + location.protocol + '//' + location.host + location.pathname + "' name='pagelocation'>");
			$(formElement).append("<input value='" + noteDirectory + "' name='noteDirectory'>");
			$("<input type='file' name='uploadfile'>").appendTo(formElement).click().change(function() {
				toggleTool($(".note-toolbar-upload.note-selected"));
				toggleTool(toolElement);
			});
		}
	}
	if (childArray == false) {
		var childElement = $(highlight).attr("id");
		var toolBarElement = $("<div class='note-toolbar' id='" + childElement + "'></div>");
		toolBarElement.insertAfter(highlight).css({
			top: $(".note-edit#" + childElement).offset().top,
			left: $(".note-edit#" + childElement).offset().left + 260
		}).fadeIn();
		$("<div data-newmethod='delete' title='Delete Block' class='note-toolbar-delete'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			toggleTool(this);
		});
		$("<div data-newmethod='copy' title='Copy Block' class='note-toolbar-copy'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			toggleTool(this);
		});
		$("<div data-newmethod='upload' title='Upload File' class='note-toolbar-upload'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			uploadFile(this);
		});
	} else {
		var toolBarElement = $("<div class='note-toolbar' id='" + childArray[0].substring(0, childArray[0].lastIndexOf("_")) + "'></div>");
		toolBarElement.insertAfter(highlight).css({
			top: $(".note-edit#" + childArray[0]).offset().top,
			left: $(".note-edit#" + childArray[0]).offset().left + 260
		}).fadeIn();
		$("<div title='Next Block' class='note-toolbar-right'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			var editArray = $(highlight).attr('data-childarray').split(",");
			var i = 0;
			var whileLoop = true;
			while (whileLoop) {
				if ($(".note-edit#" + editArray[i]).css("display") == "block") {
					if (i == editArray.length - 1) {
						fadeOutRight(editArray[i]);
						$(".note-edit#" + editArray[0]).fadeIn().focus();
						$(".note-edit-arrow#" + editArray[0]).fadeIn();
						whileLoop = false;						
					} else {
						fadeOutRight(editArray[i]);
						$(".note-edit#" + editArray[i + 1]).fadeIn().focus();
						$(".note-edit-arrow#" + editArray[i + 1]).fadeIn();
						whileLoop = false;
					}
				}
				i++
			}
		});
		$("<div title='Previous Block' class='note-toolbar-left'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			var editArray = $(highlight).attr('data-childarray').split(",");
			var i = 0;
			var whileLoop = true;
			while (whileLoop) {
				if ($(".note-edit#" + editArray[i]).css("display") == "block") {
					if (i == 0) {
						fadeOutLeft(editArray[i]);
						$(".note-edit#" + editArray[editArray.length - 1]).fadeIn().focus();
						$(".note-edit-arrow#" + editArray[editArray.length - 1]).fadeIn();
						whileLoop = false;						
					} else {
						fadeOutLeft(editArray[i]);
						$(".note-edit#" + editArray[i - 1]).fadeIn().focus();
						$(".note-edit-arrow#" + editArray[i - 1]).fadeIn();
						whileLoop = false;
					}
				}
				i++
			}
		});
		$("<div data-newmethod='delete' title='Delete Block' class='note-toolbar-delete'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			toggleTool(this);
		});
		$("<div data-newmethod='copy' title='Copy Block' class='note-toolbar-copy'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			toggleTool(this);
		});
		$("<div data-newmethod='upload' title='Upload File' class='note-toolbar-upload'></div>").appendTo(toolBarElement).fadeIn().click(function() {
			uploadFile(this);
		});
	}
}
var fadeOutPostEdits = function(highlight) {
	$(".note-edit").each(function() {
		if ($(this).attr("id").indexOf($(highlight).attr("id")) >= 0) {
			$(this).fadeOut();
			$(".note-edit-arrow#" + $(this).attr("id")).fadeOut();
		}
	});
};
var convertContent = function(newContent) {
	if (newContent == undefined) {
		newContent = "";
	} else {
		newContent = newContent.replace(/<br\s*\/?>/mg,"\n")
							   .replace(/</g, "[")
							   .replace(/>/g, "]");
	}
	return newContent;
}
var makeInput = function(highlight) {
	$(".note-highlight").each(function() {
			fadeOutPostEdits(this);
			$(".note-toolbar#" + $(this).attr("id")).fadeOut();
	});
	var doesNoteEditExist = false;
	if ($(".note-toolbar#" + $(highlight).attr("id")).length !== 0) {
		doesNoteEditExist = true;
	}
	if (!doesNoteEditExist) {
		var highlightOffset = $(highlight).offset();
		var editTopValue = 0;
		var editLeftValue = 0;
		var editAfterTopValue = 0;
		var editAfterLeftValue = 0;
		var doesScaleValue = true;
		var heightValue = "inherit";
		var childArray = [];
		if (getNoteElement(highlight).hasClass("post")) {
			getNoteElement(highlight).find(".note").each(function() {
				var noteNode = $(this).get(0).nodeName.toLowerCase();
				var content = "";
				if (srcNodes.indexOf(noteNode) >= 0) {
					content = $(this).attr("src");
				} else if (hrefNodes.indexOf(noteNode) >= 0) {
					content = $(this).attr("href");
				} else {
					content = $(this).html();
				}
				childArray.push(getBlockId(this));
				content = convertContent(content);
				
				if ($(document).height() - (highlightOffset.top + $(highlight).height()) < 280 && highlightOffset.top >= 280) {
					doesScaleValue = false;
					heightValue = "240px";
					editTopValue = highlightOffset.top - 280;
					editLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2);
					editAfterTopValue = highlightOffset.top;
					editAfterLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2) + 100;
				} else {
					editTopValue = highlightOffset.top + $(highlight).height() + 40;
					editLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2);
					editAfterTopValue = highlightOffset.top + $(highlight).height() + 40;
					editAfterLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2) + 100;
				}
				$("<textarea onkeyup='editAdjust(this, " + doesScaleValue + ")' id='" + getBlockId(this) + "' class='note-edit'></textarea>").insertAfter(highlight).css({
					top: editTopValue,
					left: editLeftValue,
					height: heightValue
				}).html(content).focus(function() {
					editAdjust(this, doesScaleValue);
				});
				if (doesScaleValue) {
					$("<div id='" + getBlockId(this) + "' class='note-edit-arrow'></div>").insertAfter(".note-edit#" + getBlockId(this)).css({
						top: editAfterTopValue,
						left: editAfterLeftValue
					});
				} else {
					$("<div id='" + getBlockId(this) + "' class='note-edit-arrow bottom'></div>").insertAfter(".note-edit#" + getBlockId(this)).css({
						top: editAfterTopValue,
						left: editAfterLeftValue
					});
				}
			});
			$(highlight).attr('data-childarray', childArray);
			$(".note-edit#" + childArray[0]).fadeIn(function() {
				makeToolbar(highlight,childArray);
			}).focus();
			$(".note-edit-arrow#" + childArray[0]).fadeIn();
		} else {
			var noteNode = getNoteElement(highlight).get(0).nodeName.toLowerCase();
			var content = "";
			if (srcNodes.indexOf(noteNode) >= 0) {
				content = getNoteElement(highlight).attr("src");
			} else if (hrefNodes.indexOf(noteNode) >= 0) {
				content = getNoteElement(highlight).attr("href");
			} else {
				content = getNoteElement(highlight).html();
			}
			content = convertContent(content);
			if ($(document).height() - (highlightOffset.top + $(highlight).height()) < 280 && highlightOffset.top >= 280) {
				doesScaleValue = false;
				heightValue = "240px";
				editTopValue = highlightOffset.top - 280;
				editLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2);
				editAfterTopValue = highlightOffset.top;
				editAfterLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2) + 100;
			} else {
				editTopValue = highlightOffset.top + $(highlight).height() + 40;
				editLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2);
				editAfterTopValue = highlightOffset.top + $(highlight).height() + 40;
				editAfterLeftValue = highlightOffset.left + (($(highlight).width() - 240) / 2) + 100;
			}
			$("<textarea onkeyup='editAdjust(this, " + doesScaleValue + ")' id='" + $(highlight).attr("id") + "' class='note-edit'></textarea>").insertAfter(highlight).css({
				top: editTopValue,
				left: editLeftValue,
				height: heightValue
			}).html(content).focus(function() {
				editAdjust(this, doesScaleValue);
			}).fadeIn(function() {
				makeToolbar(highlight,false);
			}).focus();
			if (doesScaleValue) {
				$("<div id='" + $(highlight).attr("id") + "' class='note-edit-arrow'></div>").insertAfter(".note-edit#" + $(highlight).attr("id")).css({
					top: editAfterTopValue,
					left: editAfterLeftValue
				}).fadeIn();
			} else {
				$("<div id='" + $(highlight).attr("id") + "' class='note-edit-arrow bottom'></div>").insertAfter(".note-edit#" + $(highlight).attr("id")).css({
					top: editAfterTopValue,
					left: editAfterLeftValue
				}).fadeIn();
			}
		}
	} else if ($(".note-toolbar#" + $(highlight).attr("id")).css("display") == "block") {
		fadeOutPostEdits(highlight);
		$(".note-toolbar#" + $(highlight).attr("id")).fadeOut();
	} else if ($(".note-toolbar#" + $(highlight).attr("id")).css("display") == "none" && $(".note-edit#" + $(highlight).attr("id") + "_1").length !== 0) {
		$(".note-edit#" + $(highlight).attr("id") + "_1").fadeIn().focus();
		$(".note-edit-arrow#" + $(highlight).attr("id") + "_1").fadeIn();
		$(".note-toolbar#" + $(highlight).attr("id")).fadeIn();
	} else if ($(".note-toolbar#" + $(highlight).attr("id")).css("display") == "none") {
		$(".note-edit#" + $(highlight).attr("id")).fadeIn().focus();
		$(".note-edit-arrow#" + $(highlight).attr("id")).fadeIn();
		$(".note-toolbar#" + $(highlight).attr("id")).fadeIn();		
	}
};
var callNote = function() {
	if (!isInit && !isHidden) {
		makeClasses();
		makeHighlights();
		$(".note-highlight").click(function() {
			makeInput(this);
		});
		$(".note-highlight").each(function() {
			$(this).fadeIn();
		});
		isInit = true;
		isHidden = false;
	} else if (isInit && isHidden) {
		$(".note-highlight").each(function() {
			$(this).fadeIn();
		});
		isHidden = false;
	} else if (!isHidden && isInit) {
		$(".note-highlight").each(function() {
			$(this).stop().fadeOut();
		});
		$(".note-edit").each(function() {
			$(this).stop().fadeOut(function() {
				$(this).remove();
			});
		});
		$(".note-edit-arrow").each(function() {
			$(this).stop().fadeOut(function() {
				$(this).remove();
			});
		});
		$(".note-toolbar").each(function() {
			$(this).stop().fadeOut(function() {
				$(this).remove();
			});
		});
		isHidden = true;
	}
};
var revertContent = function(newContent) {
	if (newContent == undefined) {
		newContent = "";
	} else {
		newContent = newContent.replace(/\n/g, "[br/]")
							   .replace(/\</g, "&lt;")
							   .replace(/\>/g, "&gt;")
							   .replace(/\[/g, "<")
							   .replace(/\]/g, ">");
	}
	return newContent;
}
var saveNote = function() {
	var hasCopied = false;
	if (!isHidden && isInit) {
		isInit = false;
		var fileObject = {
			"filepath": filePath,
			"filename": fileName,
			"blocks": [ 
			]
		};
		$(".note-highlight").each(function() {
			if ($(".note-edit#" + $(this).attr("id")).length !== 0 || $(".note-edit#" + $(this).attr("id") + "_1").length !== 0) {
				var noteElement = getNoteElement(this);
				if ($(this).hasClass("note-comp")) {
					var noteMethod = $(this).attr("data-method");
					var newBlock = {
						"id": $(this).attr("id"),
						"method": noteMethod,
						"blocks": [
						]
					};
					var childArray = $(this).attr("data-childarray").split(',');
					switch(noteMethod) {
						case "update":
								for (var i = 0; i < childArray.length; i++) {
									var newContent = $(".note-edit#" + childArray[i]).val();
									newContent = revertContent(newContent);
									var noteNode = $(".note." + childArray[i]).get(0).nodeName.toLowerCase();
									var newChildBlock = {
										"id": $(".note-edit#" + childArray[i]).attr("id"),
										"content": newContent,
										"node": noteNode
									};
									newBlock.blocks.push(newChildBlock);
									if (srcNodes.indexOf(noteNode) >= 0) {										
										$(".note." + childArray[i]).attr("src", newContent);
									} else if (hrefNodes.indexOf(noteNode) >= 0) {
										$(".note." + childArray[i]).attr("href", newContent);
									} else {
										$(".note." + childArray[i]).html(newContent);
									}
								};
							break;
						case "delete":
							noteElement.remove();
							break;
						case "copy":
							noteElement.clone().insertAfter(noteElement);
							hasCopied = true;
							break;
					}
					fileObject.blocks.push(newBlock);
				} else {
					var noteNode = noteElement.get(0).nodeName.toLowerCase();
					var newContent = $(".note-edit#" + $(this).attr("id")).val();
					newContent = revertContent(newContent);
					var noteMethod = $(this).attr("data-method");
					var newBlock = {
						"id": $(this).attr("id"),
						"method": noteMethod,
						"content": newContent,
						"node": noteNode
					};
					switch(noteMethod) {
						case "update":
							if (srcNodes.indexOf(noteNode) >= 0) {
								noteElement.attr("src", newContent);
							} else if (hrefNodes.indexOf(noteNode) >= 0) {
								noteElement.attr("href", newContent);
							} else {
								noteElement.html(newContent);
							}
							break;
						case "delete":
							noteElement.remove();
							break;
						case "copy":
							noteElement.clone().insertAfter(noteElement);
							hasCopied = true;
							break;
					}
					fileObject.blocks.push(newBlock);
				}
			}
		});
		$.ajax({
			url: noteDirectory + "update.php",
			type: 'POST',
			data: fileObject,
			success: function(data) {
				noteAnnounce(data);
				if (hasCopied) {
					$(".note").each(function() {
						var classString = $(this).attr("class");
						var classArray = classString.split(" ");
						var newClassArray = [];
						for (var i = 0; i < classArray.length; i++) {
							if (classArray[i].indexOf("note-block_") < 0) {
								newClassArray.push(classArray[i]);
							}
						}
						$(this).attr("class", newClassArray.join(" "));
					});
				}
				var willReload = false;
				for (var i = 0; i < fileObject.blocks.length; i++) {
					if (fileObject.blocks[i].method === "upload") {
						$(".note-toolbar#" + fileObject.blocks[i].id + " form").submit();
					}
				}
				$(".note-edit").each(function() {
					$(this).fadeOut(function() {
						$(this).remove();
					});
					$(".note-edit-arrow#" + $(this).attr("id")).fadeOut(function(){
						$(this).remove();
					});
				});
				$(".note-highlight").each(function() {
					$(this).stop().fadeOut(function() {
						$(this).remove();
					});
					$(".note-toolbar#" + $(this).attr("id")).fadeOut(function() {
						$(this).remove();
					});
				});
			}
		});
	}
};
var logOut = function() {
	
}
shortcut.remove("Ctrl+E");
shortcut.remove("Meta+E");
shortcut.add("Ctrl+E", function() {
	callNote();
});
shortcut.add("Ctrl+S", function() {
	saveNote();
});
shortcut.add("Meta+E", function() {
	callNote();
});
shortcut.add("Meta+S", function() {
	saveNote();
});