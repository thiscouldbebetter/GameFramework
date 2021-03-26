

class Action
{
	name;
	perform;

	constructor
	(
		name,
		perform
	)
	{
		this.name = name;
		this.perform = perform;
	}

	performForUniverse(universe)
	{
		this.perform(universe, null, null, null);
	}

	static _instances;
	static Instances()
	{
		if (Action._instances == null)
		{
			Action._instances = new Action_Instances();
		}
		return Action._instances;
	}
}

class Action_Instances
{
	DoNothing;
	ShowMenu;

	constructor()
	{
		this.DoNothing = new Action
		(
			"DoNothing",
			(u, w, p, e) => 
			{
				// Do nothing.
			}
		);

		this.ShowMenu = new Action
		(
			"ShowMenu",
			(universe, world, place, actor) => // perform
			{
				var control = actor.controllable().toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent, true
				);
				var venueNext= control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}
