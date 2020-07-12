
class Action
{
	name;
	perform;

	constructor(name, perform)
	{
		this.name = name;
		this.perform = perform;
	}

	static _instances;
	static Instances()
	{
		if (Action._instances == null)
		{
			Action._instances = new Action_Instances();
		}
		return Action._instances;
	};

}

class Action_Instances
{
	DoNothing;
	ShowItems;
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

		this.ShowItems = new Action
		(
			"ShowItems",
			(universe, world, place, actor) => // perform
			{
				var control = actor.controllable().toControl
				(
					universe, universe.display.sizeInPixels, actor, universe.venueCurrent
				);
				var venueNext= new VenueControls(control);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		);

		this.ShowMenu = new Action
		(
			"ShowMenu",
			(universe, world, place, actor) => // perform
			{
				var venueNext= new VenueControls
				(
					universe.controlBuilder.gameAndSettings(universe, null)
				);
				venueNext = new VenueFader(venueNext, universe.venueCurrent, null, null);
				universe.venueNext = venueNext;
			}
		);
	}
}

