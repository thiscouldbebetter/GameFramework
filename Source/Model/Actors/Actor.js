

class Actor
{
	activity;

	actions;

	constructor(activity)
	{
		this.activity = activity;
		this.actions = [];
	}

	static fromActivityDefnName(activityDefnName)
	{
		var activity = Activity.fromDefnName(activityDefnName);
		var returnValue = new Actor(activity);
		return returnValue;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick
	(
		universe, world, place, entity
	)
	{
		this.activity.perform(universe, world, place, entity);
	}
}
