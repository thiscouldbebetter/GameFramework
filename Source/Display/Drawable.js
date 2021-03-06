

class Drawable
{
	visual;
	isVisible;

	constructor(visual, isVisible)
	{
		this.visual = visual;
		this.isVisible = (isVisible == null ? true : isVisible);
	}

	static fromVisual(visual)
	{
		return new Drawable(visual, null);
	}

	updateForTimerTick(universe, world, place, entity)
	{
		if (this.isVisible)
		{
			this.visual.draw(universe, world, place, entity, universe.display);
		}
	}

	// cloneable

	clone()
	{
		return new Drawable(this.visual, this.isVisible);
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

}
