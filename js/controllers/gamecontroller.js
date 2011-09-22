/* 
	FlashNotes Keyboard
	Methods to control the gameplay and properties of a FlashNotes game, and 
	update the StatusModel */
   
/* constructor   */
Flash.Notes.Keyboard.GameController = function () {
	var maxLevel = false;
	this.getMaxLevel = function () {
		return maxLevel;
	}
	this.setMaxLevel = function (max) {
		maxLevel = max;
	}		
	this.init();	
}

/* Initialize game variables to initial state */
Flash.Notes.Keyboard.GameController.prototype.init = function () {	
	statusModel.start(false);
	statusModel.setTimeout(false);	
	statusModel.setTimeInterval(cfg.TIMEOUT);
	statusModel.setLevel(1);	
	statusModel.setPoints(0);
	statusModel.setAttempts(0);
	statusModel.setScore(0);	
	statusModel.setLives(cfg.MAX_LIVES);
	statusModel.setOverlayVisible(false);
	statusView.displayKeyOverlay(false);
	statusView.displayTime("#status_timer", 0);	
	notationController.hideNote();
	notationController.drawClef(cfg.TREBLE);
	notationModel.setKsIndex(cfg.KS_C_INDEX);
	notationModel.setAddAccidental(false);
	notationModel.setAccidentalRange(cfg.ACC_NONE);
	notationModel.setKeySignature(cfg.C);
	notationController.drawKeySignature(cfg.C);	
	notationController.setRangeIndex(cfg.MIN_RANGE_INDEX);
	$('#start_button').hide();
	$('#stop_button').hide();
	this.initClefs(cfg.TREBLE);
	this.initAccidentals();
	this.displayScore();	
	return this;
}

Flash.Notes.Keyboard.GameController.prototype.setMode = function (mode) {
	statusModel.setMode(mode);
}

Flash.Notes.Keyboard.GameController.prototype.initClefs = function (type) {
	var i;
	for (i = 0; i < 4; i++) {
		statusModel.active_clefs[i] = false;
		statusModel.clefButtons[i].removeClass('on');
		statusModel.clefButtons[i].addClass('off');
	}
	statusModel.active_clefs[type] = true;
	statusModel.clefButtons[type].removeClass('off');
	statusModel.clefButtons[type].addClass('on');
}

Flash.Notes.Keyboard.GameController.prototype.initAccidentals = function () {
	statusModel.accidental_on = false;
	$('#acc_single_sel_button').removeClass('on');
	$('#acc_single_sel_button').addClass('off');
	$('#acc_double_sel_button').removeClass('on');
	$('#acc_double_sel_button').addClass('off');
	cfg.ACCIDENTAL_ON.single_acc = false;
	cfg.ACCIDENTAL_ON.double_acc = false;
}

Flash.Notes.Keyboard.GameController.prototype.startGame = function (timer_id) {
	var start = statusModel.getStart();
	var key_id = "c";
	var mode = statusModel.getMode();
	statusModel.keyId = key_id;	
	if (!start){		
		statusModel.start(true);
		document.getElementById(key_id).focus();
		switch (mode){
			case cfg.GAME_MODE:
				this.startTimer(timer_id, statusModel.getTimeInterval(), mode);
				break;
			case cfg.PRACTICE_MODE:				
				this.startTimer(timer_id, 0, mode);
				break;
		}		
		notationController.drawNote();
	}
	else{		
		this.stopGame();
	}
}

Flash.Notes.Keyboard.GameController.prototype.startTimer = function (timer_id, timeOut, mode) {
	var t, that = this;
	if (timeOut < 0){	
		clearTimeout(this.getT);
		statusModel.setTimeout(true);		
		this.stopGame();	
	}
	else{
		t = setTimeout(function () {
			that.updateTimer(timer_id, timeOut, mode, t)}, 1000);
	}	
	statusView.displayTime(timer_id, timeOut);	
	return this;	
}

Flash.Notes.Keyboard.GameController.prototype.updateTimer = function (timer_id, time, mode, t) {	
	if (statusModel.getStart() && mode === cfg.GAME_MODE) {
		time -= 1;
		statusModel.setTime(time);
		statusModel.setTimeInterval(time);
		this.startTimer(timer_id, time, mode, t);	
	}	
	else if (statusModel.getStart() && mode === cfg.PRACTICE_MODE) {
		time += 1;
		statusModel.setTime(time);
		this.startTimer(timer_id, time, mode, t);
	}
}

