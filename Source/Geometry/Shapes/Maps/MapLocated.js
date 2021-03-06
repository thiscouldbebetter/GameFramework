

class MapLocated
{
	map;
	loc;

	box;

	constructor(map, loc)
	{
		this.map = map;
		this.loc = loc;

		this.box = new Box(this.loc.pos, this.map.size);
	}

	// cloneable

	clone()
	{
		return new MapLocated(this.map, this.loc.clone());
	}

	overwriteWith(other)
	{
		this.loc.overwriteWith(other.loc);
		return this;
	}

	// translatable

	coordsGroupToTranslate()
	{
		return [ this.loc.pos ];
	}

	// Shape.

	locate(loc)
	{
		return ShapeHelper.Instance().applyLocationToShapeDefault(loc, this);
	}

	normalAtPos(posToCheck, normalOut)
	{
		return normalOut.overwriteWith(posToCheck).subtract(this.loc.pos).normalize();
	}

	surfacePointNearPos(posToCheck, surfacePointOut)
	{
		return surfacePointOut.overwriteWith(posToCheck); // todo
	}

	toBox(boxOut){ throw("Not implemented!"); }

	// Transformable.

	transform(transformToApply)
	{
		throw("Not implemented!");
	}
}
