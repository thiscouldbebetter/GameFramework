

class VisualControl
{
	controlRoot;

	_drawLoc;

	constructor(controlRoot)
	{
		this.controlRoot = controlRoot;

		// Helper variables.
		this._drawLoc = new Disposition(Coords.create(), null, null);
	}

	draw(universe, world, place, entity, display)
	{
		var display = universe.display;
		var drawLoc = this._drawLoc;
		drawLoc.pos.clear();
		this.controlRoot.draw(universe, display, drawLoc, null);
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
