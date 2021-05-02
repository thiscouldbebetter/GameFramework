
class Constraint_WrapToPlaceSizeXTrimY
{
	constrain(universe, world, place, entity)
	{
		var placeSize = place.size;

		var entityLoc = entity.locatable().loc;
		var entityPos = entityLoc.pos;

		entityPos.x = NumberHelper.wrapToRangeMax(entityPos.x, placeSize.x);
		entityPos.y = NumberHelper.trimToRangeMax(entityPos.y, placeSize.y);
	}
}
