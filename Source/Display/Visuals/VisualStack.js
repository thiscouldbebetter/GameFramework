

class VisualStack
{
	childSpacing;
	children;

	 _posSaved;

	constructor(childSpacing, children)
	{
		this.childSpacing = childSpacing;
		this.children = children;

		this._posSaved = Coords.create();
	}

	draw(universe, world, place, entity, display)
	{
		var drawPos = entity.locatable().loc.pos;
		this._posSaved.overwriteWith(drawPos);

		for (var i = 0; i < this.children.length; i++)
		{
			var child = this.children[i];
			var wasChildVisible =
				child.draw(universe, world, place, entity, display) ;
			if (wasChildVisible)
			{
				drawPos.add(this.childSpacing);
			}
		}

		drawPos.overwriteWith(this._posSaved);
	}

	// Clonable.

	clone()
	{
		return new VisualStack(this.childSpacing.clone(), ArrayHelper.clone(this.children));
	}

	overwriteWith(other)
	{
		var otherAsVisualStack = other ;
		this.childSpacing.overwriteWith(otherAsVisualStack.childSpacing);
		ArrayHelper.overwriteWith(this.children, otherAsVisualStack.children);
		return this;
	}

	// Transformable.

	transform(transformToApply)
	{
		this.children.forEach(x => transformToApply.transform(x));
		return this;
	}
}
