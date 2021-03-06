

class VisualPolars
{
	polars;
	color;
	lineThickness;

	_polar;
	_fromPos;
	_toPos;

	constructor(polars, color, lineThickness)
	{
		this.polars = polars;
		this.color = color;
		this.lineThickness = (lineThickness == null ? 1 : lineThickness);

		// temps

		this._polar = new Polar(0, 0, 0);
		this._fromPos = Coords.create();
		this._toPos = Coords.create();
	}

	draw(universe, world, place, entity, display)
	{
		var drawableLoc = entity.locatable().loc;
		var drawablePos = drawableLoc.pos;
		var drawableHeadingInTurns = drawableLoc.orientation.forward.headingInTurns();

		var polar = this._polar;
		var fromPos = this._fromPos.overwriteWith(drawablePos);
		var toPos = this._toPos;

		for (var i = 0; i < this.polars.length; i++)
		{
			polar.overwriteWith(this.polars[i]);
			polar.azimuthInTurns =
				NumberHelper.wrapToRangeZeroOne(polar.azimuthInTurns +  drawableHeadingInTurns);
			polar.toCoords(toPos).add(fromPos);

			display.drawLine
			(
				fromPos, toPos, this.color, this.lineThickness
			);

			fromPos.overwriteWith(toPos);
		}
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
