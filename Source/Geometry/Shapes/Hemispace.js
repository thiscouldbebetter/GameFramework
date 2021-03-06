

class Hemispace
{
	plane;

	_displacement;

	constructor(plane)
	{
		this.plane = plane;

		this._displacement = Coords.create();
	}

	containsPoint(pointToCheck)
	{
		var distanceOfPointAbovePlane =
			pointToCheck.dotProduct(this.plane.normal)
			- this.plane.distanceFromOrigin;
		var returnValue = (distanceOfPointAbovePlane <= 0);
		return returnValue;
	}

	trimCoords(coordsToTrim)
	{
		var distanceOfPointAbovePlane =
			this.plane.distanceToPointAlongNormal(coordsToTrim);
		var areCoordsOutsideHemispace = (distanceOfPointAbovePlane > 0);
		if (areCoordsOutsideHemispace)
		{
			var displacementToClosestPointOnPlane =
				this._displacement.overwriteWith
				(
					this.plane.normal
				).multiplyScalar
				(
					0 - distanceOfPointAbovePlane
				);
			coordsToTrim.add(displacementToClosestPointOnPlane);
		}
		return coordsToTrim;
	}

	// Clonable.

	clone()
	{
		return new Hemispace(this.plane.clone());
	}
	
	overwriteWith(other)
	{
		this.plane.overwriteWith(other.plane);
		return this;
	}

	// ShapeBase.

	locate(loc)
	{
		throw("Not implemented!");
	}

	normalAtPos(posToCheck, normalOut)
	{
		return this.plane.normal;
	}

	surfacePointNearPos(posToCheck, surfacePointOut)
	{
		return surfacePointOut.overwriteWith
		(
			this.plane.pointOnPlaneNearestPos(posToCheck)
		);
	}

	toBox(boxOut)
	{
		throw("Not implemented!");
	}

	// Transformable.

	transform(transformToApply)
	{
		this.plane.transform(transformToApply);
		return this;
	}
}
