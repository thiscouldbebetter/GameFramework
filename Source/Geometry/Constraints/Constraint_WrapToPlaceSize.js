

class Constraint_WrapToPlaceSize
{
	constrain(universe, world, place, entity)
	{
		var entityLoc = entity.locatable().loc;
		entityLoc.pos.wrapToRangeMax(place.size);
	}
}
