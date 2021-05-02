

class Constraint_Offset
{
	offset;

	constructor(offset)
	{
		this.offset = offset;
	}

	constrain(universe, world, place, entity)
	{
		entity.locatable().loc.pos.add(this.offset);
	}
}