Flash.Notes.Keyboard.GameController.prototype.continueGame = function (code, key_id) {
	var lives, match,
		start = statusModel.getStart(),
		level = statusModel.getLevel(),
		isGame = (statusModel.getMode() === cfg.GAME_MODE) ? true : false;
	statusModel.keyCode = parseInt(code) % 12;
	statusModel.value = notationController.getNoteValue();
	match = (statusModel.keyCode === statusModel.value) ? true : false;
	if (match) {
		statusView.updateHitDisplay(true);
	}
	else {
		statusView.updateHitDisplay(false);
	}
	if (isGame && !match){
		statusModel.decLives();		
		lives = statusModel.getLives();
		statusView.updateLivesDisplay();
	}
	if (start && match){	
		if (this.getMaxLevel()) {		
			notationController.drawClef(notationController.getRandomClefIndex(4, 0));
		}
		else {
			if (level >=5 && level <= 8) {
				notationController.drawClef(notationController.getRandomClefIndex(2, 0));
			}
			if (level >=13 && level <= 16) {
				notationController.drawClef(notationController.getRandomClefIndex(2, 2));
			}			
		}
		if (!isGame) {
			this.setPracticeRange();
			notationController.drawClef(statusModel.getRandomClefIndex());
		}
		notationController.drawNote();
		statusModel.addPoint();
		statusModel.calculateScore();
	}
	if (start){
		statusModel.addAttempt();		
		this.displayScore();
		document.getElementById(Flash.Notes.Keyboard.keyIdToElementId(key_id)).focus();
	}
}

Flash.Notes.Keyboard.GameController.prototype.stopGame = function () {
	var next_level, level, game_over;
	statusModel.start(false);	
	notationController.hideNote();	
	document.getElementById(statusModel.keyId).blur();	
	if (statusModel.getMode() === cfg.GAME_MODE){
		next_level = statusModel.isLevelAdvance(); 
		game_over = (statusModel.getLives() > 0) ? false : true;
		if (next_level){
			statusModel.advanceLevel();
			statusModel.addBonus();			
		}
		this.displaySessionAlert(false, game_over, next_level);
	}
	else{
		notationController.setRangeIndex(cfg.MIN_RANGE);
		$("#stop_button").hide();
		$("#start_button").show();
		this.displaySummary();
	}	
	return this;	
}

/* Call this function only after a timeout (not after user presses stop button) */
Flash.Notes.Keyboard.GameController.prototype.resetGame = function () {
	statusModel.setTimeout(false);
	statusModel.setTimeInterval(cfg.TIMEOUT);
	statusModel.setPoints(0);
	statusModel.setAttempts(0);	
	this.displayScore();
}

Flash.Notes.Keyboard.GameController.prototype.getStart = function() {
	return statusModel.getStart();
}

Flash.Notes.Keyboard.GameController.prototype.toggleClef = function (index) {
	if (!statusModel.getStart()) {
		var	toggleState = statusModel.toggleClefButton(index),
			clef_index,
			offset = notationModel.getClefOffset(index),
			range = notationModel.getRangeIndex();
		switch (toggleState) {
			case cfg.TOGGLE_ON:
				statusModel.clefButtons[index].removeClass('off');
				statusModel.clefButtons[index].addClass('on');
				notationModel.clefIndexProperties[index] = true;
				notationController.drawClef(index);
				break;
			case cfg.TOGGLE_OFF:
				statusModel.clefButtons[index].removeClass('on');
				statusModel.clefButtons[index].addClass('off');
				notationModel.clefIndexProperties[index] = false;
				clef_index = notationModel.practiceClefIndex();
				notationController.drawClef(clef_index);				
				break;
			default:
				break;
		}
	}
}

