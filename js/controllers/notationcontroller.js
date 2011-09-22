/* 
	FlashNotes Keyboard Notation Controller
	Methods to control the display and properties of a notation view, and update 
	the NotationModel   */

/* constructor - @param number num The number of ledgerlines to start with */
Flash.Notes.Keyboard.NotationController = function (num)
{
	this.setRangeIndex(num);	
}

/* Draw a new staff on the Raphael canvas
	TODO: clefType not necessary if we use the drawClef exclusively */
Flash.Notes.Keyboard.NotationController.prototype.drawStaff = function ()
{
	var canvas_bg = $("div.staff_area canvas")[0];
	var bg_renderer = new Vex.Flow.Renderer(canvas_bg, Vex.Flow.Renderer.Backends.CANVAS);
	var bg_ctx = bg_renderer.getContext();
	var bg_stave = new Vex.Flow.Stave(cfg.BG_STAVE_LEFT, cfg.BG_STAVE_TOP, 
		cfg.BG_STAVE_WIDTH, Vex.Flow.stave_specs[cfg.LARGE]);
	bg_stave.setContext(bg_ctx).draw(bg_ctx, false, false);	
}

/**	@param number clefType (index)
	-- cfg.CLEF_TYPES[] = array of string clef types (to use with VexFlow functions)
*/
Flash.Notes.Keyboard.NotationController.prototype.drawClef = function (clefIndex)
{	
	var canvas_clef_layer = $("div.staff_area canvas")[1],
		clef_renderer = new Vex.Flow.Renderer(canvas_clef_layer, Vex.Flow.Renderer.Backends.CANVAS),
		clef_ctx = clef_renderer.getContext(),
		clef_stave = new Vex.Flow.Stave(cfg.CLEF_LAYER_LEFT + 10, cfg.FG_STAVE_TOP, cfg.CLEF_LAYER_WIDTH, Vex.Flow.stave_specs[cfg.LARGE]),
		clef_type = cfg.CLEF_TYPES[clefIndex],
		key_sig = notationModel.getKeySigIndex();
	notationModel.setClefIndex(clefIndex);	
	clef_ctx.clearRect(0, 0, cfg.CLEF_LAYER_WIDTH, cfg.BG_LAYER_HEIGHT);	
	clef_stave.addClef(clef_type).setContext(clef_ctx).draw(clef_ctx, false, false);
	this.drawKeySignature(key_sig);
	notationModel.convertNoteValue();
}

Flash.Notes.Keyboard.NotationController.prototype.drawNote = function () {	
	var canvas_note_layer = $("div.staff_area canvas")[3],
		clef_index = notationModel.getClefIndex(),
		clef_type = cfg.CLEF_TYPES[clef_index],
		note,
		notes,
		accidental,
		note_ys,
		note_renderer = new Vex.Flow.Renderer(canvas_note_layer, 
								Vex.Flow.Renderer.Backends.CANVAS),
		note_ctx = note_renderer.getContext(),
	
		note_stave = new Vex.Flow.Stave(cfg.NOTE_LAYER_LEFT, cfg.FG_STAVE_TOP, 
				cfg.NOTE_LAYER_WIDTH - 10, Vex.Flow.stave_specs[cfg.LARGE]),
		range_index = notationModel.getRangeIndex(),	
		note_props = Flash.Notes.Keyboard.noteRangeProperties(clef_index),	
		octave_range = (note_props.upper_octave[range_index] - 
							note_props.base_octave[range_index]) + 1,	
		octave_offset = Math.round(Math.random() * 10) % octave_range,	
		octave = note_props.base_octave[range_index] + octave_offset,
		note_base, note_range, note_offset, note_index, note_name, key;
		
	note_ctx.clearRect(0, 0, cfg.NOTE_LAYER_WIDTH, cfg.BG_LAYER_HEIGHT);
	notationModel.setOctave(octave);	
	
	/****** get a random note within range given by properties	******/ 
	if (octave_offset === 0) { //lowest octave
		note_base = note_props.base_index[range_index];		
		note_range = 6 - note_base;	//prevent wrap-around to lower-than-base note
	}
	else if (octave_offset === (octave_range - 1)) {//highest octave
		note_base = 0;		
		note_range = note_props.upper_index[range_index]; //only as high as highest note in range	
	}
	else { //full range of notes
		note_base = 0;		
		note_range = 6;		
	}
	note_offset = (note_range > 0 ) ? Math.round(Math.random() * 10000) % note_range : 0;	
	note_index = note_base + note_offset; //0 - 6
	notationModel.setNoteIndex(note_index);
	
	/******** Set the correct note value for matching purposes in the game ****/
	note_name = Vex.Flow.integerToNoteLetter(note_index);
	if (notationModel.getAddAccidental()) {
		accidental = notationModel.randomAccidental();
		if (accidental) {
			note_name += accidental;
		}
	}
	if (notationModel.getAddKeySignature() && !accidental) {
		note_name += Flash.Notes.Keyboard.keySignatureAccidentals(notationModel.getKeySignature(),
				notationModel.getNoteIndex());
		this.drawKeySignature(notationModel.getKeySigIndex());
	}
	note_name = "" + note_name + "/" + octave + "";
	notationModel.setNoteValue(note_name);
	
	/************ Render the note on the canvas ******************************/
	note = new Vex.Flow.StaveNote({ keys: [note_name], duration: "w", clef: clef_type, 
					size: cfg.LARGE_W }).setRenderOptions();
	if (accidental) {
		note.addAccidental(0, new Vex.Flow.Accidental(accidental));
	}
	note_stave.setContext(note_ctx).draw(note_ctx, false, false);
	notes = [note];
	Vex.Flow.Formatter.FormatAndDraw(note_ctx, note_stave, notes, Vex.Flow.TIME4_4);
}

