
class VisualPolygon
{
	verticesAsPath;
	colorFill;
	colorBorder;

	verticesAsPathTransformed;
	transformTranslate;

	constructor(verticesAsPath, colorFill, colorBorder)
	{
		this.verticesAsPath = verticesAsPath;
		this.colorFill = colorFill;
		this.colorBorder = colorBorder;

		this.verticesAsPathTransformed = this.verticesAsPath.clone();
		this.transformTranslate = new Transform_Translate(new Coords(0, 0, 0));
	}

	draw(universe, world, display, entity)
	{
		var drawablePos = entity.locatable().loc.pos;
		this.transformTranslate.displacement.overwriteWith(drawablePos);

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transforms.applyTransformToCoordsMany
		(
			this.transformTranslate,
			this.verticesAsPathTransformed.points
		);

		display.drawPolygon
		(
			this.verticesAsPathTransformed.points,
			this.colorFill, this.colorBorder
		);
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

	// Transformable.

	transform(transformToApply)
	{
		return this; // todo
	}
}
