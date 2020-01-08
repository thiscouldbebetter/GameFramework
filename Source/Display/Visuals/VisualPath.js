
function VisualPath(verticesAsPath, color, lineThickness, isClosed)
{
	this.verticesAsPath = verticesAsPath;
	this.color = color;
	this.lineThickness = lineThickness;
	this.isClosed = isClosed;

	this.verticesAsPathTransformed = this.verticesAsPath.clone();
	this.transformTranslate = new Transform_Translate(new Coords());
}

{
	VisualPath.prototype.draw = function(universe, world, display, drawable, entity)
	{
		var drawablePos = entity.Locatable.loc.pos;
		this.transformTranslate.displacement.overwriteWith(drawablePos);

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
			this.lineThickness,
			this.isClosed
		);
	};
}
