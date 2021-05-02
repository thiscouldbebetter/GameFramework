

class Universe
{
	name;
	version;
	timerHelper;
	display;
	mediaLibrary;
	controlStyle;
	_worldCreate;

	world;

	collisionHelper;
	controlBuilder;
	displayRecorder;
	entityBuilder;
	idHelper;
	inputHelper;
	platformHelper;
	randomizer;
	serializer;
	soundHelper;
	storageHelper;
	videoHelper;

	debuggingMode;
	profile;
	venueNext;
	venueCurrent;

	constructor
	(
		name,
		version,
		timerHelper,
		display,
		mediaLibrary,
		controlBuilder,
		worldCreate
	)
	{
		this.name = name;
		this.version = version;
		this.timerHelper = timerHelper;
		this.display = display;
		this.mediaLibrary = mediaLibrary;
		this.controlBuilder = controlBuilder;
		this._worldCreate = worldCreate;

		this.collisionHelper = new CollisionHelper();
		this.displayRecorder = new DisplayRecorder
		(
			1, // ticksPerFrame
			100, // bufferSizeInFrames - 5 seconds at 20 fps.
			true // isCircular
		);
		this.entityBuilder = new EntityBuilder();
		this.idHelper = IDHelper.Instance();
		this.platformHelper = new PlatformHelper();
		this.randomizer = new RandomizerSystem();
		this.serializer = new Serializer();

		this.venueNext = null;
	}

	// static methods

	static create
	(
		name,
		version,
		timerHelper,
		display,
		mediaLibrary,
		controlBuilder,
		worldCreate
	)
	{
		var returnValue = new Universe
		(
			name,
			version,
			timerHelper,
			display,
			mediaLibrary,
			controlBuilder,
			worldCreate
		);

		var debuggingMode =
			URLParser.fromWindow().queryStringParameters["debug"];
		returnValue.debuggingMode = debuggingMode;

		return returnValue;
	}

	static default()
	{
		var universe = Universe.create
		(
			"Default",
			"0.0.0", // version
			new TimerHelper(20),
			Display2D.fromSize
			(
				Coords.fromXY(200, 150)
			),
			MediaLibrary.default(),
			ControlBuilder.default(),
			() => World.default()
		);

		return universe;
	}

	// instance methods

	initialize(callback)
	{
		this.platformHelper.initialize(this);
		this.storageHelper = new StorageHelper
		(
			StringHelper.replaceAll(this.name, " ", "_") + "_",
			this.serializer,
			new CompressorLZW()
		);

		this.display.initialize(this);
		this.platformHelper.platformableAdd(this.display);

		this.soundHelper = new SoundHelper(this.mediaLibrary.sounds);
		this.videoHelper = new VideoHelper(this.mediaLibrary.videos);

		var venueControlsOpening= this.controlBuilder.opening
		(
			this, this.display.sizeInPixels,
		).toVenue();

		venueControlsOpening = VenueFader.fromVenuesToAndFrom
		(
			venueControlsOpening, venueControlsOpening
		);

		this.venueNext = venueControlsOpening;

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize(this);

		var universe = this;
		this.mediaLibrary.waitForItemsAllToLoad
		(
			() => callback(universe)
		);
	}

	reset()
	{
		// hack
		this.soundHelper.reset();
	}

	start()
	{
		this.timerHelper.initialize(this.updateForTimerTick.bind(this));
	}

	updateForTimerTick()
	{
		this.inputHelper.updateForTimerTick(this);

		if (this.venueNext != null)
		{
			if
			(
				this.venueCurrent != null
				&& this.venueCurrent.finalize != null
			)
			{
				this.venueCurrent.finalize(this);
			}

			this.venueCurrent = this.venueNext;
			this.venueNext = null;

			if (this.venueCurrent.initialize != null)
			{
				this.venueCurrent.initialize(this);
			}
		}
		this.venueCurrent.updateForTimerTick(this);

		this.displayRecorder.updateForTimerTick(this);
	}

	worldCreate()
	{
		return this._worldCreate(this);
	}
}
