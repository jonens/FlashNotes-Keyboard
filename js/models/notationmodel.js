/*
	Games.Notation.NotationModel

	This class sets and gets current value(s) associated with the
	notation area of the screen  */

/* constructor */
Games.Notation.NotationModel = function()
{
	//cfg = new Games.Notation.Config();
	var range_index = cfg.MIN_RANGE_INDEX,
		clef_index = cfg.TREBLE,
		prev_clef_index = 0,
		note_index = 0,
		octave = -1,
		note_value = -1,
		key_signature_level = -1,
		ks_index = cfg.C,
		key_signature = cfg.KEY_SIGS[ks_index],
		accidental_range = cfg.SINGLE_C,
		add_accidental = false,
		accidental_type = cfg.ACC_TYPE_C,
		add_key_signature = false;
		//TODO: moved these to the configuration file
		this.KS_MIN = cfg.CF;
		this.KS_MAX = cfg.CS;

	this.getRangeIndex = function () {
		return range_index;
	}
	this.setRangeIndex = function (index) {
		if (index < cfg.MIN_RANGE_INDEX) {
			range_index = cfg.MIN_RANGE_INDEX;
		}
		if (index > cfg.MAX_RANGE_INDEX) {
			range_index = cfg.MAX_RANGE_INDEX;
		}
		else {
			range_index = index;
		}
	}
	this.getClefIndex = function () {
		return clef_index;
	}
	this.setClefIndex  = function (num) {
		prev_clef_index = clef_index;
		clef_index = num;
	}
	this.getPrevClefIndex = function () {
		return prev_clef_index;
	}
	this.setPrevClefIndex  = function (num) {
		prev_clef_index = num;
	}
	this.getNoteIndex = function () {
		return note_index;
	}
	this.setNoteIndex  = function (num) {
		note_index = (num >= 0) ? num : 0;
		if (note_index > 6) {
			note_index = 6;
		}
	}
	this.getOctave = function () {
		return octave;
	}
	this.setOctave  = function (num) {
		octave = num;
	}
	this.getNoteValue = function () {
		return note_value;
	}
	this.setNoteValue  = function (note_name) {
		var clef = cfg.CLEF_TYPES[clef_index],
			props, value;
		props = Vex.Flow.keyProperties(note_name, clef),
		value = props.int_value % 12;
		note_value = value;
	}
	this.getKeySignatureLevel = function () {
		return key_signature_level;
	}
	this.setKeySignatureLevel = function (num) {
		key_signature_level = num;
	}
	this.getKeySigIndex = function () {
		return ks_index;
	}
	this.setKeySigIndex = function (ksi_num) {
		ks_index = ksi_num;
	}
	this.getKeySignature = function () {
		return key_signature;
	}
	this.setKeySignature = function (index) {
		key_signature = cfg.KEY_SIGS[index];
	}
	this.updateKeySignature = function (offset) {
		ks_index = ks_index + offset;
		if (offset < 0) {
			ks_index = (ks_index >= cfg.CF) ? ks_index : cfg.CF;
		}
		else {
			ks_index = (ks_index <= cfg.CS) ? ks_index : cfg.CS;
		}
		key_signature = cfg.KEY_SIGS[ks_index];
		this.convertNoteValue();
	}
	this.setAccidental = function (accidental) {
		this.accidental = accidental;
		return this;
	};
	this.getAccidental = function() {
		return this.accidental;
	};
	this.getAccidentalRange = function () {
		return accidental_range;
	}
	this.setAccidentalRange = function (range) {
		accidental_range = range;
	}
	this.getAddAccidental = function () {
		return add_accidental;
	}
	this.setAddAccidental = function (add_acc) {
		add_accidental = add_acc;
	}
	this.getAccidentalType = function () {
		return accidental_type;
	}
	this.setAccidentalType = function (type) {
		accidental_type = type;
	}
	this.getAddKeySignature = function () {
		return add_key_signature;
	}
	this.setAddKeySignature  = function (add_ks) {
		add_key_signature = add_ks;
	}

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

/* converts index for letter part of note name only */
Games.Notation.NotationModel.prototype.convertNoteIndex = function () {
	var old_note_index = this.getNoteIndex(),
		clef_index = this.getClefIndex(),
		prev_clef_index = this.getPrevClefIndex(),
		clef_offsets = [0, 2, 1, 6], //[tr, bass, alto, tenor]
		offset;
	offset = clef_offsets[prev_clef_index] - clef_offsets[clef_index];
	this.setNoteIndex(Math.abs((old_note_index - offset) % 7));
}

/* utility function to convert to a different note index when clef changes,
	but note on stave does not change (i.e., when clef is toggled off)*/
Games.Notation.NotationModel.prototype.convertNoteValue = function () {
	var clef_index = notationModel.getClefIndex(),
		note_index = this.getNoteIndex(),
		note_name = Vex.Flow.integerToNoteLetter(note_index),
		octave = this.checkOctaveRange();
	note_name += Flash.Notes.Keyboard.keySignatureAccidentals(this.getKeySignature(),
				note_index);
	this.setNoteValue("" + note_name + "/" + octave);
}

Games.Notation.NotationModel.prototype.checkOctaveRange = function () {
	var octave = this.getOctave(),
		clef_index = this.getClefIndex(),
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

Games.Notation.NotationModel.prototype.randomClefIndex = function (range, offset){
	var index = Math.round(Math.random() * 100) % range;
	var type = this.clefIndexArray[index + offset];
	return type;
}

/* Returns a clef type from those currently selected  */
Games.Notation.NotationModel.prototype.practiceClefIndex = function () {
	var i, clef_index;
	for (i = 0; i < 4; i++) {
		clef_index = this.clefIndexProperties[i];
		if (clef_index) {
			return this.clefIndexArray[i];
		}
	}
	return null;
}

/* Return an accidental code (for use with VexFlow rendering).
	Various combinations are possible depending on Practice or Game mode,
	and the current key signature */
Games.Notation.NotationModel.prototype.randomAccidental = function () {
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

Games.Notation.NotationModel.prototype.filterAccidental = function (accidental) {
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

Games.Notation.NotationModel.prototype.randomKeySignature = function () {
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

Games.Notation.NotationModel.prototype.getImgUrl = function (type) {
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

Games.Notation.NotationModel.prototype.getClefOffset = function (type) {
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
