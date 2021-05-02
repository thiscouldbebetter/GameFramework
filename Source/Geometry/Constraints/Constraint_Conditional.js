

class Constraint_Conditional
{
	shouldChildApply;
	child;

	constructor(shouldChildApply, child)
	{
		this.shouldChildApply = shouldChildApply;
		this.child = child;
	}

	constrain(universe, world, place, entity)
	{
		var willChildApply = this.shouldChildApply(universe, world, place, entity);
		if (willChildApply)
		{
			this.child.constrain(universe, world, place, entity);
		}
	}
}
