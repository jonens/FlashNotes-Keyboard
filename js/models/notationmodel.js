/* 
	FlashNotes Keyboard Notation Model
	
	This class sets and gets current value(s) associated with the 
	notation area of the screen  */

/* constructor */
Flash.Notes.Keyboard.NotationModel = function()
{
	this.notePos = 0;
	this.valOffset = 0;
	this.ledgerLines = 0;
	this.range = cfg.MIN_RANGE;
	this.prevClefIndex = 0;
	this.clefIndex = 0;
	this.noteIndex = 0;
	this.octave = -1;
	this.noteValue =  -1;
	this.key_signature_level = -1;
	this.keySig = cfg.C;
	this.ks_index = cfg.C;
	this.KS_MIN = cfg.CF;
	this.KS_MAX = cfg.CS;
	this.accidental_range = cfg.SINGLE_C;
	this.add_accidental = false;
	this.accidental_type = cfg.ACC_TYPE_C;
	this.accidental = cfg.NONE;
	this.add_key_signature = false;
	this.clefIndexArray = [cfg.TREBLE, cfg.BASS, cfg.ALTO, cfg.TENOR];
	this.clefIndexProperties = {
		'0': true,
		'1': false,
		'2': false,
		'3': false	
	}	
	this.keysig_acc_type = {
		"sharp" : "#",
		"flat" : "b"
	}
}

/* Note index for naming the letter name: range = [0-6] */
Flash.Notes.Keyboard.NotationModel.prototype.setNoteIndex = function(index) {
	this.noteIndex = index;
	if (this.index < 0) {
		this.noteIndex = 0;
	}
	if (this.index > 6) {
		this.noteIndex = 6;
	}	
	return this;	
}

Flash.Notes.Keyboard.NotationModel.prototype.getNoteIndex = function() {
	return this.noteIndex;
}

Flash.Notes.Keyboard.NotationModel.prototype.setOctave = function(num) {
	this.octave = num;
	return this;	
}

Flash.Notes.Keyboard.NotationModel.prototype.getOctave = function() {
	return this.octave;
}

/* converts index for letter part of note name only */
Flash.Notes.Keyboard.NotationModel.prototype.convertNoteIndex = function () {
	var old_index = this.getNoteIndex(),
		clef_offsets = [0, 2, 1, 6], //[tr, bass, alto, tenor]
		offset;
	offset = clef_offsets[this.prevClefIndex] - clef_offsets[this.clefIndex];
	this.setNoteIndex(Math.abs((old_index - offset) % 7));
	return this;
}

/* utility function to convert to a different note index when clef changes,
	but note on stave does not change (i.e., when clef is toggled off)*/
Flash.Notes.Keyboard.NotationModel.prototype.convertNoteValue = function () {
	var clef_index = notationModel.getClefIndex(),
		note_index = this.getNoteIndex(),
		note_name = Vex.Flow.integerToNoteLetter(note_index),
		octave = this.checkOctaveRange();
	note_name += Flash.Notes.Keyboard.keySignatureAccidentals(this.getKeySignature(),
				note_index);
	this.setNoteValue("" + note_name + "/" + octave);
}

Flash.Notes.Keyboard.NotationModel.prototype.checkOctaveRange = function () {
	var octave = this.getOctave(),
		clef_index = notationModel.getClefIndex(),
		range = this.getRangeIndex(),
		index = this.getNoteIndex(),
		props = Flash.Notes.Keyboard.noteRangeProperties(clef_index),
		min_octave = props.base_octave[range],
		max_octave = props.upper_octave[range],
		min_index = props.base_index[range],
		max_index = props.upper_index[range];
	if (octave < min_octave) { 
		octave = min_octave;
	}
	if (octave === min_octave && index < min_index) {
		octave = min_octave + 1;
	}
	if (octave > max_octave) {
		octave = max_octave;
	}
	if (octave === max_octave && index > max_index) {
		octave = max_octave - 1;
	}
	return octave;	
}

Flash.Notes.Keyboard.NotationModel.prototype.setClefIndex = function(clef_index) {
	this.prevClefIndex = this.getClefIndex();
	this.clefIndex = clef_index;
	return this;	
}

Flash.Notes.Keyboard.NotationModel.prototype.getClefIndex = function() {
	return this.clefIndex;
}

