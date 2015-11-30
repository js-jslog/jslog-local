<?php
/**
 * 1. Resize content column size if neccessary so that the sidebars are a little wider
 * 2. $base_url preprocessing
 * 3. Run functions for pulling in page & content type specific files
 */
function jslog_preprocess_page(&$variables) {
  /**global $base_url;
  $variables['base_url'] = $base_url;
  */
  
  $node_name = drupal_get_path_alias();
  
  if ($node_name == 'articles') {
    importsForArticles();
  }
  elseif ($node_name == 'welcome') {
  	importsForWelcome();
  }
  elseif ($node_name == 'about') {
  	importsForAbout();
  }
  elseif ($node_name == 'portfolio') {
    importsForPortfolio();
  }
  elseif ($node_name == 'tron-game') {
    importsForTron();
  }
  elseif ($node_name == 'floating-point-visualisation') {
    importsForFLoatPointVisual();
  }



}


function importsForArticles() {
  drupal_add_css(path_to_theme() . '/css/ps-articles.css', array('group'  => CSS_THEME));
}

function importsForWelcome() {
	drupal_add_css(path_to_theme() . '/css/ps-welcome.css', array('group'  => CSS_THEME));
  drupal_add_js(path_to_theme() . '/js/welcome.js', array( 'weight' => '1', 'group'  => JS_THEME));
}

function importsForAbout() {
  drupal_add_css(path_to_theme() . '/css/ps-about.css', array('group'  => CSS_THEME));
}

function importsForPortfolio() {
  drupal_add_css(path_to_theme() . '/css/ps-portfolio.css', array('group'  => CSS_THEME));
}


function importsForTron() {
	drupal_add_js(path_to_theme() . '/games/common/games_common.js', array(	'weight' => '1', 'group'  => JS_THEME));
	drupal_add_js(path_to_theme() . '/games/common/jasny-bootstrap.min.js', array('weight' => '2', 'group'  => JS_THEME));
	drupal_add_js(path_to_theme() . '/games/tron/js/tronLogic2.js', array(	'weight' => '3', 'group'  => JS_THEME));
	drupal_add_js(path_to_theme() . '/games/tron/js/tronSetup.js', array(	'weight' => '4',
																			'scope'  => 'footer', 'group'  => JS_THEME));

	drupal_add_css(path_to_theme() . '/games/tron/css/jasny-bootstrap.min.css', array('group'  => CSS_THEME));
	drupal_add_css(path_to_theme() . '/games/tron/css/tron.css', array('group'  => CSS_THEME));
}

function importsForFLoatPointVisual() {
  drupal_add_js(path_to_theme() . '/games/common/games_common.js', array( 'weight' => '1', 'group'  => JS_THEME));

  drupal_add_css(path_to_theme() . '/3rd-party/floating-point-visualisation/css/bits.css', array('group'  => CSS_THEME));
  drupal_add_css(path_to_theme() . '/3rd-party/floating-point-visualisation/css/dynks.css', array('group'  => CSS_THEME));
  drupal_add_css(path_to_theme() . '/3rd-party/floating-point-visualisation/css/math.css', array('group'  => CSS_THEME));
  drupal_add_css(path_to_theme() . '/3rd-party/floating-point-visualisation/css/visualization.css', array('group'  => CSS_THEME));
}




/*update the column widths on the home page - currently not used*/
function resize_content_column(&$variables) {
  // Add information about the number of sidebars.
  if (!empty($variables['page']['sidebar_first']) && !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = ' class="col-sm-4"';
  }
  elseif (!empty($variables['page']['sidebar_first']) || !empty($variables['page']['sidebar_second'])) {
    $variables['content_column_class'] = ' class="col-sm-8"';
  }
  else {
    $variables['content_column_class'] = ' class="col-sm-12"';
  }
}