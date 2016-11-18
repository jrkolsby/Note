<?php
include("config.php");
if (!isset($_COOKIE['notecmsuser'])) {
	print "<b>error</b><br/>Login has expired";
} else {
	if ($_COOKIE['notecmsuser'] == $user && $_COOKIE['notecmspass'] == $pass) {
		ini_set('display_errors','Off');
		include("assets/phpquery.php");
		$filepath = $_SERVER['DOCUMENT_ROOT'] . $domainroot . substr($_POST['filepath'], strpos($_POST['filepath'],"/",7));
		$filename = $_POST['filename'];
		$blocks = $_POST['blocks'];
		if ($filename == null) {
			if (file_exists($filepath . "index.html")) {
				$filename = "index.html";
			} else if (file_exists($filepath . "index.php")) {
				$filename = "index.php";
			}
			$filepath .= $filename;
		}
		$content = file_get_contents($filepath);
		$doc = phpQuery::newDocument($content);
		phpQuery::selectDocument($doc);
		
		$srcNodes = array("img", "iframe", "source");
		$hrefNodes = array("a");
		
		$i = 1;
		$j = 1;
		foreach(pq('.note') as $note) {
			if (pq($note)->hasClass('post')) {
				if (!strstr(pq($note)->attr('class'), "note-block_")) {
					pq($note)->addClass("note-block_$i");
					foreach(pq($note)->find('.note') as $postnote) {
						pq($postnote)->addClass("note-block_" . $i . "_" . $j);
						$j++;
					}
					$j = 1;	
				}
			} else {
				if (!strstr(pq($note)->attr('class'), "note-block_")) {
					pq($note)->addClass("note-block_$i");
				} else {
					$i--;
				}
			}
			$i++;
		}
		for ($i = 0; $i < count($blocks); $i++) {
			switch ($blocks[$i]['method']) {
				case "update":
					if ($blocks[$i]['blocks'] == null) {
						$currentId = $blocks[$i]['id'];
						$currentContent = $blocks[$i]['content'];
						$currentNode = $blocks[$i]['node'];
						if (in_array($currentNode, $hrefNodes)) {
							pq(".note.$currentId")->attr('href', $currentContent);
						} else if (in_array($currentNode, $srcNodes)) {
							pq(".note.$currentId")->attr('src', $currentContent);
						} else {
							pq(".note.$currentId")->html($currentContent);					
						}
					} else {
						foreach($blocks[$i]['blocks'] as $currentBlock) {
							$currentId = $currentBlock['id'];
							$currentContent = $currentBlock['content'];
							$currentNode = $currentBlock['node'];
							if (in_array($currentNode, $hrefNodes)) {
								pq(".note.$currentId")->attr('href', $currentContent);
							} else if (in_array($currentNode, $srcNodes)) {
								pq(".note.$currentId")->attr('src', $currentContent);
							} else {
								pq(".note.$currentId")->html($currentContent);					
							}
						}
					}
					break;
				case "delete":
					$currentId = $blocks[$i]['id'];
					pq(".note.$currentId")->remove();				
					break;
				case "copy":
					$currentId = $blocks[$i]['id'];
					pq(".note.$currentId")->clone()->insertAfter(".note.$currentId");
					break;
			}
		}
		foreach(pq('.note') as $note) {
			$classString = pq($note)->attr('class');
			$classArray = explode(" ", $classString);
			$newClassArray = array();
			foreach($classArray as $class) {
				if (!strstr($class, "note-block_")) {
					array_push($newClassArray, $class);
				}
			}
			pq($note)->attr("class", implode(" ", $newClassArray));
		}
		$doc = preg_replace("/[\r\n]+/", "\n", $doc);
		file_put_contents($filepath, $doc);
		print "<b>update complete</b><br/>$filename";
	}
}
?>