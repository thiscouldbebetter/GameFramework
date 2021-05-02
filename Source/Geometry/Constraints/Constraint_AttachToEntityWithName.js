

class Constraint_AttachToEntityWithName
{
	targetEntityName;

	constructor(targetEntityName)
	{
		this.targetEntityName = targetEntityName;
	}

	constrain(universe, world, place, entityToConstrain)
	{
		var targetEntity = place.entityByName(this.targetEntityName);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}
