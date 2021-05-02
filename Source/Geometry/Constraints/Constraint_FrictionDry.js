

class Constraint_FrictionDry
{
	target;

	constructor(target)
	{
		this.target = target;
	}

	constrain(universe, world, place, entity)
	{
		var targetFrictionCoefficient = this.target;
		var frictionMagnitude = targetFrictionCoefficient;
		var entityLoc = entity.locatable().loc;
		var entityVel = entityLoc.vel;
		var entitySpeed = entityVel.magnitude();
		if (entitySpeed <= frictionMagnitude)
		{
			entityVel.clear();
		}
		else
		{
			var entityDirection = entityVel.clone().normalize();
			entityVel.add
			(
				entityDirection.multiplyScalar(-frictionMagnitude)
			);
		}
	}
}
