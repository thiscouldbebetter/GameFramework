

class Boundable extends EntityProperty
{
	bounds;

	constructor(bounds)
	{
		super();
		this.bounds = bounds;
	}

	updateForTimerTick(u, w, p, e)
	{
		this.bounds.locate(e.locatable().loc);
	}

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
