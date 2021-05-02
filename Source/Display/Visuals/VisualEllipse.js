

class VisualEllipse
{
	semiaxisHorizontal;
	semiaxisVertical;
	rotationInTurns;
	colorFill;
	colorBorder;

	constructor
	(
		semiaxisHorizontal, semiaxisVertical,
		rotationInTurns, colorFill, colorBorder
	)
	{
		this.semiaxisHorizontal = semiaxisHorizontal;
		this.semiaxisVertical = semiaxisVertical;
		this.rotationInTurns = rotationInTurns || 0;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	static fromSemiaxesAndColorFill
	(
		semiaxisHorizontal, semiaxisVertical, colorFill
	)
	{
		return new VisualEllipse
		(
			semiaxisHorizontal, semiaxisVertical, null, colorFill, null
		)
	}

	draw
	(
		universe, world, place, entity,
		display
	)
	{
		var drawableLoc = entity.locatable().loc;
		var drawableOrientation = drawableLoc.orientation;
		var drawableRotationInTurns =
			drawableOrientation.forward.headingInTurns();
		display.drawEllipse
		(
			drawableLoc.pos,
			this.semiaxisHorizontal, this.semiaxisVertical,
			NumberHelper.wrapToRangeZeroOne
			(
				this.rotationInTurns + drawableRotationInTurns
			),
			this.colorFill,
			this.colorBorder
		);
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
