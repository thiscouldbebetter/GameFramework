

class Constrainable
{
	constraints;

	 _constraintsByClassName;

	constructor(constraints)
	{
		this.constraints = constraints || [];
		this._constraintsByClassName =
			ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
	}

	static create()
	{
		return new Constrainable([]);
	}

	static fromConstraint(constraint)
	{
		return new Constrainable( [ constraint ] );
	}

	clear()
	{
		this.constraints.length = 0;
		return this;
	}

	constrain
	(
		universe, world, place, entity
	)
	{
		var constrainable = entity.constrainable();
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, entity);
		}
	}

	constraintAdd(constraintToAdd)
	{
		this.constraints.push(constraintToAdd);
		this._constraintsByClassName.set
		(
			constraintToAdd.constructor.name, constraintToAdd
		);
		return this;
	}

	constraintByClassName(constraintClassName)
	{
		return this._constraintsByClassName.get(constraintClassName);
	}

	// EntityProperty.

	finalize(u, w, p, e){}

	initialize
	(
		universe, world, place, entity
	)
	{
		this.updateForTimerTick(universe, world, place, entity);
	}

	updateForTimerTick
	(
		universe, world, place, entity
	)
	{
		this.constrain(universe, world, place, entity);
	}
}