Flash.Notes.Keyboard.GameController.prototype.toggleAccidental = function (type) {
	if (!statusModel.getStart()) {
		var	toggleState = statusModel.toggleAccidental(type), //single_acc, double_acc, all
			key_sig = notationModel.getKeySignature(),
			acc_range = notationModel.getAccidentalRange();
		addAccidental = (cfg.ACCIDENTAL_ON.single_acc ||  cfg.ACCIDENTAL_ON.double_acc) ?
							true :  false;
		notationModel.setAddAccidental(addAccidental);
		switch (toggleState) {
			case cfg.ACC_SINGLE:
				$('#acc_single_sel_button').removeClass('off');
				$('#acc_single_sel_button').addClass('on');
				$('#acc_double_sel_button').removeClass('on');
				$('#acc_double_sel_button').addClass('off');
				if (key_sig === cfg.C) {
					notationModel.setAccidentalRange(cfg.ACC_SINGLE);
				}
				else {
					notationModel.setAccidentalRange(cfg.ACC_SINGLE_NOT_C);
				}
				break;
			case cfg.ACC_DOUBLE:
				$('#acc_single_sel_button').removeClass('on');
				$('#acc_single_sel_button').addClass('off');
				$('#acc_double_sel_button').removeClass('off');
				$('#acc_double_sel_button').addClass('on');
				notationModel.setAccidentalRange(cfg.ACC_DOUBLE);			
				break;
			case cfg.ACC_ALL:
				$('#acc_single_sel_button').removeClass('off');
				$('#acc_single_sel_button').addClass('on');
				$('#acc_double_sel_button').removeClass('off');
				$('#acc_double_sel_button').addClass('on');
				if (key_sig === cfg.C) {
					notationModel.setAccidentalRange(cfg.ACC_ALL);
				}
				else {
					notationModel.setAccidentalRange(cfg.ACC_ALL_NOT_C);
				}
				break;
			case cfg.ACC_NONE:
				$('#acc_single_sel_button').removeClass('on');
				$('#acc_single_sel_button').addClass('off');
				$('#acc_double_sel_button').removeClass('on');
				$('#acc_double_sel_button').addClass('off');
				notationModel.setAccidentalRange(cfg.ACC_NONE);
				break;
			default:				
				break;
		}
	}
}

Flash.Notes.Keyboard.GameController.prototype.toggleKeyOverlay = function () {
	statusModel.setOverlayVisible(!statusModel.getOverlayVisible());
	statusView.displayKeyOverlay(statusModel.getOverlayVisible());
}

Flash.Notes.Keyboard.GameController.prototype.updateKeySignature = function (dir) {
	if (!statusModel.getStart()) {
		var key_sig;
		notationModel.updateKeySignature(dir);
		key_sig = notationModel.getKeySigIndex();
		notationController.drawKeySignature(key_sig);
		if (key_sig != cfg.C) {
			notationModel.setAddKeySignature(true);			
			if (cfg.ACCIDENTAL_ON.single_acc && !cfg.ACCIDENTAL_ON.double_acc) {
				notationModel.setAccidentalRange(cfg.ACC_SINGLE_NOT_C);
			}			
			if (cfg.ACCIDENTAL_ON.single_acc && cfg.ACCIDENTAL_ON.double_acc) {
				notationModel.setAccidentalRange(cfg.ACC_ALL_NOT_C);
			}			
		}
		else {
			notationModel.setAddKeySignature(false);			
			if (cfg.ACCIDENTAL_ON.single_acc && !cfg.ACCIDENTAL_ON.double_acc) {
				notationModel.setAccidentalRange(cfg.ACC_SINGLE);
			}			
			if (cfg.ACCIDENTAL_ON.single_acc && cfg.ACCIDENTAL_ON.double_acc) {
				notationModel.setAccidentalRange(cfg.ACC_ALL);
			}			
		}
		if (!cfg.ACCIDENTAL_ON.single_acc && cfg.ACCIDENTAL_ON.double_acc) {
			notationModel.setAccidentalRange(cfg.ACC_DOUBLE);
		}
		if (!cfg.ACCIDENTAL_ON.single_acc && !cfg.ACCIDENTAL_ON.double_acc) {
			notationModel.setAccidentalRange(cfg.ACC_NONE);
		}
		notationModel.convertNoteValue();
	}
}

/* Sets the range of notes -- i.e., number of ledger lines -- to display in Practice Mode */
Flash.Notes.Keyboard.GameController.prototype.setPracticeRange = function () {
	var pct = statusModel.getPercent(),
		att = statusModel.getAttempts(),
		range = notationModel.getRangeIndex();
	if (pct >= cfg.P_HIGH_PCT && (att % cfg.PRACTICE_ATT === 0) && 
				range < cfg.MAX_RANGE) {		
		notationController.setRangeIndex(range + 1);
	}
	if (pct < cfg.P_LOW_PCT && range > cfg.MIN_RANGE) {		
		notationController.setRangeIndex(range - 1);
	}
}
		
