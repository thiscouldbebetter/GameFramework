

class VisualImageScaledPartial
{
	visualImageToExtractFrom;
	regionToDrawAsBox;
	sizeToDraw;

	sizeToDrawHalf;

	_posSaved;

	constructor(visualImageToExtractFrom, regionToDrawAsBox, sizeToDraw)
	{
		this.visualImageToExtractFrom = visualImageToExtractFrom;
		this.regionToDrawAsBox = regionToDrawAsBox;
		this.sizeToDraw = sizeToDraw;

		this.sizeToDrawHalf = this.sizeToDraw.clone().half();
		this._posSaved = Coords.create();
	}

	draw(universe, world, place, entity, display)
	{
		var image = this.visualImageToExtractFrom.image(universe);
		var entityPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(entityPos);
		entityPos.subtract(this.sizeToDrawHalf);
		display.drawImagePartialScaled
		(
			image, entityPos, this.regionToDrawAsBox, this.sizeToDraw
		);
		entityPos.overwriteWith(this._posSaved);
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
