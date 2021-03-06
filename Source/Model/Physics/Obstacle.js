

class Obstacle
{
	collide(u, w, p, e, eOther)
	{
		var collisionHelper = u.collisionHelper;
		collisionHelper.collideEntitiesBounce(e, eOther);
		collisionHelper.collideEntitiesSeparate(eOther, e);
	}

	// Clonable.

	clone()
	{
		return this;
	}

	overwriteWith(other)
	{
		return this;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}
}