Flash.Notes.Keyboard.NotationController.prototype.hideNote = function ()
{
	var stave_layer = $("div.staff_area canvas")[3];	
	var stave_renderer = new Vex.Flow.Renderer(stave_layer, 
								Vex.Flow.Renderer.Backends.CANVAS);
	var stave_ctx = stave_renderer.getContext();
	stave_ctx.clearRect(0, 0, cfg.NOTE_LAYER_WIDTH, cfg.BG_LAYER_HEIGHT);
	var note_stave = new Vex.Flow.Stave(cfg.NOTE_LAYER_LEFT, cfg.FG_STAVE_TOP, 
			cfg.NOTE_LAYER_WIDTH - 10, Vex.Flow.stave_specs[cfg.LARGE]);
	note_stave.setContext(stave_ctx).draw(stave_ctx, false, false);
}

Flash.Notes.Keyboard.NotationController.prototype.drawKeySignature = function (keySpec)
{
	
	var clef = notationModel.getClefIndex(),
		canvas_ks_layer = $("div.staff_area canvas")[2],
		ks_renderer = new Vex.Flow.Renderer(canvas_ks_layer, Vex.Flow.Renderer.Backends.CANVAS),
		ks_ctx = ks_renderer.getContext(),
		key_sig = notationModel.getKeySignature(keySpec),		
		ks_stave = new Vex.Flow.Stave(cfg.KS_LAYER_LEFT, cfg.FG_STAVE_TOP, cfg.KS_LAYER_WIDTH, Vex.Flow.stave_specs[cfg.LARGE]);	
	ks_ctx.clearRect(0, 0, cfg.KS_LAYER_WIDTH, cfg.BG_LAYER_HEIGHT);
	ks_stave.addKeySignature(key_sig, clef).setContext(ks_ctx).draw(ks_ctx, false, false);
	notationModel.setKeySignature(keySpec);
}

Flash.Notes.Keyboard.NotationController.prototype.drawTimeSignature = function ()
{
	//TODO
}

Flash.Notes.Keyboard.NotationController.prototype.getNoteValue = function ()
{
	return notationModel.getNoteValue();
}

Flash.Notes.Keyboard.NotationController.prototype.setRangeIndex = function (num)
{
	notationModel.setRangeIndex(num);
}

Flash.Notes.Keyboard.NotationController.prototype.getRandomClefIndex = function (range, offset)
{	
	return notationModel.randomClefIndex(range, offset);	
}

Flash.Notes.Keyboard.NotationController.prototype.getRandomKeySignature = function ()
{	
	return notationModel.randomKeySignature();	
}

