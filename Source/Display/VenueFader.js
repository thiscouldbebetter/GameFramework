

class VenueFader
{
	venuesToFadeFromAndTo;
	backgroundColor;
	millisecondsPerFade;

	timeFadeStarted;
	venueIndexCurrent;

	constructor
	(
		venueToFadeTo,
		venueToFadeFrom,
		backgroundColor,
		millisecondsPerFade
	)
	{
		this.venuesToFadeFromAndTo =
		[
			venueToFadeFrom, venueToFadeTo
		];

		this.millisecondsPerFade = (millisecondsPerFade == null ? 250 : millisecondsPerFade);

		if (venueToFadeFrom == venueToFadeTo)
		{
			this.venueIndexCurrent = 1;
			this.millisecondsPerFade *= 2;
		}
		else
		{
			this.venueIndexCurrent = 0;
		}

		this.backgroundColor =
			(backgroundColor == null ? Color.Instances().Black : backgroundColor);
	}

	static fromVenueTo(venueToFadeTo)
	{
		return new VenueFader(venueToFadeTo, null, null, null);
	}

	static fromVenuesToAndFrom(venueToFadeTo, venueToFadeFrom)
	{
		return new VenueFader(venueToFadeTo, venueToFadeFrom, null, null)
	}

	finalize(universe) {}

	initialize(universe)
	{
		var venueToFadeTo = this.venueToFadeTo();
		venueToFadeTo.initialize(universe);
	}

	updateForTimerTick(universe)
	{
		this.draw(universe);

		var now = new Date();

		if (this.timeFadeStarted == null)
		{
			this.timeFadeStarted = now;
		}

		var millisecondsSinceFadeStarted =
			now.getTime() - this.timeFadeStarted.getTime();

		var fractionOfFadeCompleted =
			millisecondsSinceFadeStarted
			/ this.millisecondsPerFade;

		var alphaOfFadeColor;

		if (this.venueIndexCurrent == 0)
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				this.venueIndexCurrent++;
				this.timeFadeStarted = null;

				var venueToFadeTo = this.venuesToFadeFromAndTo[1];
				if (venueToFadeTo.draw == null)
				{
					universe.venueNext = venueToFadeTo;
				}

			}
			alphaOfFadeColor = fractionOfFadeCompleted;
		}
		else // this.venueIndexCurrent == 1
		{
			if (fractionOfFadeCompleted > 1)
			{
				fractionOfFadeCompleted = 1;
				universe.venueNext = this.venueCurrent();
			}

			alphaOfFadeColor = 1 - fractionOfFadeCompleted;
		}

		alphaOfFadeColor *= alphaOfFadeColor;
		var fadeColor = this.backgroundColor.clone();
		fadeColor.alpha
		(
			alphaOfFadeColor * this.backgroundColor.alpha(null)
		);

		var display = universe.display;
		display.drawRectangle
		(
			Coords.create(),
			display.sizeDefault(), // Scaled automatically.
			fadeColor,
			null, null
		);
	}

	venueToFadeTo()
	{
		return this.venuesToFadeFromAndTo[1];
	}

	venueCurrent()
	{
		return this.venuesToFadeFromAndTo[this.venueIndexCurrent];
	}

	draw(universe)
	{
		var venueCurrent = this.venueCurrent();
		if (venueCurrent != null)
		{
			venueCurrent.draw(universe);
		}
	}
}
