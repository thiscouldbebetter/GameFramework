

class Perceptible
{
	isHiding;
	visibility;
	audibility;

	_displacement;
	_isHidingPrev;

	constructor
	(
		isHiding,
		visibility,
		audibility
	)
	{
		this.isHiding = isHiding;
		this.visibility = visibility;
		this.audibility = audibility;

		this._displacement = Coords.create();
		this._isHidingPrev = null;
	}

	canBeSeen
	(
		u, w, p, entityPerceptible,
		entityPerceptor
	)
	{
		var perceptibleLoc = entityPerceptible.locatable().loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = entityPerceptor.locatable().loc;
		var perceptorPos = perceptorLoc.pos;
		var perceptorForward = perceptorLoc.orientation.forward;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var distanceForward = displacement.dotProduct(perceptorForward);
		var isInSight = false;
		if (distanceForward > 0)
		{
			var visibilityBase = entityPerceptible.perceptible().visibility
			(
				u, w, p, entityPerceptible
			);
			var visibilityAdjusted = visibilityBase / Math.abs(distance);
			var sightThreshold = entityPerceptor.perceptor().sightThreshold;
			isInSight = (visibilityAdjusted >= sightThreshold);
		}
		return isInSight;
	}

	canBeHeard
	(
		u, w, p, entityPerceptible,
		entityPerceptor
	)
	{
		var perceptibleLoc = entityPerceptible.locatable().loc;
		var perceptiblePos = perceptibleLoc.pos;
		var displacement = this._displacement;
		var perceptorLoc = entityPerceptor.locatable().loc;
		var perceptorPos = perceptorLoc.pos;
		displacement.overwriteWith(perceptiblePos).subtract(perceptorPos);
		var distance = displacement.magnitude();
		var audibilityBase = entityPerceptible.perceptible().audibility
		(
			u, w, p, entityPerceptible
		);
		var audibilityAdjusted = audibilityBase / (distance * distance);
		var hearingThreshold = entityPerceptor.perceptor().hearingThreshold;
		var isInHearing = (audibilityAdjusted >= hearingThreshold);
		return isInHearing;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick(u, w, p, entity)
	{
		if (this.isHiding != this._isHidingPrev)
		{
			this._isHidingPrev = this.isHiding;

			if (this.isHiding)
			{
				entity.drawable().isVisible = false;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = true;
				}
			}
			else
			{
				entity.drawable().isVisible = true;
				if (entity.usable() != null)
				{
					entity.usable().isDisabled = false;
				}
			}
		}
	}

	// Clonable.

	clone()
	{
		return new Perceptible(this.isHiding, this.visibility, this.audibility);
	}

	overwriteWith(other)
	{
		this.isHiding = other.isHiding;
		this.visibility = other.visibility;
		this.audibility = other.audibility;
		return this;
	}
}
