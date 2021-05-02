

class Damager
{
	damagePerHit;

	constructor(damagePerHit)
	{
		this.damagePerHit = damagePerHit;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}
}
