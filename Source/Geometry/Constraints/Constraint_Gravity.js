
class Constraint_Gravity
{
	accelerationPerTick;

	constructor(accelerationPerTick)
	{
		this.accelerationPerTick = accelerationPerTick;
	}

	constrain(universe, world, place, entity)
	{
		var loc = entity.locatable().loc;
		if (loc.pos.z < 0) // hack
		{
			loc.accel.add(this.accelerationPerTick);
		}
	}
}
