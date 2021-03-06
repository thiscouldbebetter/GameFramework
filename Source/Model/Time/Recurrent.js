

class Recurrent
{
	ticksPerRecurrence;
	timesToRecur;
	recur;

	timesRecurredSoFar;
	ticksUntilRecurrence;

	constructor(ticksPerRecurrence, timesToRecur, recur)
	{
		this.ticksPerRecurrence = ticksPerRecurrence;
		this.timesToRecur = timesToRecur;
		this.recur = recur;

		this.timesRecurredSoFar = 0;
		this.ticksUntilRecurrence = this.ticksPerRecurrence;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick(universe, world, place, entity)
	{
		if (this.timesRecurredSoFar < this.timesToRecur)
		{
			this.ticksUntilRecurrence--;
			if (this.ticksUntilRecurrence <= 0)
			{
				this.ticksUntilRecurrence = this.ticksPerRecurrence;
				this.timesRecurredSoFar++;
				this.recur(universe, world, place, entity);
			}
		}
	}

	// cloneable

	clone()
	{
		return new Recurrent(this.ticksPerRecurrence, this.timesToRecur, this.recur);
	}
}
