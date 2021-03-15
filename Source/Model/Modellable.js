

class Modellable extends EntityProperty
{
	model;

	constructor(model)
	{
		super();
		this.model = model;
	}

	updateForTimerTick(universe, world, place, entity)
	{
		// Do nothing.
	}
}
