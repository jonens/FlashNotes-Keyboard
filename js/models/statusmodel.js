/* 
	FlashNotes Keyboard
	Provides basic control functions for games */

/* constructor */
Flash.Notes.Keyboard.StatusModel = function() {
	var time, mode, date, date_time,
		points = 0,
		attempts = 0,
		score = 0,
		level = 0,
		bonus = 0,
		lives = 5,
		go = false,
		timeInterval = cfg.TIMEOUT,
		timeOut = false,
		overlay_visible = false,
		old_score, hi_score;
	if (Modernizr.localstorage){
		old_score = parseInt(localStorage.getItem("hiscore_keys"));
		hi_score = (old_score) ? old_score : 0;
	}
	else {
		hi_score = 0;
	}
	this.getTime = function () {
		return time;
	}
	this.setTime = function (t) {
		time = t;
	}
	this.getMode = function () {
		return mode;
	}
	this.setMode = function (m) {
		mode = m;
	}
	this.setDate = function () {
		date = new Date();
		date_time = date.getTime();
	}
	this.getDateTime = function () {
		return date_time;
	}
	this.getDateString = function () {	
		var month = "" + (date.getMonth() + 1);
		var day = (date.getDate() < 10) ? "0" + date.getDate() : date.getDate();	
		return month + "-" + day + "-" + date.getFullYear();
	}
	this.getTimeString = function () {
		var hour = "" + date.getHours();
		var minute = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
		var second = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds();
		return hour + ":" + minute + ":" + second;
	}
	this.addPoint = function () {	
		points += 1;
	}
	this.setPoints = function (num) {	
		points = num;
	}
	this.getPoints = function () {
		return points;
	}
	this.addAttempt = function () {
		attempts += 1;
	}
	this.setAttempts = function (num) {
		attempts = num;
	}
	this.getAttempts = function () {
		return attempts;
	}
	this.getPercent = function () {
		return Math.floor((points / attempts) * 100);
	}
	this.calculateScore = function() {
		score += (points * level);
	}
	this.addBonus = function () {
		bonus = cfg.BONUS * level;
		score += bonus;
	}
	this.getBonus = function (){
		return bonus;
	}
	this.setScore = function (num) {
		score = num;
	}
	this.getScore = function () {
		return score;
	}
	this.getHiScore = function () {
		return hi_score;
	}
	this.setHiScore = function (num) {
		hi_score = num;
		if (Modernizr.localstorage){
			localStorage.setItem("hiscore_keys", hi_score);
		}
	}
	this.setLevel = function (lvl) {
		level = lvl;	
		if (level > cfg.BONUS_LEVEL) {
			cfg.BONUS += cfg.BONUS_INC;
		}
	}
	this.getLevel = function () {
		return level;
	}
	this.advanceLevel = function () {	
		this.setLevel((level < cfg.MAX_LEVEL) ? level += 1 : cfg.MAX_LEVEL);
		return this;
	}
	this.decLives = function () {
		lives -= 1;
		if (lives < 0){
			lives = 0;
		}
	}
	this.setLives = function (num) {
		lives = num;
	}
	this.getLives = function () {
		return lives;
	}
	/** @param boolean go Toggles game play  */
	this.start = function (g) {
		go = g;
	}
	this.getStart = function () {
		return go;
	}
	this.setTimeInterval = function (num) {
		timeInterval = num;
	}
	this.getTimeInterval = function () {
		return timeInterval;
	}
	/* Set a boolean indicating timeOut */
	this.setTimeout = function (to){
		timeOut = to;
	}
	/* Get boolean indicating timeOut */
	this.getTimeout = function () {
		return timeOut;
	}
	this.getOverlayVisible = function () {
		return overlay_visible;
	}
	this.setOverlayVisible = function (visible) {
		overlay_visible = visible;
	}
	this.top_scores = new Array();
	this.top_times = new Array();
	this.top_date_strings = new Array();
	this.top_time_strings = new Array();
	this.active_clefs = [
		true,			//treble
		false,			//bass
		false,			//alto
		false			//tenor
	];
	this.clefIndexArray = [cfg.TREBLE, cfg.BASS, cfg.ALTO, cfg.TENOR];
	this.clefButtons = [$('#treble_button'), $('#bass_button'), $('#alto_button'),
							$('#tenor_button')];							
}

Flash.Notes.Keyboard.StatusModel.prototype.isAccidentalLevel = function () {
	var i, 
		acc_levels = cfg.ACC_LEVELS,
		length = acc_levels.length;
	for (i = 0; i < length; i++) {
		if (this.getLevel() === acc_levels[i]) {
			return true;
		}
	}
	return false;
}

Flash.Notes.Keyboard.StatusModel.prototype.isKeySignatureLevel = function () {
	if (this.getLevel() >= cfg.KS_TIER_1[0] && this.getLevel() <= cfg.KS_TIER_1[1]) {
		return true;
	}
	if (this.getLevel() >= cfg.KS_TIER_2[0] && this.getLevel() <= cfg.KS_TIER_2[1]) {
		return true;
	}
	return false;
}

