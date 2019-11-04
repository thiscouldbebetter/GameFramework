
function Location(pos, orientation, venue)
{
	this.pos = pos;

	if (orientation == null)
	{
		orientation = Orientation.Instances().ForwardXDownZ.clone();
	}
	this.orientation = orientation;

	this.venue = venue;

	this.vel = new Coords(0, 0, 0);
	this.accel = new Coords(0, 0, 0);
	this.force = new Coords(0, 0, 0);

	this.spin = new Rotation(this.orientation.down, new Reference(0));

	this.timeOffsetInTicks = 0;
}

{
	Location.prototype.velSet = function(value)
	{
		this.vel.overwriteWith(value);
		return this;
	}

	// cloneable

	Location.prototype.clone = function()
	{
		var returnValue = new Location
		(
			this.pos.clone(),
			this.orientation.clone(),
			this.venue
		);

		returnValue.vel = this.vel.clone();
		returnValue.accel = this.accel.clone();
		returnValue.force = this.force.clone();
		returnValue.timeOffsetInTicks = this.timeOffsetInTicks;

		return returnValue;
	};

	Location.prototype.overwriteWith = function(other)
	{
		this.venue = other.venue;
		this.pos.overwriteWith(other.pos);
		this.orientation.overwriteWith(other.orientation);
		this.vel.overwriteWith(other.vel);
		this.accel.overwriteWith(other.accel);
		this.force.overwriteWith(other.force);
		return this;
	};

	// strings

	Location.prototype.toString = function()
	{
		return this.pos.clone().round().toString();
	};
}