Flash.Notes.Keyboard.NotationModel.prototype.setNoteValue = function (note_name) {
	var clef = cfg.CLEF_TYPES[this.clefIndex],
		props, value;	
	props = Vex.Flow.keyProperties(note_name, clef),
	value = props.int_value % 12;
	this.noteValue = value;
}

Flash.Notes.Keyboard.NotationModel.prototype.getNoteValue = function() {
	return this.noteValue;
}

/* Switch - @param boolean add -- if true, add accidental to note */
Flash.Notes.Keyboard.NotationModel.prototype.setAddAccidental = function (add) {
	this.add_accidental = add;
	return this;
}

/* Flag - returns true if accidental should be added to note */
Flash.Notes.Keyboard.NotationModel.prototype.getAddAccidental = function () {
	return this.add_accidental;
}

Flash.Notes.Keyboard.NotationModel.prototype.setAccidentalType = function (type) {
	this.accidental_type = type;
	return this;
}

Flash.Notes.Keyboard.NotationModel.prototype.getAccidentalType = function () {
	return this.accidental_type;
}

Flash.Notes.Keyboard.NotationModel.prototype.getAccidental = function () {
	return this.accidental;
}

Flash.Notes.Keyboard.NotationModel.prototype.setAccidental = function (accid) {
	this.accidental = accid;
	return this;
}

/* Switch - @param boolean add -- if true, add key signature to stave */
Flash.Notes.Keyboard.NotationModel.prototype.setAddKeySignature = function (add) {
	this.add_key_signature = add;
	return this;
}

/* Flag - returns true if accidental should be added to note */
Flash.Notes.Keyboard.NotationModel.prototype.getAddKeySignature = function () {
	return this.add_key_signature;
}

Flash.Notes.Keyboard.NotationModel.prototype.setKeySignatureLevel = function (level) {
	this.key_signature_level = level;
	return this;
}

Flash.Notes.Keyboard.NotationModel.prototype.getKeySignatureLevel = function () {
	return this.key_signature_level;
}

Flash.Notes.Keyboard.NotationModel.prototype.getKeySignature = function () {	
	var key_sig = cfg.KEY_SIGS[this.keySig];	
	return cfg.KEY_SIGS[this.keySig];
}

Flash.Notes.Keyboard.NotationModel.prototype.getKeySigIndex = function () {
	return this.keySig;
}

Flash.Notes.Keyboard.NotationModel.prototype.setKeySignature = function (keySig) {	
	this.keySig = keySig;
	return this;
}

//use this with Practice Mode to scroll through key signatures inc/dec sharps/flats
Flash.Notes.Keyboard.NotationModel.prototype.updateKeySignature = function (offset) {	
	var result = this.keySig + offset;
	if (offset < 0) {
		this.keySig = (result >= this.KS_MIN) ? result : this.KS_MIN;
	}
	else {
		this.keySig = (result <= this.KS_MAX) ? result : this.KS_MAX;
	}
	this.convertNoteValue();
}

Flash.Notes.Keyboard.NotationModel.prototype.setKeySigIndex = function (index) {
	this.ks_index = index;
	return this;
}

Flash.Notes.Keyboard.NotationModel.prototype.setRangeIndex = function(num) {
	if (num < cfg.MIN_RANGE) {
		this.range = cfg.MIN_RANGE;
	}
	if (num > cfg.MAX_RANGE) {
		this.range = cfg.MAX_RANGE;
	}
	else {
		this.range = num;
	}
	return this;
}

Flash.Notes.Keyboard.NotationModel.prototype.getRangeIndex = function() {
	return this.range;
}

Flash.Notes.Keyboard.NotationModel.prototype.randomClefIndex = function (range, offset){
	var index = Math.round(Math.random() * 100) % range;
	var type = this.clefIndexArray[index + offset];
	return type;
}

/* Returns a clef type from those currently selected  */
Flash.Notes.Keyboard.NotationModel.prototype.practiceClefIndex = function () {
	var i, clef_index;
	for (i = 0; i < 4; i++) {		
		clef_index = this.clefIndexProperties[i];
		if (clef_index) {
			return this.clefIndexArray[i];
		}
	}
	return null;
}

