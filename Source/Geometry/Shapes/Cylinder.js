
class Cylinder
{
	center;
	radius;
	length;

	lengthHalf;

	constructor(center, radius, length)
	{
		this.center = center;
		this.radius = radius;
		this.length = length;

		this.lengthHalf = this.length / 2;
	}
}
