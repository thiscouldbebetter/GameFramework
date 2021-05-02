

class Modellable
{
	model;

	constructor(model)
	{
		this.model = model;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick(universe, world, place, entity)
	{
		// Do nothing.
	}
}
