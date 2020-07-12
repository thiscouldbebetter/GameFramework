
class Gradient
{
	stops;

	constructor(stops)
	{
		this.stops = stops;
	}
}

class GradientStop
{
	position;
	color;

	constructor(position, color)
	{
		this.position = position;
		this.color = color;
	}
}
