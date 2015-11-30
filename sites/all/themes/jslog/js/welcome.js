/**
 * Fade one element out and another in with a slight delay.
 * Only works on jQuery Objects passsed in
 */
var fadeBetween = function(jqObjOut, jqObjIn, options) {
  var dflt = { transMs: 1200,
               delayMs: 200};
  var opts = jQuery.extend({}, dflt, options);
  jQuery(jqObjOut).fadeOut(opts.transMs);
  setTimeout(function () {jQuery(jqObjIn).fadeIn(opts.transMs);}, opts.delayMs);
};

var fadeThroughSet = function(jqObjArray, options) {
  var dflt = { cycleDelayMs: 8000,
               iterationIndex: 0};
  var opts = jQuery.extend({}, dflt, options);
  if (opts.iterationIndex !== jqObjArray.length-1) {
    var objOut = jqObjArray[opts.iterationIndex];
    var objIn  = jqObjArray[opts.iterationIndex +1];
    fadeBetween(objOut, objIn, opts);
    opts.iterationIndex += 1;
    setTimeout(function () {fadeThroughSet(jqObjArray, opts);}, opts.cycleDelayMs);
  }
};

/**
 * Iterate through the quotes on the homepage making them visible in tern
 */
var rotateQuotes = function () {
  var quotes = jQuery(".home-blurb>span");
  fadeThroughSet(quotes);
};


(function () {
  setTimeout(function () {rotateQuotes()}, 8000);
}())