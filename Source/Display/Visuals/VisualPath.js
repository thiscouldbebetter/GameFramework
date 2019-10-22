
function VisualPath(verticesAsPath, color, lineThickness)
{
	this.verticesAsPath = verticesAsPath;
	this.color = color;
	this.lineThickness = lineThickness;

	this.verticesAsPathTransformed = this.verticesAsPath.clone();
	this.transformTranslate = new Transform_Translate(new Coords());
}

{
	VisualPath.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var pos = drawable.loc.pos;
		this.transformTranslate.displacement.overwriteWith(drawable.loc.pos);

		this.verticesAsPathTransformed.overwriteWith
		(
			this.verticesAsPath
		);

		Transform.applyTransformToCoordsMany
		(
			this.transformTranslate,
			this.verticesAsPathTransformed.points
		);

		display.drawPath
		(
			this.verticesAsPathTransformed.points,
			this.color,
			this.lineThickness
		);
	};
}