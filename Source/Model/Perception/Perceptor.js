
class Perceptor extends EntityProperty
{
	sightThreshold;
	hearingThreshold;

	constructor(sightThreshold, hearingThreshold)
	{
		super();
		this.sightThreshold = sightThreshold;
		this.hearingThreshold = hearingThreshold;
	}
}
