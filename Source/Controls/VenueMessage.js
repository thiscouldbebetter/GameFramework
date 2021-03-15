

class VenueMessage
{
	messageToShow;
	acknowledge;
	venuePrev;
	_sizeInPixels;
	showMessageOnly;

	_venueInner;

	constructor
	(
		messageToShow, acknowledge, venuePrev,
		sizeInPixels, showMessageOnly
	)
	{
		this.messageToShow = messageToShow;
		this.acknowledge = acknowledge;
		this.venuePrev = venuePrev;
		this._sizeInPixels = sizeInPixels;
		this.showMessageOnly = showMessageOnly || false;
	}

	static fromText(message)
	{
		return new VenueMessage(new DataBinding(message, null, null), null, null, null, null);
	}

	// instance methods

	draw(universe)
	{
		this.venueInner(universe).draw(universe);
	}

	finalize(universe) {}

	initialize(universe) {}

	updateForTimerTick(universe)
	{
		this.venueInner(universe).updateForTimerTick(universe);
	}

	sizeInPixels(universe)
	{
		return (this._sizeInPixels == null ? universe.display.sizeInPixels : this._sizeInPixels);
	}

	venueInner(universe)
	{
		if (this._venueInner == null)
		{
			var sizeInPixels = this.sizeInPixels(universe);

			var controlMessage = universe.controlBuilder.message
			(
				universe,
				sizeInPixels,
				this.messageToShow,
				this.acknowledge,
				this.showMessageOnly
			);

			var venuesToLayer = [];

			if (this.venuePrev != null)
			{
				venuesToLayer.push(this.venuePrev);
			}

			venuesToLayer.push(new VenueControls(controlMessage, false));

			this._venueInner = new VenueLayered(venuesToLayer, null);
		}

		return this._venueInner;
	}
}
