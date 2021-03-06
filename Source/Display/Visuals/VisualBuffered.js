

class VisualBuffered
{
	size;
	child;

	displayForBuffer;
	sizeHalf;

	_posSaved;

	constructor(size, child)
	{
		this.size = size;
		this.child = child;

		this.displayForBuffer = Display2D.fromSizeAndIsInvisible(this.size, true);
		this.sizeHalf = this.size.clone().half();

		this._posSaved = Coords.create();

		this.displayForBuffer.initialize(null);
	}

	draw(universe, world, place, entity, display)
	{
		var drawPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawPos);

		drawPos.overwriteWith(this.sizeHalf);
		this.child.draw(universe, world, place, entity, this.displayForBuffer);

		drawPos.overwriteWith(this._posSaved);
		drawPos.subtract(this.sizeHalf);
		display.drawImage(this.displayForBuffer.toImage(), drawPos);

		drawPos.overwriteWith(this._posSaved);
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
