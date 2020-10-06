
class VisualBar
{
	abbreviation;
	size;
	color;
	amountCurrent;
	amountThreshold;
	amountMax;
	fractionBelowWhichToShow;
	colorForBorderAsValueBreakGroup;
	text;

	_drawPos;
	_sizeCurrent;
	_sizeHalf

	constructor
	(
		abbreviation,
		size,
		color,
		amountCurrent,
		amountThreshold,
		amountMax,
		fractionBelowWhichToShow,
		colorForBorderAsValueBreakGroup,
		text
	)
	{
		this.abbreviation = abbreviation;
		this.size = size;
		this.color = color;
		this.amountCurrent = amountCurrent;
		this.amountThreshold = amountThreshold;
		this.amountMax = amountMax;
		this.fractionBelowWhichToShow = fractionBelowWhichToShow;
		this.colorForBorderAsValueBreakGroup = colorForBorderAsValueBreakGroup;
		this.text = text;

		this._drawPos = new Coords(0, 0, 0);
		this._sizeCurrent = this.size.clone();
		this._sizeHalf = this.size.clone().half();
	}

	draw(universe, world, place, entity, display)
	{
		var wasVisible = false;

		var pos = this._drawPos.overwriteWith(entity.locatable().loc.pos).subtract(this._sizeHalf);
		var _amountCurrent= this.amountCurrent.contextSet(entity).get() ;
		var _amountMax= this.amountMax.contextSet(entity).get() ;
		var fractionCurrent = _amountCurrent / _amountMax;

		var shouldShow =
		(
			this.fractionBelowWhichToShow == null
			|| fractionCurrent < this.fractionBelowWhichToShow
		);

		if (shouldShow)
		{
			wasVisible = true;

			var widthCurrent = fractionCurrent * this.size.x;
			this._sizeCurrent.x = widthCurrent;
			display.drawRectangle
			(
				pos, this._sizeCurrent, this.color.systemColor(), null, null
			);

			var colorForBorder= null;
			if (this.colorForBorderAsValueBreakGroup == null)
			{
				colorForBorder = Color.Instances().White;
			}
			else
			{
				colorForBorder =
					this.colorForBorderAsValueBreakGroup.valueAtPosition(fractionCurrent);
			}

			if (this.amountThreshold != null)
			{
				var thresholdFraction = this.amountThreshold.contextSet(entity).get() ;
				this._sizeCurrent.x = thresholdFraction * this.size.x;
				display.drawRectangle
				(
					this._sizeCurrent, // pos
					new Coords(1, this.size.y, 0), // size
					this.color.systemColor(), null, null
				)
			}

			display.drawRectangle
			(
				pos, this.size, null, colorForBorder.systemColor(), null
			);

			pos.add(this._sizeHalf);

			var text;
			if (this.text == null)
			{
				var remainingOverMax = Math.round(_amountCurrent) + "/" + _amountMax;
				text = (this.abbreviation == null ? "" : (this.abbreviation + ":")) + remainingOverMax;
			}
			else
			{
				text = this.text.get();
			}
			display.drawText
			(
				text,
				this.size.y, // fontHeightInPixels
				pos, 
				colorForBorder.systemColor(),
				"Black", // colorOutline,
				false, // areColorsReversed
				true, // isCentered
				null, // widthMaxInPixels
			);
		}

		return wasVisible;
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