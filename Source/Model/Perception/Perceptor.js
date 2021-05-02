

class Perceptor
{
	sightThreshold;
	hearingThreshold;

	constructor(sightThreshold, hearingThreshold)
	{
		this.sightThreshold = sightThreshold;
		this.hearingThreshold = hearingThreshold;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}
}
