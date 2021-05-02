

class Constraint_StopBelowSpeedMin
{
	target;

	constructor(target)
	{
		this.target = target;
	}

	constrain(universe, world, place, entity)
	{
		var targetSpeedMin = this.target;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var speed = entityVel.magnitude();
		if (speed < targetSpeedMin)
		{
			entityVel.clear();
		}
	}
}