Flash.Notes.Keyboard.StatusModel.prototype.getKeySignatureLevel = function () {
	var i, 
		easy_levels = cfg.KS_EASY_LEVELS,
		hard_levels = cfg.KS_HARD_LEVELS,
		e_length = easy_levels.length,
		h_length = hard_levels.length;
	for (i = 0; i < e_length; i++) {
		if (this.getLevel() === easy_levels[i]) {
			return cfg.EASY_KEYS;
		}
	}
	for (i = 0; i < h_length; i++) {
		if (this.getLevel() === hard_levels[i]) {
			return cfg.HARD_KEYS;
		}
	}
	return null;	
}

/* This method operates in GAME mode to indicate whether level advances 
	@return true if level advances, false otherwise */
Flash.Notes.Keyboard.StatusModel.prototype.isLevelAdvance = function () {	
	var advance = ((this.getPercent() >= cfg.MIN_PERCENT) && (this.getTimeout()) && 
				(this.getAttempts() >= cfg.MIN_ATTEMPTS)) ? true : false;
	return advance;
}

Flash.Notes.Keyboard.StatusModel.prototype.setGameClefTypes = function () {
	var sel, sw,
		level = this.getLevel();
	if (level <= cfg.TIER_1) {
		sw = (level % 2 === 0);
		sel = [!sw, sw, false, false]; //treble || bass only
	}
	if (level > cfg.TIER_1 && level <= cfg.TIER_2) {
		sel = [true, true, false, false]; //treble || bass only
	}
	if (level > cfg.TIER_2 && level <= cfg.TIER_3) {
		sw = (level % 2 === 0);
		sel = [false, false, !sw, sw]; //alto || tenor only
	}
	if (level > cfg.TIER_3 && level <= cfg.TIER_4) {
		sel = [false, false, true, true]; //alto || tenor only
	}
	if (level > cfg.TIER_4) {
		sel = [true, true, true, true]; //any clef
	}
	this.set_clef(sel);
}

Flash.Notes.Keyboard.StatusModel.prototype.set_clef = function (selections) {
	var i;
	for (i = 0; i < 4; i++) {
		this.active_clefs[i] = selections[i];
	}
}

Flash.Notes.Keyboard.StatusModel.prototype.getRandomClefIndex = function () {
	var i, j,
		clef_index_array = [],
		count = 0;
	for (i = 0; i < 4; i++) {
		if (this.active_clefs[i] === true) {			
			clef_index_array[count] = i;
			count += 1;
		}		
	}
	if (clef_index_array.length === 1) {
		i = clef_index_array[0];		
	}
	else {
		j = Math.round(Math.random() * 100) % (clef_index_array.length);		
		i = clef_index_array[j];
	}
	return this.clefIndexArray[i];	
}

// Toggle the clef buttons; if only one button is "on", don't toggle.
Flash.Notes.Keyboard.StatusModel.prototype.toggleClefButton = function (type) {
	var i, count = 0;
	if (this.active_clefs[type]) {
		for (i = 0; i < 4; i++) {
			count += (this.active_clefs[i] === true) ? 1 : 0;
		}
		if (count === 1) {
			return cfg.TOGGLE_NONE;
		}
	}
	this.active_clefs[type] = !this.active_clefs[type];
	return (this.active_clefs[type]) ? cfg.TOGGLE_ON : cfg.TOGGLE_OFF;
}

Flash.Notes.Keyboard.StatusModel.prototype.toggleAccidental = function (t) {
	var type = t,
		accidental_on = cfg.ACCIDENTAL_ON,
		toggle_state,
		acc_single,
		acc_double;	
	accidental_on[type] = !accidental_on[type];
	acc_single = cfg.ACCIDENTAL_ON.single_acc;
	acc_double = cfg.ACCIDENTAL_ON.double_acc;
	if (acc_single && !acc_double) {
		toggle_state = cfg.ACC_SINGLE;
	}
	if (!acc_single && acc_double) {
		toggle_state = cfg.ACC_DOUBLE;
	}
	if (acc_single && acc_double) {
		toggle_state = cfg.ACC_ALL;
	}
	if (!acc_single && !acc_double) {
		toggle_state = cfg.ACC_NONE;
	}
	return toggle_state;	
}

Flash.Notes.Keyboard.StatusModel.prototype.getKeyIndex = function (code) {
	switch (code) {
		case cfg.KEY_C:
			return 0;
			break;
		case cfg.KEY_CS:
			return 1;
			break;
		case cfg.KEY_D:
			return 2;
			break;
		case cfg.KEY_DS:
			return 3;
			break;
		case cfg.KEY_E:
			return 4;
			break;
		case cfg.KEY_F:
			return 5;
			break;
		case cfg.KEY_FS:
			return 6;
			break;
		case cfg.KEY_G:
			return 7;
			break;
		case cfg.KEY_GS:
			return 8;
			break;
		case cfg.KEY_A:
			return 9;
			break;
		case cfg.KEY_AS:
			return 10;
			break;
		case cfg.KEY_B:
			return 11;
			break;
		case cfg.KEY_C2:
			return 12;
			break;
		default:
			return -1;
			break;
	}
}