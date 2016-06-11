/* 
	Web Games Common Display Functions
*/

/* Display points, percent, and total score on Status Bar on Game Screen */
Games.Common.displayScore = function () {	
	statusView.displayPoints("#status_points", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayPercent("#status_percent", statusModel.getPoints(), 
		statusModel.getAttempts());
	statusView.displayScore("#status_score", statusModel.getScore());	
	statusView.displayLevel("#status_level", statusModel.getLevel());	
	statusView.displayHiScore("#hi_score", statusModel.getHiScore());
}

/* Display points, percent, and total score on Summary Screen*/
Games.Common.displaySummary = function () {	
	var time;
	$('#game_frame').hide();
	$('#staff_paper').hide();
	statusView.displayPoints("#point_summary", statusModel.getPoints(),
		statusModel.getAttempts());
	statusView.displayPercent("#percent_summary", statusModel.getPoints(),
		statusModel.getAttempts());
	statusView.displayScore("#score_summary", statusModel.getScore());
	$('#time_summary_row').hide();
	$('#score_summary_row').show();
	$('#level_summary_row').show();
	$('#lives_summary_row').show();
	$('#next_level_row').show();
	$('#level_summary').html("" + statusModel.getLevel());
	$('#lives_summary').html("" + statusModel.getLives());
	$('#summary_frame').show();	
}

Games.Common.removeLivesDisplay = function () {
	statusView.removeLivesDisplay();	
}

/* Display Game_Mode session alerts 
	@param boolean start Display "start_session" button if true, display 
		"end_session" button if false.  
	@param boolean over Display "game_end" if true		*/
Games.Common.displaySessionAlert = function (start, over, nextLevel) {
	$('#menu_frame').hide();
	$('#instructions_frame').hide();
	$('#summary_frame').hide();
	$('#game_frame').hide();
	$('#staff_paper').hide();
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
			$('#session_end_header').html("Good Job!");
			$('#bonus').html("BONUS PTS<br/>" + statusModel.getBonus());
		}
		else {
			$('#session_end_header').html("Same Level");
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

Games.Common.processFinalScore = function () {
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

Games.Common.displayFinalScore = function (success) {
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