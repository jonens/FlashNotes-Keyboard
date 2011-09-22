//Flash.Notes.Keyboard
$(document).ready(function () {

	/* Set up global variables and objects */
	var inputs = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k"];
	var key_buttons = ["#c", "#cs", "#d", "#ds", "#e", "#f", "#fs", "#g", "#gs", "#a",
							"#as", "#b", "#c2"];
	
	if (!Modernizr.canvas) {
		$('#nocanvas_frame').show();
	}
	else {
		cfg = new Flash.Notes.Keyboard.Config();
		statusModel = new Flash.Notes.Keyboard.StatusModel();
		statusView = new Flash.Notes.Keyboard.StatusView();
		notationModel = new Flash.Notes.Keyboard.NotationModel();
		notationController = new Flash.Notes.Keyboard.NotationController(cfg.MIN_RANGE);			
		gameController = new Flash.Notes.Keyboard.GameController();
		
		$("div.staff_area canvas")[0].width = cfg.BG_LAYER_WIDTH;
		$("div.staff_area canvas")[0].height = cfg.BG_LAYER_HEIGHT;
		$("div.staff_area canvas")[1].width = cfg.CLEF_LAYER_WIDTH;
		$("div.staff_area canvas")[1].height = cfg.BG_LAYER_HEIGHT;
		$("div.staff_area canvas")[2].width = cfg.KS_LAYER_WIDTH;
		$("div.staff_area canvas")[2].height = cfg.BG_LAYER_HEIGHT;
		$("div.staff_area canvas")[3].width = cfg.NOTE_LAYER_WIDTH;
		$("div.staff_area canvas")[3].height = cfg.BG_LAYER_HEIGHT;
		$('.accid_sel_Btn').addClass('off');
		$('#stop').hide();
		$('#menu_frame').show();
		$('#practice_button').focus();		
		$('#practice_button').click(function () {
			gameController.displayPractice();
		});
		$('#practice_button').keydown(function (event) {			
			var code = parseInt(event.keyCode);
			if (code === cfg.UP_KEY) {
				$('#instructions_button').focus();
			}
			if (code === cfg.DOWN_KEY) {
				$('#play_button').focus();
			}
		});
		$('#play_button').click(function () {		
			gameController.displayGame();
		});
		$('#play_button').keydown(function (event) {			
			var code = parseInt(event.keyCode);
			if (code === cfg.UP_KEY) {
				$('#practice_button').focus();
			}
			if (code === cfg.DOWN_KEY) {
				$('#instructions_button').focus();
			}
		});
		$('#instructions_button').click(function () {
			$('#menu_frame').hide();
			$('#instructions_frame').show();
			$('#back_button').focus();
		});
		$('#instructions_button').keydown(function (event) {			
			var code = parseInt(event.keyCode);
			if (code === cfg.UP_KEY) {
				$('#play_button').focus();
			}
			if (code === cfg.DOWN_KEY) {
				$('#practice_button').focus();
			}
		});
		$('#back_button').click(function () {
			$('#instructions_frame').hide();
			$('#menu_frame').show();
			$('#practice_button').focus();
		});		
		$('#start_button').click(function () {
			var started = gameController.getStart();		
			if (!started) {
				$(this).hide();
				$('#stop_button').show();
			}			
			gameController.startGame("#status_timer");
		});
		$('#stop_button').click(function () {
			var started = gameController.getStart();		
			if (started) {
				$(this).hide();
				$('#start_button').show();
			}
			gameController.stopGame();
			$('#sum_continue_button').focus();
		});	
		$('.black_key_Btn').keydown(function (event) {
			var index, keyId, code = parseInt(event.keyCode);
			if (code === '13') {
				event.preventDefault();
			}
			if (code >= 65 && code <= 89) {
				index = statusModel.getKeyIndex(code);
				if (index != -1) {
					keyId = inputs[index];
					k_btn = key_buttons[index];
					$(k_btn).css('background-color', '#127');					
					gameController.continueGame(index, keyId);
				}
			}
		});
		$('.black_key_Btn').keyup(function (event) {
			var index, keyId, code = parseInt(event.keyCode);			
			if (code === '13') {
				event.preventDefault();
			}
			if (code >= 65 && code <= 89) {
				index = statusModel.getKeyIndex(code);
				if (index != -1) {
					keyId = inputs[index];
					k_btn = key_buttons[index];
					$(k_btn).css('background-color', '#000');
				}
			}
		});
		$('.white_key_Btn').keydown(function (event) {
			var index, keyId, code = event.keyCode;
			if (code === '13') {
				event.preventDefault();
			}
			if (code >= 65 && code <= 89) {
				index = statusModel.getKeyIndex(code);
				if (index != -1) {
					keyId = inputs[index];
					k_btn = key_buttons[index];
					$(k_btn).css('background-color', '#127');
					gameController.continueGame(index, keyId);
				}
			}
		});
		$('.white_key_Btn').keyup(function (event) {
			var index, keyId, code = event.keyCode;
			if (code === '13') {
				event.preventDefault();
			}
			if (code >= 65 && code <= 89) {
				index = statusModel.getKeyIndex(code);
				if (index != -1) {
					keyId = inputs[index];
					k_btn = key_buttons[index];
					$(k_btn).css('background-color', '#fff');
				}
			}
		});
		$('.black_key_Btn').click(function () {
			var $input = $(this);		
			var code = $input.attr('value');			
			keyId = inputs[code];
			gameController.continueGame(code, keyId);		
		});
		$('.white_key_Btn').click(function () {
			var $input = $(this);		
			var code = $input.attr('value');
			var keyId = inputs[code];			
			gameController.continueGame(code, keyId);		
		});
		$('.overlay').click(function () {			
			gameController.toggleKeyOverlay();		
		});
		$('.clefBtn').click(function () {				
			var t = parseInt($(this).attr('value'));
			gameController.toggleClef(t);			
			$('#c').focus();
		});
		$('.accid_sel_Btn').click(function () {
			var t = $(this).attr('value');
			gameController.toggleAccidental(t);
			console.log("type: " + t);
			$('#c').focus();
		});
		$('.keysig_sel_Btn').click(function () {
			var $input = $(this);		
			var dir = parseInt($input.attr('value'));
			gameController.updateKeySignature(dir);
			$('#c').focus();
		});
		$('#session_start_button').click(function () {
			$('#session_frame').hide();		
			statusModel.setTimeout(false);
			$('#game_frame').show();		
			gameController.startGame("#status_timer");
		});		
		$('#session_end_button').click(function () {
			$('#session_frame').hide();
			gameController.displaySummary();
			$('#sum_continue_button').focus();
		});		
		$('#scores_button').click(function () {
			$('#session_frame').hide();
			gameController.processFinalScore();
		});		
		$('#sum_continue_button').click(function () {		
			$('#summary_frame').hide();
			$('#session_frame').hide();
			if (!statusModel.getTimeout() && statusModel.getMode() === statusModel.GAME_MODE)
			{
				gameController.startGame("#timer");
			}		
			if (statusModel.getTimeout())
			{
				gameController.updateLevel();
			}
			else
			{						
				$('#game_frame').show();
			}		
			$('#c').focus();
		});
		$('#sum_continue_button').keydown(function (event) {
			var code = event.keyCode;
			if (code === cfg.UP_KEY || code === cfg.DOWN_KEY) {
				$(this).blur();
				$('#quit_button').focus();
			}
		});
		$('#quit_button').click(function () {
			$('#summary_frame').hide();		
			if (statusModel.getMode() === cfg.GAME_MODE){
				gameController.processFinalScore();
				gameController.removeLivesDisplay();
				$('#score_display_frame').show();
			}
			else {
				$('#menu_frame').show();
				$('#practice_button').focus();
			}
		});
		$('#quit_button').keydown(function (event) {
			var code = event.keyCode;			
			if (code === cfg.UP_KEY || code === cfg.DOWN_KEY) {
				$('#sum_continue_button').focus();
			}
		});			
		$('#main_menu_button').click(function () {
			$('#score_display_frame').hide();
			$('#main_menu_button').hide();
			gameController.init();
			$('#menu_frame').show();
			$('#practice_button').focus();
		});
		$('button').hover(function () {
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({opacity: 0.90});
				}
		);
		$('.overlay').hover(function () {
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({opacity: 0.70});
				}
		);
		$('.black_key_Btn').hover(function () {
			$(this).css({'background-color': '#127'});
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({'background-color': '#000'});
				$(this).css({opacity: 1.0});
				}
		);
		$('.white_key_Btn').hover(function () {
			$(this).css({'background-color': '#66a'});
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({'background-color': '#fff'});
				$(this).css({opacity: 1.0});
				}
		);
		$('.black_key_Btn').mousedown(function () {
			$(this).css({'background-color': '#2f2'});
			$(this).css({opacity: 1.0});
			}
		);
		$('.white_key_Btn').mousedown(function () {
			$(this).css({'background-color': '#2f2'});
			$(this).css({opacity: 1.0});
			}
		);
		$('.black_key_Btn').mouseup(function () {
			$(this).css({'background-color': '#000'});
			$(this).css({opacity: 1.0});
			}
		);
		$('.white_key_Btn').mouseup(function () {
			$(this).css({'background-color': '#fff'});
			$(this).css({opacity: 1.0});
			}
		);
		$('.keysig_sel_Btn').hover(function () {
			$(this).css({opacity: 1.0});
			},
			function () {
				$(this).css({opacity: 0.95});
				}
		);
	}
});