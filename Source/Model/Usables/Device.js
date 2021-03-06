

class Device
{
	name;
	_initialize;
	update;
	_use;

	tickLastUsed;
	ticksToCharge;

	constructor
	(
		name,
		ticksToCharge,
		initialize,
		update,
		use
	)
	{
		this.name = name;
		this.ticksToCharge = ticksToCharge;
		this._initialize = initialize;
		this.update = update;
		this.use = use;

		this.tickLastUsed = 0 - this.ticksToCharge;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}

	initialize(u, w, p, e)
	{
		if (this._initialize != null)
		{
			this._initialize(u, w, p, e);
		}
	}

	use(u, w, p, eUser, eDevice)
	{
		var tickCurrent = w.timerTicksSoFar;
		var ticksSinceUsed = tickCurrent - this.tickLastUsed;
		if (ticksSinceUsed >= this.ticksToCharge)
		{
			this.tickLastUsed = tickCurrent;
			this._use(u, w, p, eUser, eDevice);
		}
	}

	// clonable

	clone()
	{
		return new Device(this.name, this.ticksToCharge, this._initialize, this.update, this.use);
	}
}