/* Use this method to update the game to the next level when in GAME mode,
	ONLY after stopGame() */
Flash.Notes.Keyboard.GameController.prototype.updateLevel = function () {
	var level = statusModel.getLevel(),
		range = ((level % 2) === 0) ? (level/2 - 1) : Math.floor(level/2),
		clef_index;
	statusModel.setGameClefTypes();
	clef_index = statusModel.getRandomClefIndex();
	range = range % (cfg.MAX_RANGE + 1);	
	if (level === cfg.MAX_LEVEL) {
		this.setMaxLevel(true);
		notationModel.setKeySignature(notationModel.randomKeySignature());
		notationController.drawClef(notationController.getRandomClefIndex(4, 0));
		notationController.setRangeIndex(cfg.MAX_RANGE);
	}
	else{		
		switch (clef_index) {
			case cfg.RANDOM_TB:
				notationController.drawClef(notationController.getRandomClefIndex(2, 0));
				break;
			case cfg.RANDOM_AT:
				notationController.drawClef(notationController.getRandomClefIndex(2, 2));
				break;
			default:
				notationController.drawClef(clef_index);
				break;
		}		
		notationController.setRangeIndex(range);
	}
	if (statusModel.isAccidentalLevel()) {		
		notationModel.setAddAccidental(true);
	}
	else {		
		notationModel.setAddAccidental(false);
	}
	if (statusModel.isKeySignatureLevel()) {		
		notationModel.setAddKeySignature(true);
		notationModel.setKeySignatureLevel(statusModel.getKeySignatureLevel());
		notationModel.setKeySignature(notationModel.randomKeySignature());		
	}
	else {		
		notationModel.setAddKeySignature(false);
		notationModel.setKeySignature(cfg.C);
	}
	if (statusModel.getTimeout()){
		this.resetGame();
	}
	this.displayScore();
	this.displaySessionAlert(true, false, false);
}

Flash.Notes.Keyboard.GameController.prototype.displayPractice = function () {
	this.init();
	this.setMode(cfg.PRACTICE_MODE);
	$('#menu_frame').hide();
	$('#status_level_label').html("");
	$('#status_level').html("");
	$('#game_frame').show();		
	$('#menu_buttons').show();
	$('#game_status_box').hide();
	$('#stop_button').hide();
	$('#start_button').show();
	statusView.initHitDisplay("hit_light");
}

Flash.Notes.Keyboard.GameController.prototype.displayGame = function () {
	this.init();
	this.setMode(cfg.GAME_MODE);
	statusView.initLivesDisplay("game_lives", cfg.MAX_LIVES);
	statusView.initHitDisplay("hit_light");
	$('#status_level_label').html("Level:");
	$('#status_level').html("1");
	this.displaySessionAlert(true, false, false);		
}

/* Display points, percent, and total score on Status Bar on Game Screen */
Flash.Notes.Keyboard.GameController.prototype.displayScore = function () {	
	statusView.displayPoints("#status_points", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#status_percent", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayScore("#status_score", statusModel.getScore());
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.displayLevel("#status_level", statusModel.getLevel());
	}
	statusView.displayHiScore("#hi_score", statusModel.getHiScore());
}

/* Display points, percent, and total score on Summary Screen*/
Flash.Notes.Keyboard.GameController.prototype.displaySummary = function () {	
	var time;
	$('#game_frame').hide();
	statusView.displayPoints("#point_summary", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#percent_summary", statusModel.getPoints(), 
		statusModel.getAttempts());	
	if (statusModel.getMode() === cfg.PRACTICE_MODE) {
		$('#score_summary_row').hide();
		$('#level_summary_row').hide();
		$('#lives_summary_row').hide();
		$('#next_level_row').hide();
		$('#time_summary_row').show();
		time = (statusModel.getTime()) ? statusModel.getTime() : 0;
		$('#time_summary').html("" + time + " sec");		
	}	
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.displayScore("#score_summary", statusModel.getScore());
		$('#time_summary_row').hide();
		$('#score_summary_row').show();
		$('#level_summary_row').show();
		$('#lives_summary_row').show();
		$('#next_level_row').show();
		$('#level_summary').html("" + statusModel.getLevel());
		$('#lives_summary').html("" + statusModel.getLives());		
	}	
	$('#summary_frame').show();	
}

