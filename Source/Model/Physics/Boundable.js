

class Boundable
{
	bounds;

	constructor(bounds)
	{
		this.bounds = bounds;
	}

	// EntityProperty.

	finalize(u, w, p, e){}

	initialize(u, w, p, e)
	{
		this.updateForTimerTick(u, w, p, e);
	}

	updateForTimerTick(u, w, p, e)
	{
		this.bounds.locate(e.locatable().loc);
	}

	// Clonable.

	clone()
	{
		return new Boundable(this.bounds.clone());
	}

	overwriteWith(other)
	{
		this.bounds.overwriteWith(other.bounds);
		return this;
	}
}
