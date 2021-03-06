

class ForceField
{
	accelerationToApply;
	velocityToApply;

	constructor(accelerationToApply, velocityToApply)
	{
		this.accelerationToApply = accelerationToApply;
		this.velocityToApply = velocityToApply;
	}

	applyToEntity(entityToApplyTo)
	{
		var entityLoc = entityToApplyTo.locatable().loc;

		if (this.accelerationToApply != null)
		{
			entityLoc.accel.add(this.accelerationToApply);
		}

		if (this.velocityToApply != null)
		{
			entityLoc.vel.overwriteWith(this.velocityToApply);
		}
	}

	// Clonable.

	clone()
	{
		return new ForceField
		(
			this.accelerationToApply == null ? null : this.accelerationToApply.clone(),
			this.velocityToApply = null ? null : this.velocityToApply.clone()
		);
	}

	overwriteWith(other)
	{
		if (this.accelerationToApply != null)
		{
			this.accelerationToApply.overwriteWith(other.accelerationToApply);
		}
		if (this.velocityToApply != null)
		{
			this.velocityToApply.overwriteWith(other.velocityToApply);
		}
		return this;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}
}
