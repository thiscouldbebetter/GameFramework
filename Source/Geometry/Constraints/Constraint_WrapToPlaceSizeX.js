
class Constraint_WrapToPlaceSizeX
{
	constrain(universe, world, place, entity)
	{
		var placeSize = place.size;

		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
	}
}
