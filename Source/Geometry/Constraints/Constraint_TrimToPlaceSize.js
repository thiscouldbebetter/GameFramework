

class Constraint_TrimToPlaceSize
{
	constrain(universe, world, place, entity)
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.trimToRangeMax(place.size);
	}
}
