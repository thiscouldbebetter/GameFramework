

class ShapeInverse
{
	shape;

	constructor(shape)
	{
		this.shape = shape;
	}

	// Clonable.

	clone()
	{
		return new ShapeInverse(this.shape.clone());
	}

	overwriteWith(other)
	{
		this.shape.overwriteWith(other.shape);
		return this;
	}

	// ShapeBase.

	locate(loc)
	{
		this.shape.locate(loc);
		return this;
	}

	normalAtPos(posToCheck, normalOut)
	{
		return this.shape.normalAtPos(posToCheck, normalOut).invert();
	}

	surfacePointNearPos(posToCheck, surfacePointOut)
	{
		return this.shape.surfacePointNearPos(posToCheck, surfacePointOut);
	}

	toBox(boxOut){ throw("Not implemented!"); }
}
