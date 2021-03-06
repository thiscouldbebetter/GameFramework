

class Ephemeral
{
	ticksToLive;
	expire;

	constructor(ticksToLive, expire)
	{
		this.ticksToLive = ticksToLive;
		this.expire = expire;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick
	(
		universe, world, place, entityEphemeral
	)
	{
		this.ticksToLive--;
		if (this.ticksToLive <= 0)
		{
			place.entitiesToRemove.push(entityEphemeral);
			if (this.expire != null)
			{
				this.expire(universe, world, place, entityEphemeral);
			}
		}
	}

	// cloneable

	clone()
	{
		return new Ephemeral(this.ticksToLive, this.expire);
	}
}
