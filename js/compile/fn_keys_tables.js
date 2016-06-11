/* 
	FlashNotes Keyboard Tables
	Provide conversions for various entities in game logic */

/* Clef is a number from the config file --> a clef
	Index is a range index (smaller the index, smaller the range) */
Flash.Notes.Keyboard.noteRangeProperties = function(clef) {
	var props = Flash.Notes.Keyboard.noteRangeProperties.table[clef];
	return props;
}

/* Arrays progress from min to max -- smallest to widest range
	in VexFlow, these values map to the letter names only (not accidentals)*/
Flash.Notes.Keyboard.noteRangeProperties.table = {
	0: {
		base_index: [1, 6, 4, 2],
		base_octave: [4, 3, 3, 4],
		upper_index: [4, 6, 1, 3],
		upper_octave: [5, 5, 6, 6]
	},
	1: {
		base_index: [3, 1, 6, 4],
		base_octave: [2, 2, 1, 1],
		upper_index: [6, 1, 3, 5],
		upper_octave: [3, 4, 4, 4]
	},
	2: {
		base_index: [2, 0, 5, 3],
		base_octave: [3, 3, 2, 2],
		upper_index: [5, 0, 2, 4],
		upper_octave: [4, 5, 5, 5]
	},
	3: {
		base_index: [0, 5, 3, 1],
		base_octave: [3, 2, 2, 2],
		upper_index: [3, 5, 0, 2],
		upper_octave: [4, 4, 5, 5]	
	}
}

Flash.Notes.Keyboard.keyIdToElementId = function (key_id) {
	return Flash.Notes.Keyboard.keyIdToElementId.table[key_id];
}

//Keys are mapped from qwerty keyboard to the musical keyboard name
Flash.Notes.Keyboard.keyIdToElementId.table = {
	'a' : 'c',
	'w' : 'cs',
	's' : 'd',
	'e' : 'ds',
	'd' : 'e',
	'f' : 'f',
	't' : 'fs',
	'g' : 'g',
	'y' : 'gs',
	'h' : 'a',
	'u' : 'as',
	'j' : 'b',
	'k' : 'c'
}

Flash.Notes.Keyboard.keySignatureAccidentals = function (key, index) {
	var keysig, accidental;
	if(key === undefined) {
		key = "C";
	}
	keysig = Flash.Notes.Keyboard.keySignatureAccidentals.table[key];
	accidental = keysig[index];
	return accidental;	
}

//all arrays are [0] = "C_"
Flash.Notes.Keyboard.keySignatureAccidentals.table = {
	"C": ["","","","","","",""],
	"C#": ["#","#","#","#","#","#","#"],
	"Cb": ["b","b","b","b","b","b","b"],
	"D": ["#","","","#","","",""],
	"Db": ["","b","b","","b","b","b"],
	"E": ["#","#","","#","#","",""],
	"Eb": ["","","b","","","b","b"],
	"F": ["","","","","","","b"],
	"F#": ["#","#","#","#","#","#",""],
	"G": ["","","","#","","",""],
	"Gb": ["b","b","b","","b","b","b"],
	"A": ["#","","","#","#","",""],
	"Ab": ["","b","b","","","b","b"],
	"B": ["#","#","","#","#","#",""],
	"Bb": ["","","b","","","","b"]
}