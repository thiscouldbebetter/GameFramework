

class Constrainable extends EntityProperty
{
	constraints;

	 _constraintsByClassName;

	constructor(constraints)
	{
		super();
		this.constraints = constraints;
		this._constraintsByClassName =
			ArrayHelper.addLookups(this.constraints, x => x.constructor.name);
	}

	static constrain(universe, world, place, entity)
	{
		var constrainable = entity.constrainable();
		var constraints = constrainable.constraints;
		for (var i = 0; i < constraints.length; i++)
		{
			var constraint = constraints[i];
			constraint.constrain(universe, world, place, entity);
		}
	}

	constraintByClassName(constraintClassName)
	{
		return this._constraintsByClassName.get(constraintClassName);
	}

	initialize(universe, world, place, entity)
	{
		this.updateForTimerTick(universe, world, place, entity);
	}

	updateForTimerTick(universe, world, place, entity)
	{
		Constrainable.constrain(universe, world, place, entity);
	}
}
