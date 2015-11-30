/**
 * Functions which need to be executed immediately on all pages
 * @return none
 */
(function () {

/**
 * Attach a click handler to quotation elements to scroll to their bib reference at the bottom of the page if one exists (as it should)
 */
jQuery(function() { 
  jQuery('q,blockquote').click(function() {
    jQuery('html, body').scrollTo(jQuery(this).attr('cite'), 500); 
  });
});

/**
 * Attach a click handler to elements which link within the page to sections
 */
jQuery(function() { 
  jQuery('.href-scroll-id').click(function(event) {
  	event.preventDefault();
    jQuery('html, body').scrollTo(jQuery(this).attr('href'), 500);
  });
});

}());


