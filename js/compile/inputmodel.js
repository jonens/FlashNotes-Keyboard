/* This class controls the browser output for the button div */


//MOVE THIS TO THE GAMECONTROLLER
/* constructor */
InputModel = function()
{
	this.answer = -1;
}

/* @param string noteStr A value from "A" to "G" */
InputModel.prototype.setNoteAnswer = function(noteStr)
{
	var code = noteStr.charCodeAt(0);
	this.answer = $code - 65;
	return this;
}

InputModel.prototype.getNoteAnswer = function()
{
	return this.answer;
}