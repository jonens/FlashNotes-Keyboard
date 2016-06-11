/*
	A staff drawing area - built on the Raphael.js library.
*/

/* constructor */
StaffArea = function(x,y,w,h)
{	
	this.RECT_X = 150;
	this.RECT_Y = 100;
	this.RECT_W = 300;
	if(arguments.length > 0 ) this.init(x,y,w,h);
}

/* Not sure what this is - is it inheritance-related? */
StaffArea.prototype.init = function(x,y,w,h){	
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.paper = Raphael(this.x,this.y,this.width,this.height);
	this.attributes = 	{
		"stroke_width": 0.0,
		"fill": "beige",
		"stroke": "beige"		
	};
	this.bg_attributes = {
		"stroke_width": 0.0,
		"fill": "white",
		"stroke": "white"
	
	};	
}

StaffArea.prototype.ctx = function()
{	
	return this.paper;
}

StaffArea.prototype.setStrokeColor = function(color)
{
	this.attributes.stroke = color;
	return this;
}

StaffArea.prototype.setStrokeWidth = function(width)
{
	this.attributes.stroke_width = width;
	return this;
}

StaffArea.prototype.setFill = function(color)
{
	this.attributes.fill = color;
	return this;
}

StaffArea.prototype.fillRect = function(x,y,width,height)
{
	if (height < 0)
	{
		y += height;
		height = -height;
	}
	
	var rectangle = this.paper.rect(x, y, width, height).attr(this.attributes);
	return this;
}

/* Draw a staff on the StaffArea.  
	staff: a Staff object */
StaffArea.prototype.addStaff = function(staff)
{	
	return this.paper.path(staff.path());
}
