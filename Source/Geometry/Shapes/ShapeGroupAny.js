

class ShapeGroupAny
{
	shapes;

	 _displacement;
	 _surfacePointForChild;

	constructor(shapes)
	{
		this.shapes = shapes;

		this._displacement = Coords.create();
		this._surfacePointForChild = Coords.create();
	}

	// Clonable.

	clone()
	{
		return new ShapeGroupAny(ArrayHelper.clone(this.shapes));
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
		var distanceMinSoFar = Number.POSITIVE_INFINITY;
		for (var i = 0; i < this.shapes.length; i++)
		{
			var shape = this.shapes[i];

			shape.surfacePointNearPos(posToCheck, this._surfacePointForChild);

			var distanceFromPosToCheck = this._displacement.overwriteWith
			(
				this._surfacePointForChild
			).subtract
			(
				posToCheck
			).magnitude();

			if (distanceFromPosToCheck < distanceMinSoFar)
			{
				distanceMinSoFar = distanceFromPosToCheck;
				surfacePointOut.overwriteWith(this._surfacePointForChild);
			}
		}

		return surfacePointOut;
	}

	toBox(boxOut){ throw("Not implemented!"); }
}
