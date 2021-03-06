

class ControlVisual extends ControlBase
{
	visual;
	colorBackground;
	colorBorder;

	_drawPos;
	_locatable;
	_locatableEntity;
	_sizeHalf;

	constructor(
		name, pos, size,
		visual, colorBackground,
		colorBorder
	)
	{
		super(name, pos, size, null);
		this.visual = visual;
		this.colorBackground = colorBackground;
		this.colorBorder = colorBorder;

		// Helper variables.
		this._drawPos = Coords.create();
		this._locatable = Locatable.fromPos(this._drawPos);
		this._locatableEntity = new Entity
		(
			"_drawableEntity",
			[
				this._locatable,
				Drawable.fromVisual(new VisualNone())
			]
		);
		this._sizeHalf = Coords.create();
	}

	static from4
	(
		name, pos, size, visual
	)
	{
		return new ControlVisual(name, pos, size, visual, null, null);
	}

	static from5
	(
		name, pos, size,
		visual, colorBackground
	)
	{
		return new ControlVisual(name, pos, size, visual, colorBackground, null);
	}

	actionHandle(actionName, universe)
	{
		return false;
	}

	isEnabled()
	{
		return false;
	}

	mouseClick(x)
	{
		return false;
	}

	scalePosAndSize(scaleFactors)
	{
		this.pos.multiply(scaleFactors);
		this.size.multiply(scaleFactors);
		this._sizeHalf.multiply(scaleFactors);
		return this;
	}

	// drawable

	draw(universe, display, drawLoc, style)
	{
		var visualToDraw = this.visual.get();
		if (visualToDraw != null)
		{
			var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);
			var style = style || this.style(universe);

			var colorFill = this.colorBackground || Color.Instances()._Transparent;
			var colorBorder = this.colorBorder || style.colorBorder;
			display.drawRectangle
			(
				drawPos, this.size,
				colorFill,
				colorBorder,
				null
			);

			var locatableEntity = this._locatableEntity;
			locatableEntity.locatable().loc.pos.overwriteWith(drawPos);
			drawPos.add(this._sizeHalf.overwriteWith(this.size).half());
			var world = universe.world;
			var place = (world == null ? null : world.placeCurrent);
			visualToDraw.draw(universe, world, place, locatableEntity, display);
		}
	}
}
