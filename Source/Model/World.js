
class World
{
	name;
	dateCreated;
	defn;
	places;
	placesByName;

	dateSaved;
	timerTicksSoFar;
	placeCurrent;
	placeNext;

	constructor(name, dateCreated, defn, places)
	{
		this.name = name;
		this.dateCreated = dateCreated;

		this.timerTicksSoFar = 0;

		this.defn = defn;

		this.places = places;
		this.placesByName = ArrayHelper.addLookupsByName(this.places);
		this.placeNext = this.places[0];
	}

	static default()
	{
		return new World
		(
			"name",
			DateTime.now(),
			WorldDefn.default(),
			[
				Place.default()
			] // places
		);
	}

	draw(universe)
	{
		if (this.placeCurrent != null)
		{
			this.placeCurrent.draw(universe, this, universe.display);
		}
	}

	initialize(universe)
	{
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(universe, this);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
		}

		if (this.placeCurrent != null)
		{
			this.placeCurrent.initialize(universe, this);
		}
	}

	timePlayingAsStringShort(universe)
	{
		return universe.timerHelper.ticksToStringH_M_S(this.timerTicksSoFar);
	}

	timePlayingAsStringLong(universe)
	{
		return universe.timerHelper.ticksToStringHours_Minutes_Seconds(this.timerTicksSoFar);
	}

	toVenue()
	{
		return new VenueWorld(this);
	}

	updateForTimerTick(universe)
	{
		if (this.placeNext != null)
		{
			if (this.placeCurrent != null)
			{
				this.placeCurrent.finalize(universe, this);
			}
			this.placeCurrent = this.placeNext;
			this.placeNext = null;
			this.placeCurrent.initialize(universe, this);
		}
		this.placeCurrent.updateForTimerTick(universe, this);
		this.timerTicksSoFar++;
	}

	// Controls.

	toControl(universe)
	{
		return this.placeCurrent.toControl(universe, this);
	}
}
