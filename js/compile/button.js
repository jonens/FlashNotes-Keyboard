/*
	A button for user input in FlashNotes.
*/

/* constructor */
Button = function(x,y,w,h,id,label)
{	
	if(arguments.length > 0 ) this.init(x,y,w,h,id);
}

Button.prototype.init = function(x,y,w,h,id)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.id = id;
	//this.imgString = "";
	this.label = "";
	this.path = "";
}

/*Create a string of parameters to use to create this button; makes it easy to
	change the image source without rewriting the coord/dim params.  */
Button.prototype.imgString = function(src)
{
	var sp = " ";
	this.imgString = "" + src + sp + this.x + sp + this.y + sp + this.w + sp + this.h;
	return this.imgString;
}

Button.prototype.clickHandler = function()
{
	//alert("button id " + this.id);
	return this.id;
}