

class Constraint_ContainInBox
{
	boxToContainWithin;

	constructor(boxToContainWithin)
	{
		this.boxToContainWithin = boxToContainWithin;
	}

	constrain(universe, world, place, entity)
	{
		this.boxToContainWithin.trimCoords(entity.locatable().loc.pos);
	}
}
