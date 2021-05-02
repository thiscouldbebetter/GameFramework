

class ShapeGroupAll
{
	shapes;

	constructor(shapes)
	{
		this.shapes = shapes;
	}

	// Clonable.

	clone()
	{
		return new ShapeGroupAll(ArrayHelper.clone(this.shapes));
	}

	overwriteWith(other)
	{
		ArrayHelper.overwriteWith(this.shapes, other.shapes);
		return this;
	}

	// ShapeBase.

	locate(loc)
	{
		throw("Not implemented!");
	}

	normalAtPos(posToCheck, normalOut)
	{
		throw("Not implemented!");
	}

	surfacePointNearPos(posToCheck, surfacePointOut)
	{
		throw("Not implemented!");
	}

	toBox(boxOut)
	{
		throw("Not implemented!");
	}

}
