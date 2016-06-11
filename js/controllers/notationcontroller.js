/* 
	Games.Notation.NotationController
	Methods to control the display and properties of a notation view, and update
	the NotationModel   */

/* constructor - @param number num The number of ledgerlines to start with */
Games.Notation.NotationController = function ()
{
	this.backend = Vex.Flow.Renderer.Backends.CANVAS;
	if (!Modernizr.canvas) {
		this.backend = Vex.Flow.Renderer.Backends.RAPHAEL;
	}
	this.note_spacer = 120;
}

/** Draw a new staff on the canvas
	@param string canvas_id - the DOM canvas element id
	@param number x, y - the starting (upper left) coordinates for the staff
	@param number width - the width of the staff
	@param string size - the VexFlowMod size parameter (e.g., Config.LARGE = "large"*/
Games.Notation.NotationController.prototype.drawStaff = function (canvas_id, x, y, width, scale)
{
	var canvas = document.getElementById(canvas_id);
	var renderer = new Vex.Flow.Renderer(canvas, this.backend);
	var ctx = renderer.getContext();
	var stave = new Vex.Flow.Stave(x, y, width);
	ctx.setTransform(1,0,0,1,0,0);  //set the ID matrix
	ctx.scale(scale, scale);
	stave.setContext(ctx).draw(ctx, false, false);
	return stave;
}

/**	Draw a clef on an existing staff
	@param string canvas_id - the DOM canvas element id
	@param stave (object) stave - the VexFlow stave object to draw on
	@param string clef_type - The name string value of the clef to draw*/
Games.Notation.NotationController.prototype.drawClef = function (canvas_id, stave, clef_type)
{
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		remove_x;
	stave.addClef(clef_type);
	if (stave.glyphs.length > 1) {
		stave.glyphs[0] = stave.glyphs[stave.glyphs.length - 1];
		stave.glyphs.pop(stave.glyphs.length - 1);
		stave.glyphs.pop(stave.glyphs.length - 1);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	stave.setContext(ctx).draw(ctx, false, false);
}

/**
	Draw a note on the given staff with the given parameters
	@param string canvas_id 	The DOM canvas element id for this note/staff
	@param Vex.Flow.Stave stave 			The VexFlow stave object for this note
	@param string note_name		The note name index for VexFlow
	@param string note_dur		The note duration index for VexFlow
	@param Vex.Flow time_sig  	The VexFlow sime signature property object for this stave
	@param string accidental  	The accidental symbol for VexFlow 				*/
Games.Notation.NotationController.prototype.drawNote = function (canvas_id, stave,
		note_name, note_dur, time_sig, startx, accidental) {
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		note,
		notes;
	/************ Render the note on the canvas ******************************/
	note = new Vex.Flow.StaveNote({ keys: [note_name], duration: note_dur,
				clef: stave.clef});
	if (accidental) {
		note.addAccidental(0, new Vex.Flow.Accidental(accidental));
	}
	stave.setNoteStartX(startx);
	this.note_spacer = startx;
	notes = [note];

	Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes, time_sig);
	return note;
}

/**
	Draw notes on the given stave with the given parameters
	@param string canvas_id 	The DOM canvas element id for this note/staff
	@param Vex.Flow.Stave stave The VexFlow stave object for this note
	@param object noteSpecs		Object containing properties for all StaveNotes to be drawn
	@param Vex.Flow time_sig  	The VexFlow sime signature property object for this stave
	@param number startx		The first x-pos on the canvas for drawing notes*/
Games.Notation.NotationController.prototype.drawNotes = function (canvas_id, stave,
		noteSpecs, time_sig, startx) {
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		glyph_width = 0,
		i, j, note, nkeys =[], accidentals = [],
		notes = [];
	/************ Render the note on the canvas ******************************/
	for (i = 0; i < noteSpecs.length; i++) {
		for (j = 0; j < noteSpecs[i].note_names.length; j++) {
			nkeys[j] = noteSpecs[i].note_names[j];
			accidentals[j] = noteSpecs[i].accidentals[j];
		}
		note = new Vex.Flow.StaveNote({ keys: nkeys, duration: noteSpecs[i].note_dur,
										clef: stave.clef});
		for (j = 0; j < noteSpecs[i].note_names.length; j++) {
			if (accidentals[j]) {
				note.addAccidental(j, new Vex.Flow.Accidental(accidentals[j]));
			}
		}
		notes[i] = note;
	}
	stave.setNoteStartX(startx);
	Vex.Flow.Formatter.FormatAndDraw(ctx, stave, notes, time_sig);
	return note;
}

Games.Notation.NotationController.prototype.addAccidental = function (canvas_id, stave, note, index, acc_type) {
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext();
	note.addAccidental(index, new Vex.Flow.Accidental(acc_type));
	stave.setContext(ctx).draw(ctx, false, false);
}

Games.Notation.NotationController.prototype.hideNote = function (canvas_id, stave)
{
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		len = stave.glyphs.length,
		i;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	stave.setNoteStartX(this.note_spacer);
	stave.setContext(ctx).draw(ctx, false, false);
}

/** Draw a key signature on an existing staff
	@param stave (object) stave - the VexFlow stave object to draw on
	@param string keySpec - The name string value of the key signature to draw
	@param number clefSpec - The numeric index of the clef to draw*/
Games.Notation.NotationController.prototype.drawKeySignature = function (canvas_id, stave, keySpec)
{
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		x_offset = 2;
	this.clearKeySignature(stave);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	stave.addKeySignature(keySpec).setContext(ctx).draw(ctx, false, false);
}

/** accidentalCodes can be read from Vex.Flow.accidentalCodes()
	clef codes: Treble = "v83"
	time signature code = "v0"*/
Games.Notation.NotationController.prototype.clearKeySignature = function (stave) {
	var i, remove_x, len = stave.glyphs.length;
	for (i = len - 1; i > 0; i--) {
		stave.glyphs.pop(i);
	}
}

Games.Notation.NotationController.prototype.drawTimeSignature = function (canvas_id, stave, timeSpec) {
	var canvas = document.getElementById(canvas_id),
		renderer = new Vex.Flow.Renderer(canvas, this.backend),
		ctx = renderer.getContext(),
		x_offset = 2,
		len = stave.glyphs.length;
	stave.addTimeSignature(timeSpec).setContext(ctx).draw(ctx, false, false);
}

/** accidentalCodes can be read from Vex.Flow.accidentalCodes()
	clef codes: Treble = "v83"
	time signature code = "v0"*/
Games.Notation.NotationController.prototype.clearTimeSignature = function (stave) {
	var i, len = stave.glyphs.length, code;
	for (i = len - 1; i >= 0; i--) {
		code = stave.glyphs[i].code;
		if (code === "v0"){
			stave.glyphs.pop(i);
		}
	}
}

Games.Notation.NotationController.prototype.getNoteValue = function ()
{
	return notationModel.getNoteValue();
}

Games.Notation.NotationController.prototype.setRangeIndex = function (num)
{
	notationModel.setRangeIndex(num);
}

Games.Notation.NotationController.prototype.getRandomClefIndex = function (range, offset)
{
	return notationModel.randomClefIndex(range, offset);
}

Games.Notation.NotationController.prototype.getRandomKeySignature = function ()
{
	return notationModel.randomKeySignature();
}
