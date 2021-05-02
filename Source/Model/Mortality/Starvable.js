

class Starvable
{
	satietyMax;
	satietyLostPerTick;
	_starve;

	satiety;

	constructor
	(
		satietyMax,
		satietyLostPerTick,
		starve
	)
	{
		this.satietyMax = satietyMax;
		this.satietyLostPerTick = satietyLostPerTick;
		this._starve = starve;

		this.satiety = this.satietyMax;
	}

	starve(u, w, p, e)
	{
		if (this._starve != null)
		{
			this._starve(u, w, p, e);
		}
	}

	satietyAdd(amountToAdd)
	{
		this.satiety += amountToAdd;
		this.satiety = NumberHelper.trimToRangeMax
		(
			this.satiety, this.satietyMax
		);
	}

	satietySubtract(amountToSubtract)
	{
		this.satietyAdd(0 - amountToSubtract);
	}

	isStarving()
	{
		return (this.satiety <= 0);
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick
	(
		universe, world, place, entityStarvable
	)
	{
		if (this.isStarving())
		{
			this.starve(universe, world, place, entityStarvable);
		}
		else
		{
			this.satiety -= this.satietyLostPerTick;
		}
	}

	// cloneable

	clone()
	{
		return new Starvable(this.satietyMax, this.satietyLostPerTick, this._starve);
	}
}