Flash.Notes.Keyboard.NotationModel.prototype.setAccidentalRange = function (range) {
	this.accidental_range = range;
	return this;
}

Flash.Notes.Keyboard.NotationModel.prototype.getAccidentalRange = function () {
	return this.accidental_range;
}

/* Return an accidental code (for use with VexFlow rendering).	
	Various combinations are possible depending on Practice or Game mode,
	and the current key signature */	
Flash.Notes.Keyboard.NotationModel.prototype.randomAccidental = function () {
	var range = this.getAccidentalRange(),
		index, 		
		accidental = null,
		all_symbols = [null, "b", "#", "bb", "##", "n"],
		single_symbols = [null, "b", "#","n"],
		double_symbols = [null, "bb", "##"],
		a_length = all_symbols.length,
		s_length = single_symbols.length,
		d_length = double_symbols.length,
		i,
		note_index = this.getNoteIndex(),
		key_sig = this.getKeySignature();
	switch(range){	
		case cfg.ACC_ALL:
			index = Math.round((Math.random() * 1000)) % (a_length - 1);
			accidental = all_symbols[index];//except "n"
			break;
		case cfg.ACC_ALL_NOT_C:
			index = Math.round((Math.random() * 1000)) % a_length;
			accidental = all_symbols[index];
			if (accidental) {
				accidental = this.filterAccidental(accidental);//return accidental or null
			}
			break;
		case cfg.ACC_SINGLE:
			index = Math.round((Math.random() * 1000)) % (s_length - 1);
			accidental = single_symbols[index];//except "n"
			break;
		case cfg.ACC_SINGLE_NOT_C :			
			index = Math.round((Math.random() * 1000)) % s_length;
			accidental = single_symbols[index];
			if (accidental) {
				accidental = this.filterAccidental(accidental);//return accidental or null
			}
			break;		
		case cfg.ACC_DOUBLE:			
			index = Math.round((Math.random() * 1000)) % d_length;//null, "b", "#", or "n"
			accidental = double_symbols[index];
			break;		
		default:	
			break;
		}
	return accidental;
}

Flash.Notes.Keyboard.NotationModel.prototype.filterAccidental = function (accidental) {
	var key_sig = this.getKeySignature(),
		note_index = this.getNoteIndex(),
		key_accidental = Flash.Notes.Keyboard.keySignatureAccidentals(key_sig, note_index);
	if (accidental === "##" || accidental === "bb") {
		return accidental;
	}
	if (accidental === "n") {
		return (key_accidental != "") ? accidental : null;
	}
	if (key_accidental == "") {
		return accidental;
	}
	return null;
}

Flash.Notes.Keyboard.NotationModel.prototype.randomKeySignature = function () {
	var easy = (this.getKeySignatureLevel() === cfg.EASY_KEYS) ? true : false,
		length,
		index,
		key_sig;
	if (easy) {
		length = cfg.KS_EASY.length;
		index = Math.round((Math.random() * 1000)) % length;
		key_sig = cfg.KS_EASY[index];
	}
	else {
		length = cfg.KS_HARD.length;
		index = Math.round((Math.random() * 1000)) % length;
		key_sig = cfg.KS_HARD[index];
	}
	return key_sig;
}

Flash.Notes.Keyboard.NotationModel.prototype.getImgUrl = function (type) {	
	switch(type) {		
		case cfg.TREBLE:
			return "images/treble.png";
			break;		
		case cfg.BASS:
			return "images/bass.png";
			break;		
		case cfg.ALTO:
			return "images/c_clef.png";
			break;		
		case cfg.TENOR:
			return "images/c_clef.png";
			break;
		default:			
			return "images/treble.png";
			break;
	}
}

Flash.Notes.Keyboard.NotationModel.prototype.getClefOffset = function (type) {
	switch(type) {		
		case cfg.TREBLE:
			return cfg.TREBLE_OFFSET;
			break;		
		case cfg.BASS:			
			return cfg.BASS_OFFSET;
			break;
		case cfg.ALTO:			
			return cfg.ALTO_OFFSET;
			break;
		case cfg.TENOR:			
			return cfg.TENOR_OFFSET;
			break;
		default:			
			return cfg.TREBLE_OFFSET;
			break;
	}
}