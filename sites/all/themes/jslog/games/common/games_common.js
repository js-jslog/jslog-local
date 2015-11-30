/*
 * A file containing pure functions which are commonly used in the games I have developed
 */


/**
 * Take a form and output an object with all of the inputs names and values contained within inner objects
 * Importantly, and distinct from jQuery's serializeArray(), checkboxes and radio buttons 'checked' properties 
 * are represented rather than the 'checked' attribute.
 * @param  form 	- a form DOM object
 * @return result 	- an object of objects each representing an input in that form, each containing a name and 
 *                   value eg ({{name:firstname, value:joe}, {name:surname, value:sinfield}, {name:age, value:29}})
 */
var serialiseFormDataComplete = function serialiseFormDataComplete (form) {
	var jQuerySerialisedInputs = jQuery(form).serializeArray(),
		manualSerialisedCheckboxes = jQuery(form).find('input:checkbox')
												.map(function (index, item) {
													return {name : item.name,
													value : item.checked};
												}).get(),
		manualSerialisedRadios 	= jQuery(form).find("input[type='radio']:checked")
												.map(function (index, item) {
													return {name : item.name,
													value : item.value};
												}).get(),
		// It is important that the checkbox and radio button array are concatenated 
		// after the full list so that they overwrite the incorrectly serialised values 
		// in the jQuerySerialisedInputs array
		allInputsSerialised = jQuerySerialisedInputs.concat(manualSerialisedCheckboxes,
															manualSerialisedRadios
															),
		result = {};

	allInputsSerialised.forEach(function (item) {
		result[item.name] = item.value;
	});
	return result;
};

/**
 * return an object mapping all of the keyboard codes to their textual descriptions
 * @return keycodeLookup - a map of keycodes to key descriptions
 */
var getKeycodeLookup = function getKeycodeLookup () {

	var keycodeLookup = {
		"8" : "backspace",			"9" : "tab",			"13" : "enter",			"16" : "shift",			"17" : "ctrl",
		"18" : "alt",				"19" : "pause/break",	"20" : "caps lock",		"27" : "escape",		"33" : "page up",	         
		"34" : "page down",			"35" : "end",			"36" : "home",			"37" : "left arrow",	"38" : "up arrow",
		"39" : "right arrow",		"40" : "down arrow",	"45" : "insert",		"46" : "delete",		"91" : "left window",
		"92" : "right window",		"93" : "select key",	"96" : "numpad 0",		"97" : "numpad 1",		"98" : "numpad 2",
		"99" : "numpad 3",			"100" : "numpad 4",		"101" : "numpad 5",		"102" : "numpad 6",		"103" : "numpad 7",
		"104" : "numpad 8",			"105" : "numpad 9",		"106" : "multiply",		"107" : "add",			"109" : "subtract",
		"110" : "decimal point",	"111" : "divide",		"112" : "F1",			"113" : "F2",			"114" : "F3",
		"115" : "F4",				"116" : "F5",			"117" : "F6",			"118" : "F7",			"119" : "F8",
		"120" : "F9",				"121" : "F10",			"122" : "F11",			"123" : "F12",			"144" : "num lock",
		"145" : "scroll lock",		"186" : ";",			"187" : "=",			"188" : ",",			"189" : "-",
		"190" : ".",				"191" : "/",			"192" : "`",			"219" : "[",			"220" : "\\",
		"221" : "]",				"222" : "'",

		"65" : "a key",			"68" : "d key",			"87" : "w key",			"83" : "s key",
		"74" : "j key",			"76" : "l key",			"73" : "i key",			"75" : "k key"
	};

	return keycodeLookup;
}