Flash.Notes.Keyboard.GameController.prototype.removeLivesDisplay = function () {
	if (statusModel.getMode() === cfg.GAME_MODE) {
		statusView.removeLivesDisplay();
	}
}

/* Display Game_Mode session alerts 
	@param boolean start Display "start_session" button if true, display 
		"end_session" button if false.  
	@param boolean over Display "game_end" if true		*/
Flash.Notes.Keyboard.GameController.prototype.displaySessionAlert = function (start, over, nextLevel) {
	$('#menu_frame').hide();
	$('#instructions_frame').hide();
	$('#summary_frame').hide();
	$('#game_frame').hide();		
	$('#menu_buttons').hide();
	$('#session_frame').show();
	$('#game_status_box').show();	
	if (start && !over){
		$('#session_start_header').html("Level " + statusModel.getLevel());		
		$('#session_end').hide();
		$('#game_end').hide();				
		$('#session_start').show();
		$('#session_start_button').focus();
	}
	else if (!over){
		$('#session_start').hide();
		$('#game_end').hide();
		lives = statusModel.getLives();
		lives_str = (lives > 1) ? " lives" : " life";
		$('#lives').html("" + statusModel.getLives() + lives_str + " left");
		if (nextLevel) {
			$('#bonus').html("BONUS PTS<br/>" + statusModel.getBonus());
		}
		else {
			$('#bonus').html("BONUS PTS<br/>0");
		}
		$('#session_end').show();
		$('#session_end_button').focus();
	}
	else{
		$('#session_start').hide();
		$('#session_end').hide();
		$('#game_end').show();
		$('#scores_button').focus();
	}
}

Flash.Notes.Keyboard.GameController.prototype.processFinalScore = function () {
	var xhr, hiScore, 
		scoreStr,
		currentScore = statusModel.getScore(),
		storedScore,
		time,
		date_string,
		time_string;
	statusModel.setDate();
	time = statusModel.getDateTime();
	date_string = statusModel.getDateString();
	time_string = statusModel.getTimeString();
	scoreStr = "score=" + currentScore + "&time=" + time + "&date_string=" + 
					date_string + "&time_string=" + time_string;	
	if (Modernizr.localstorage){
		storedScore = statusModel.getHiScore();
		hiScore = (storedScore > currentScore) ? storedScore : currentScore;
		statusModel.setHiScore(hiScore);
	}
	else{
		hiScore = currentScore;
		statusModel.setHiScore(hiScore);
	}
	$('#score_text').html("Please wait . . . retrieving scores");
	ajaxUtilities.createXHR();
	xhr = ajaxUtilities.getXHR();	
	ajaxUtilities.open("POST", "php/get_scores.php");
	xhr.onreadystatechange = ajaxUtilities.onChange;
	ajaxUtilities.send("POST", scoreStr);	
}

Flash.Notes.Keyboard.GameController.prototype.displayFinalScore = function (success) {
	var i, score, date, time, 
		rank = "",		
		scores = "",
		dates = "",
		footer_string = "your score: " + statusModel.getScore(),
		length = statusModel.top_scores.length;
	if (success) {
		for (i = 0; i < length; i++){			
			score = parseInt(statusModel.top_scores[i]);
			date = statusModel.top_date_strings[i];
			time = parseInt(statusModel.top_times[i]);
			if (score === statusModel.getScore() && time === statusModel.getDateTime()){
				rank += "<span class=\"your_scores\">" + (i + 1) + ".</span><br />";
				scores += "<span class=\"your_scores\">" + score + "*" +  "</span><br />";
				dates += "<span class=\"your_scores\">" + date + "</span><br />";
				footer_string = "* your score";
			}
			else {
				rank += (i + 1) + ".<br />";
				scores += score + "<br />";
				dates += date + "<br />";
			}
		}
	}
	else {
		for (i = 0; i < 10; i++){
			rank += (i + 1) + ".<br />";
			scores += "unavailable<br />";
			dates += "unavailable<br />";
		}
	}	
	$('#score_display_frame').show();
	$('#main_menu_button').focus();
	$('#top_rank').html(rank);
	$('#top_scores').html(scores);
	$('#top_dates').html(dates);
	$('#top_score_footer').html(footer_string);
}

