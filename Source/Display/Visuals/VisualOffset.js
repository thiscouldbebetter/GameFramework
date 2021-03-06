

class VisualOffset
{
	child;
	offset;

	_posSaved;

	constructor(child, offset)
	{
		this.child = child;
		this.offset = offset;

		// Helper variables.
		this._posSaved = Coords.create();
	}

	draw(universe, world, place, entity, display)
	{
		var drawablePos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawablePos);
		drawablePos.add(this.offset);
		this.child.draw(universe, world, place, entity, display);
		drawablePos.overwriteWith(this._posSaved);
	}

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other)
	{
		return this; // todo
	}

	// Transformable.

	transform(transformToApply)
	{
		return this; // todo
	}
}
