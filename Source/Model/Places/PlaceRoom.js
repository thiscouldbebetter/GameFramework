
class PlaceRoom extends Place
{
	randomizerSeed;

	constructor(name, defnName, size, entities, randomizerSeed)
	{
		super(name, defnName, size, entities);
		this.randomizerSeed = randomizerSeed;
	}
}
