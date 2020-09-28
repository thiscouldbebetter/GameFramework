
class BoxRotated
{
	box;
	angleInTurns;

	constructor(box, angleInTurns)
	{
		this.box = box;
		this.angleInTurns = angleInTurns;
	}

	sphereSwept()
	{
		return new Sphere(this.box.center, this.box.sizeHalf.magnitude());
	}

	// ShapeBase.

	normalAtPos(posToCheck, normalOut)
	{
		// todo - Adapt or call Box.normalAtPos() instead.

		var plane = new Plane(new Coords(0, 0, 0), 0);
		var polar = new Polar(0, 1, 0);
		var box = this.box;
		var center = box.center;
		var sizeHalf = box.sizeHalf;
		var displacementToSurface = new Coords(0, 0, 0);
		var distanceMinSoFar = Number.POSITIVE_INFINITY;

		for (var d = 0; d < 2; d++)
		{
			polar.azimuthInTurns = this.angleInTurns + (d * .25);
			var dimensionHalf = sizeHalf.dimensionGet(d);

			for (var m = 0; m < 2; m++)
			{
				var directionToSurface = polar.toCoords(plane.normal);
				displacementToSurface.overwriteWith
				(
					directionToSurface
				).multiplyScalar
				(
					dimensionHalf
				);
				var pointOnSurface = displacementToSurface.add(center);
				plane.distanceFromOrigin = pointOnSurface.dotProduct(plane.normal);

				var distanceOfPosToCheckFromPlane = Math.abs
				(
					plane.distanceToPointAlongNormal(posToCheck)
				);
				if (distanceOfPosToCheckFromPlane < distanceMinSoFar)
				{
					distanceMinSoFar = distanceOfPosToCheckFromPlane;
					normalOut.overwriteWith(plane.normal);
				}

				polar.azimuthInTurns += .5;
				polar.azimuthInTurns = NumberHelper.wrapToRangeZeroOne(polar.azimuthInTurns);
			}
		}

		return normalOut;
	}

	surfacePointNearPos(posToCheck, surfacePointOut)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	// cloneable

	clone()
	{
		return new BoxRotated(this.box.clone(), this.angleInTurns);
	}

	overwriteWith(other)
	{
		this.box.overwriteWith(other.box);
		this.angleInTurns = other.angleInTurns;
		return this;
	}

	// transformable

	coordsGroupToTranslate()
	{
		return [ this.box.center ];
	}
}
