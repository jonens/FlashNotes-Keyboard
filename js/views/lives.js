/* An object to display game "lives" */

/* constructor */
Lives = function (lives_id,w,h)
{	
	if(arguments.length > 0 ) this.init(lives_id, w, h);	
}

Lives.prototype.init = function (lives_id, w, h){
	this.attributes = 	{
		"stroke_width": 0.0,
		"fill": "#447",
		"stroke": "#eee"		
	};
	this.width = w;
	this.height = h;
	this.paper = Raphael(lives_id, this.width, this.height);
}
Lives.prototype.ctx = function (){	
	return this.paper;
}

Lives.prototype.setStrokeColor = function (color){
	this.attributes.stroke = color;
	return this;
}

Lives.prototype.setStrokeWidth = function (width){
	this.attributes.stroke_width = width;
	return this;
}

Lives.prototype.setFill = function (color){
	this.attributes.fill = color;
	return this;
}

Lives.prototype.fillRect = function (x, y, width, height){
	if (height < 0){
		y += height;
		height = -height;
	}	
	this.rectangle = this.paper.rect(x, y, width, height).attr(this.attributes);
	return this;
}

Lives.prototype.getRect = function (){
	return this.rectangle;
}