
class VisualText
{
	_text;
	colorFill;
	colorBorder;
	heightInPixels;

	constructor(text, heightInPixels, colorFill, colorBorder)
	{
		this._text = text;
		this.heightInPixels = heightInPixels || 10;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;
	}

	draw(universe, world, place, entity, display)
	{
		var text = this.text(universe, world, display, entity);
		display.drawText
		(
			text,
			this.heightInPixels,
			entity.locatable().loc.pos,
			Color.systemColorGet(this.colorFill),
			Color.systemColorGet(this.colorBorder),
			false, // areColorsReversed
			true, // isCentered
			null // widthMaxInPixels
		);
	};

	text(universe, world, display, entity)
	{
		return this._text.get();
	};

	// Clonable.

	clone()
	{
		return this; // todo
	}

	overwriteWith(other)
	{
		return this; // todo
	}

	// transformable

	transform(transformToApply)
	{
		return this; // todo
	}
}
