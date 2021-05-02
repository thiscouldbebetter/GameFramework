

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
	ShowMenuPlayer;
	ShowMenuSettings;

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

		this.ShowMenuPlayer = new Action
		(
			"ShowMenuPlayer",
			// perform
			(universe, world, place, actor) =>
			{
				var control = actor.controllable().toControl
				(
					universe, universe.display.sizeInPixels, actor,
					universe.venueCurrent, true
				);
				var venueNext= control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);

		this.ShowMenuSettings = new Action
		(
			"ShowMenuSettings",
			// perform
			(universe, world, place, actor) =>
			{
				var controlBuilder = universe.controlBuilder;
				var control = controlBuilder.gameAndSettings1(universe);
				var venueNext= control.toVenue();
				venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
				universe.venueNext = venueNext;
			}
		);
	}
}
