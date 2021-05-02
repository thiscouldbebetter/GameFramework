

class Movable
{
	accelerationPerTick;
	speedMax;
	_accelerate;

	constructor
	(
		accelerationPerTick,
		speedMax,
		accelerate
	)
	{
		this.accelerationPerTick = accelerationPerTick;
		this.speedMax = speedMax;
		this._accelerate = accelerate || this.accelerateForward;
	}

	static create()
	{
		return new Movable(null, null, null);
	}

	static fromAccelerationAndSpeedMax
	(
		accelerationPerTick, speedMax
	)
	{
		return new Movable(accelerationPerTick, speedMax, null)
	}

	accelerate
	(
		universe, world, place, entityMovable
	)
	{
		this._accelerate(universe, world, place, entityMovable, this.accelerationPerTick);
	}

	accelerateForward
	(
		universe, world, place, entityMovable,
		accelerationPerTick
	)
	{
		var entityLoc = entityMovable.locatable().loc;
		entityLoc.accel.overwriteWith
		(
			entityLoc.orientation.forward
		).multiplyScalar
		(
			entityMovable.movable().accelerationPerTick
		);
	}

	accelerateInDirection
	(
		universe, world, place, entity,
		directionToMove
	)
	{
		var entityLoc = entity.locatable().loc;
		var isEntityStandingOnGround =
			(entityLoc.pos.z >= 0 && entityLoc.vel.z >= 0);
		if (isEntityStandingOnGround)
		{
			entityLoc.orientation.forwardSet(directionToMove);
			entity.movable().accelerate(universe, world, place, entity);
		}
	}

	// Clonable.

	clone()
	{
		return this;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}

	// Actions.

	static actionAccelerateDown()
	{
		return new Action
		(
			"AccelerateDown",
			// perform
			(universe, world, place, actor) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().ZeroOneZero
				);
			}
		)
	}

	static actionAccelerateLeft()
	{
		return new Action
		(
			"AccelerateLeft",
			// perform
			(universe, world, place, actor) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().MinusOneZeroZero
				);
			}
		);
	}

	static actionAccelerateRight()
	{
		return new Action
		(
			"AccelerateRight",
			// perform
			(universe, world, place, actor) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().OneZeroZero
				);
			}
		);
	}

	static actionAccelerateUp()
	{
		return new Action
		(
			"AccelerateUp",
			// perform
			(universe, world, place, actor) =>
			{
				actor.movable().accelerateInDirection
				(
					universe, world, place, actor, Coords.Instances().ZeroMinusOneZero
				);
			}
		);
	}

}
