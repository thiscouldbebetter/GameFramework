

class Constraint_OrientToward
{
	targetEntityName;

	constructor(targetEntityName)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe, world, place, entity)
	{
		var targetEntityName = this.targetEntityName;

		var constrainableLoc = entity.locatable().loc;
		var constrainablePos = constrainableLoc.pos;
		var constrainableOrientation = constrainableLoc.orientation;
		var constrainableForward = constrainableOrientation.forward;

		var target = place.entitiesByName.get(targetEntityName);
		var targetPos = target.locatable().loc.pos;

		constrainableForward.overwriteWith
		(
			targetPos
		).subtract
		(
			constrainablePos
		).normalize();

		constrainableOrientation.forwardSet(constrainableForward);
	}
}
