

class Constraint_AttachToEntityWithId
{
	targetEntityId

	constructor(targetEntityId)
	{
		this.targetEntityId = targetEntityId;
	}

	constrain
	(
		universe, world, place, entityToConstrain
	)
	{
		var targetEntity = place.entityById(this.targetEntityId);
		if (targetEntity != null)
		{
			var targetPos = targetEntity.locatable().loc.pos;
			entityToConstrain.locatable().loc.pos.overwriteWith(targetPos);
		}
	}
}
