
class PlaceRoom extends Place
{
	randomizerSeed;

	constructor(name, defnName, size, entities, randomizerSeed)
	{
		super
		(
			name, defnName, size,
			ArrayHelper.addMany
			(
				[ CollisionTracker.fromSize(size).toEntity() ], // hack - Must come before collidables.
				entities
			)
		);
		this.randomizerSeed = randomizerSeed;
	}
}
