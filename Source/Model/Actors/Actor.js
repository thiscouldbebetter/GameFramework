
class Actor extends EntityProperty
{
	activity;

	actions;

	constructor(activity)
	{
		super();
		this.activity = activity;
		this.actions = [];
	}

	updateForTimerTick(universe, world, place, entity)
	{
		this.activity.perform(universe, world, place, entity);
	}
}
