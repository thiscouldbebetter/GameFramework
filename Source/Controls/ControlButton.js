

class ControlButton extends ControlBase
{
	text;
	hasBorder;
	_isEnabled;
	click;
	context;
	canBeHeldDown;

	_drawLoc;
	_sizeHalf;

	constructor
	(
		name,
		pos,
		size,
		text,
		fontHeightInPixels,
		hasBorder,
		isEnabled,
		click,
		context,
		canBeHeldDown
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this.text = text;
		this.hasBorder = hasBorder;
		this._isEnabled = isEnabled;
		this.click = click;
		this.context = context;
		this.canBeHeldDown = (canBeHeldDown == null ? false : canBeHeldDown);

		// Helper variables.
		this._drawLoc = Disposition.create();
		this._sizeHalf = Coords.create();
	}

	static from8
	(
		name,
		pos,
		size,
		text,
		fontHeightInPixels,
		hasBorder,
		isEnabled,
		click
	)
	{
		return new ControlButton
		(
			name, pos, size, text, fontHeightInPixels, hasBorder,
			isEnabled, click, null, null
		);
	}

	static from9
	(
		name,
		pos,
		size,
		text,
		fontHeightInPixels,
		hasBorder,
		isEnabled,
		click,
		context
	)
	{
		return new ControlButton
		(
			name, pos, size, text, fontHeightInPixels, hasBorder,
			isEnabled, click, context, null
		);
	}

	actionHandle(actionNameToHandle, universe)
	{
		if (actionNameToHandle == ControlActionNames.Instances().ControlConfirm)
		{
			this.click(this.context);
		}

		return (this.canBeHeldDown == false); // wasActionHandled
	}

	isEnabled()
	{
		return (this._isEnabled.get == null ? this._isEnabled : this._isEnabled.get() );
	}

	// events

	mouseClick(clickPos)
	{
		if (this.isEnabled())
		{
			this.click(this.context);
		}
		return (this.canBeHeldDown == false); // wasClickHandled
	}

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
	}

	// drawable

	draw(universe, display, drawLoc, style)
	{
		var drawPos = this._drawLoc.overwriteWith(drawLoc).pos;
		drawPos.add(this.pos);

		var isEnabled = this.isEnabled();
		var isHighlighted = this.isHighlighted && isEnabled;

		style = style || this.style(universe);
		var colorFill = style.colorFill;
		var colorBorder = style.colorBorder;

		if (this.hasBorder)
		{
			display.drawRectangle
			(
				drawPos, this.size,
				colorFill,
				colorBorder,
				isHighlighted // areColorsReversed
			);
		}

		drawPos.add(this._sizeHalf.overwriteWith(this.size).half());

		var colorText = (isEnabled ? colorBorder : style.colorDisabled);

		display.drawText
		(
			this.text,
			this.fontHeightInPixels,
			drawPos,
			colorText,
			colorFill,
			isHighlighted,
			true, // isCentered
			this.size.x // widthMaxInPixels
		);
	}
}
