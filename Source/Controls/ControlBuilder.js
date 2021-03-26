

class ControlBuilder
{
	styles;
	stylesByName;
	venueTransitionalFromTo;

	buttonHeightBase;
	buttonHeightSmallBase;
	fontHeightInPixelsBase;
	sizeBase;

	_zeroes;
	_scaleMultiplier;

	constructor
	(
		styles,
		venueTransitionalFromTo
	)
	{
		this.styles = styles || ControlStyle.Instances()._All;
		this.venueTransitionalFromTo =
			venueTransitionalFromTo || ( (vFrom, vTo) => VenueFader.fromVenuesToAndFrom(vTo, vFrom) );

		this.stylesByName = ArrayHelper.addLookupsByName(this.styles);

		this.fontHeightInPixelsBase = 10;
		this.buttonHeightBase = this.fontHeightInPixelsBase * 2;
		this.buttonHeightSmallBase = this.fontHeightInPixelsBase * 1.5;
		this.sizeBase = new Coords(200, 150, 1);

		// Helper variables.

		this._zeroes = Coords.create();
		this._scaleMultiplier = Coords.create();
	}

	static default()
	{
		return new ControlBuilder(null, null);
	}

	styleByName(styleName)
	{
		return this.stylesByName.get(styleName);
	}

	styleDefault()
	{
		return this.styles[0];
	}

	// Controls.

	choice
	(
		universe, size, message,
		optionNames, optionFunctions,
		showMessageOnly
	)
	{
		size = size || universe.display.sizeDefault();
		showMessageOnly = showMessageOnly || false;

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);
		var fontHeight = this.fontHeightInPixelsBase;

		var numberOfLinesInMessageMinusOne = message.get().split("\n").length - 1;
		var labelSize = Coords.fromXY
		(
			200, fontHeight * numberOfLinesInMessageMinusOne
		);

		var numberOfOptions = optionNames.length;

		if (showMessageOnly && numberOfOptions == 1)
		{
			numberOfOptions = 0; // Is a single option really an option?
		}

		var labelPosYBase = (numberOfOptions > 0 ? 65 : 75); // hack

		var labelPos = Coords.fromXY
		(
			100, labelPosYBase - fontHeight * (numberOfLinesInMessageMinusOne / 4)
		);

		var labelMessage = new ControlLabel
		(
			"labelMessage",
			labelPos,
			labelSize,
			true, // isTextCentered
			message,
			fontHeight
		);

		var childControls= [ labelMessage ];

		if (showMessageOnly == false)
		{
			var buttonWidth = 55;
			var buttonSize = Coords.fromXY(buttonWidth, fontHeight * 2);
			var spaceBetweenButtons = 5;
			var buttonMarginLeftRight =
				(
					this.sizeBase.x
					- (buttonWidth * numberOfOptions)
					- (spaceBetweenButtons * (numberOfOptions - 1))
				) / 2;

			for (var i = 0; i < numberOfOptions; i++)
			{
				var button = ControlButton.from8
				(
					"buttonOption" + i,
					Coords.fromXY
					(
						buttonMarginLeftRight + i * (buttonWidth + spaceBetweenButtons),
						100
					), // pos
					buttonSize.clone(),
					optionNames[i],
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					optionFunctions[i]
				);

				childControls.push(button);
			}
		}

		var containerSizeScaled = size.clone().clearZ().divide(scaleMultiplier);
		var display = universe.display;
		var displaySize = display.sizeDefault().clone().clearZ().divide(scaleMultiplier);
		var containerPosScaled = displaySize.clone().subtract(containerSizeScaled).half();
		var actions = null;
		if (numberOfOptions <= 1)
		{
			var acknowledge = optionFunctions[0];
			var controlActionNames = ControlActionNames.Instances();
			actions =
			[
				new Action( controlActionNames.ControlCancel, acknowledge ),
				new Action( controlActionNames.ControlConfirm, acknowledge ),
			];
		}

		var returnValue= new ControlContainer
		(
			"containerChoice",
			containerPosScaled,
			containerSizeScaled,
			childControls,
			actions,
			null //?
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		if (showMessageOnly)
		{
			returnValue = new ControlContainerTransparent(returnValue);
		}

		return returnValue;
	}

	choiceList
	(
		universe, size, message,
		options, bindingForOptionText,
		buttonSelectText, select
	)
	{
		// todo - Variable sizes.

		var marginWidth = 10;
		var marginSize = Coords.fromXY(1, 1).multiplyScalar(marginWidth);
		var fontHeight = 20;
		var labelSize = Coords.fromXY(size.x - marginSize.x * 2, fontHeight);
		var buttonSize = Coords.fromXY(labelSize.x, fontHeight * 2);
		var listSize = Coords.fromXY
		(
			labelSize.x,
			size.y - labelSize.y - buttonSize.y - marginSize.y * 4
		);

		var listOptions = ControlList.from8
		(
			"listOptions",
			Coords.fromXY(marginSize.x, labelSize.y + marginSize.y * 2),
			listSize,
			options,
			bindingForOptionText,
			fontHeight,
			null, // bindingForItemSelected
			null // bindingForItemValue
		);

		var returnValue = ControlContainer.from4
		(
			"containerChoice",
			Coords.create(),
			size,
			[
				new ControlLabel
				(
					"labelMessage",
					Coords.fromXY(size.x / 2, marginSize.y + fontHeight / 2),
					labelSize,
					true, // isTextCentered
					message,
					fontHeight
				),

				listOptions,

				new ControlButton
				(
					"buttonSelect",
					Coords.fromXY(marginSize.x, size.y - marginSize.y - buttonSize.y),
					buttonSize,
					buttonSelectText,
					fontHeight,
					true, // hasBorder
					true, // isEnabled,
					() => // click
					{
						var itemSelected = listOptions.itemSelected(null);
						if (itemSelected != null)
						{
							select(universe, itemSelected);
						}
					},
					universe, // context
					false // canBeHeldDown
				),
			]
		);

		return returnValue;
	}

	confirm
	(
		universe, size, message,
		confirm, cancel
	)
	{
		return this.choice
		(
			universe, size, DataBinding.fromContext(message),
			["Confirm", "Cancel"], [confirm, cancel], null
		);
	}

	confirmAndReturnToVenue
	(
		universe, size, message,
		venuePrev, confirm, cancel
	)
	{
		var controlBuilder = this;

		var confirmThenReturnToVenuePrev = () =>
		{
			confirm();
			var venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venuePrev
			);
			universe.venueNext = venueNext;
		}

		var cancelThenReturnToVenuePrev = () =>
		{
			if (cancel != null)
			{
				cancel();
			}
			var venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venuePrev
			);
			universe.venueNext = venueNext;
		}

		return this.choice
		(
			universe, size, DataBinding.fromContext(message),
			["Confirm", "Cancel"],
			[confirmThenReturnToVenuePrev, cancelThenReturnToVenuePrev],
			null
		);
	}

	game(universe, size, venuePrev)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowHeight = buttonHeight + padding;
		var rowCount = 5;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = (this.sizeBase.y - buttonsAllHeight) / 2;

		var buttonSize = Coords.fromXY(60, buttonHeight);
		var posX = (this.sizeBase.x - buttonSize.x) / 2;

		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = () =>
		{
			var venueNext = venuePrev;
			venueNext = controlBuilder.venueTransitionalFromTo
			(
				 universe.venueCurrent, venueNext
			);
			universe.venueNext = venueNext;
		}

		var returnValue = new ControlContainer
		(
			"containerStorage",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				ControlButton.from8
				(
					"buttonSave",
					Coords.fromXY(posX, row0PosY), // pos
					buttonSize.clone(),
					"Save",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext= Profile.toControlSaveStateSave
						(
							universe, size, universe.venueCurrent
						).toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonLoad",
					Coords.fromXY(posX, row1PosY), // pos
					buttonSize.clone(),
					"Load",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext= Profile.toControlSaveStateLoad
						(
							universe, null, universe.venueCurrent
						).toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonAbout",
					Coords.fromXY(posX, row2PosY), // pos
					buttonSize.clone(),
					"About",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var venueNext= new VenueMessage
						(
							DataBinding.fromContext(universe.name + "\nv" + universe.version),
							() => // acknowledge
							{
								var venueNext = controlBuilder.venueTransitionalFromTo
								(
									null, venueCurrent
								);
								universe.venueNext = venueNext;
							},
							universe.venueCurrent, // venuePrev
							size,
							false
						);
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonQuit",
					Coords.fromXY(posX, row3PosY), // pos
					buttonSize.clone(),
					"Quit",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe,
							size,
							"Are you sure you want to quit?",
							() => // confirm
							{
								universe.reset();
								var venueNext=
									controlBuilder.title(universe, null).toVenue();
								venueNext = controlBuilder.venueTransitionalFromTo
								(
									universe.venueCurrent, venueNext
								);
								universe.venueNext = venueNext;
							},
							() => // cancel
							{
								var venueNext = venuePrev;
								venueNext = controlBuilder.venueTransitionalFromTo
								(
									universe.venueCurrent, venueNext
								);
								universe.venueNext = venueNext;
							}
						);

						var venueNext= controlConfirm.toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(posX, row4PosY), // pos
					buttonSize.clone(),
					"Back",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back // click
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	gameAndSettings1(universe)
	{
		return this.gameAndSettings(universe, null, null, null);
	}

	gameAndSettings
	(
		universe, size, venuePrev, includeResumeButton
	)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonWidth = 40;
		var buttonHeight = this.buttonHeightBase;
		var padding = 5;
		var rowCount = (includeResumeButton ? 3 : 2);
		var rowHeight = buttonHeight + padding;
		var buttonsAllHeight = rowCount * buttonHeight + (rowCount - 1) * padding;
		var margin = Coords.fromXY
		(
			(this.sizeBase.x - buttonWidth) / 2,
			(this.sizeBase.y - buttonsAllHeight) / 2
		);

		var row0PosY = margin.y;
		var row1PosY = row0PosY + rowHeight;
		var row2PosY = row1PosY + rowHeight;

		var returnValue = new ControlContainer
		(
			"Game",
			this._zeroes.clone(), // pos
			this.sizeBase.clone(),
			// children
			[
				ControlButton.from8
				(
					"buttonGame",
					Coords.fromXY(margin.x, row0PosY), // pos
					Coords.fromXY(buttonWidth, buttonHeight), // size
					"Game",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext=
							controlBuilder.game(universe, null, universe.venueCurrent).toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonSettings",
					Coords.fromXY(margin.x, row1PosY), // pos
					Coords.fromXY(buttonWidth, buttonHeight), // size
					"Settings",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext= controlBuilder.settings
						(
							universe, null, universe.venueCurrent
						).toVenue(),
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),
			],
			[], // actions
			[] // mappings
		);

		if (includeResumeButton)
		{
			var back = () =>
			{
				var venueNext= venuePrev;
				venueNext = controlBuilder.venueTransitionalFromTo
				(
					universe.venueCurrent, venueNext
				);
				universe.venueNext = venueNext;
			};

			var buttonResume = ControlButton.from8
			(
				"buttonResume",
				Coords.fromXY(margin.x, row2PosY), // pos
				Coords.fromXY(buttonWidth, buttonHeight), // size
				"Resume",
				fontHeight,
				true, // hasBorder
				true, // isEnabled
				back
			);

			returnValue.children.push(buttonResume);

			returnValue.actions.push(new Action("Back", back));

			returnValue._actionToInputsMappings.push
			(
				new ActionToInputsMapping( "Back", [ "Escape" ], true )
			);
		}

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	inputs (universe, size, venuePrev)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var world = universe.world;
		var placeCurrentDefnName = "Demo"; // hack
		var placeDefn = world.defn.placeDefnByName(placeCurrentDefnName);
		placeDefn.actionToInputsMappingsEdit();

		var returnValue = ControlContainer.from4
		(
			"containerGameControls",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelActions",
					Coords.fromXY(100, 15), // pos
					Coords.fromXY(100, 20), // size
					true, // isTextCentered
					"Actions:",
					fontHeight
				),

				ControlList.from8
				(
					"listActions",
					Coords.fromXY(50, 25), // pos
					Coords.fromXY(100, 40), // size
					DataBinding.fromContext(placeDefn.actionToInputsMappingsEdited), // items
					DataBinding.fromGet
					(
						(c) => { return c.actionName; }
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						placeDefn,
						(c) => c.actionToInputsMappingSelected,
						(c, v) => { c.actionToInputsMappingSelected = v; }
					), // bindingForItemSelected
					DataBinding.fromGet( (c) => c ) // bindingForItemValue
				),

				new ControlLabel
				(
					"labelInput",
					Coords.fromXY(100, 70), // pos
					Coords.fromXY(100, 15), // size
					true, // isTextCentered
					"Inputs:",
					fontHeight
				),

				new ControlLabel
				(
					"infoInput",
					Coords.fromXY(100, 80), // pos
					Coords.fromXY(200, 15), // size
					true, // isTextCentered
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c) => 
						{
							var i = c.actionToInputsMappingSelected;
							return (i == null ? "-" : i.inputNames.join(", "));
						}
					), // text
					fontHeight
				),

				ControlButton.from8
				(
					"buttonClear",
					Coords.fromXY(25, 90), // pos
					Coords.fromXY(45, 15), // size
					"Clear",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c) => { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							mappingSelected.inputNames.length = 0;
						}
					}
				),

				ControlButton.from8
				(
					"buttonAdd",
					Coords.fromXY(80, 90), // pos
					Coords.fromXY(45, 15), // size
					"Add",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c) => { return c.actionToInputsMappingSelected != null}
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var venueInputCapture = new VenueInputCapture
							(
								universe.venueCurrent,
								(inputCaptured) =>
								{
									var inputName = inputCaptured.name;
									mappingSelected.inputNames.push(inputName);
								}
							);
							universe.venueNext = venueInputCapture
						}
					}
				),

				ControlButton.from8
				(
					"buttonRestoreDefault",
					Coords.fromXY(135, 90), // pos
					Coords.fromXY(45, 15), // size
					"Default",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c) => (c.actionToInputsMappingSelected != null)
					), // isEnabled
					() => // click
					{
						var mappingSelected = placeDefn.actionToInputsMappingSelected;
						if (mappingSelected != null)
						{
							var mappingDefault = placeDefn.actionToInputsMappingsDefault.filter
							(
								(x) => (x.actionName == mappingSelected.actionName)
							)[0];
							mappingSelected.inputNames = mappingDefault.inputNames.slice();
						}
					}
				),

				ControlButton.from8
				(
					"buttonRestoreDefaultsAll",
					Coords.fromXY(50, 110), // pos
					Coords.fromXY(100, 15), // size
					"Default All",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() =>
					{
						var venueInputs = universe.venueCurrent;
						var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
						(
							universe,
							size,
							"Are you sure you want to restore defaults?",
							venueInputs,
							() => // confirm
							{
								placeDefn.actionToInputsMappingsRestoreDefaults();
							},
							null // cancel
						);
						var venueNext= controlConfirm.toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonCancel",
					Coords.fromXY(50, 130), // pos
					Coords.fromXY(45, 15), // size
					"Cancel",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext= venuePrev;
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonSave",
					Coords.fromXY(105, 130), // pos
					Coords.fromXY(45, 15), // size
					"Save",
					fontHeight,
					true, // hasBorder
					// isEnabled
					DataBinding.fromContextAndGet
					(
						placeDefn,
						(c) => 
						{
							var mappings = c.actionToInputsMappingsEdited;
							var doAnyActionsLackInputs = mappings.some
							(
								(x) => (x.inputNames.length == 0)
							);
							return (doAnyActionsLackInputs == false);
						}
					),
					() => // click
					{
						placeDefn.actionToInputsMappingsSave();
						var venueNext= venuePrev;
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				)
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	message
	(
		universe, size, message,
		acknowledge, showMessageOnly
	)
	{
		var optionNames = [];
		var optionFunctions = [];

		if (acknowledge != null)
		{
			optionNames.push("Acknowledge");
			optionFunctions.push(acknowledge);
		}

		return this.choice
		(
			universe, size, message, optionNames, optionFunctions, showMessageOnly
		);
	}

	opening(universe, size)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var start = () =>
		{
			var title = this.title(universe, size);

			var venueTitle = title.toVenue();

			universe.venueNext =
				controlBuilder.venueTransitionalFromTo(universe.venueCurrent, venueTitle);
		};

		var visual = new VisualGroup
		([
			new VisualImageScaled
			(
				new VisualImageFromLibrary("Opening"), size
			)
		]);

		var returnValue = new ControlContainer
		(
			"containerOpening",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlVisual
				(
					"imageOpening",
					this._zeroes.clone(),
					this.sizeBase.clone(), // size
					new DataBinding(visual, null, null),
					null, null // colors
				),

				ControlButton.from8
				(
					"buttonStart",
					Coords.fromXY(75, 120), // pos
					Coords.fromXY(50, fontHeight * 2), // size
					"Start",
					fontHeight * 2,
					false, // hasBorder
					true, // isEnabled
					start // click
				)
			], // end children

			[
				new Action( ControlActionNames.Instances().ControlCancel, start ),
				new Action( ControlActionNames.Instances().ControlConfirm, start )
			],

			null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	settings(universe, size, venuePrev)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var buttonHeight = this.buttonHeightBase;
		var margin = 15;
		var padding = 5;
		var labelPadding = 3;

		var rowHeight = buttonHeight + padding;
		var row0PosY = margin;
		var row1PosY = row0PosY + rowHeight / 2;
		var row2PosY = row1PosY + rowHeight;
		var row3PosY = row2PosY + rowHeight;
		var row4PosY = row3PosY + rowHeight;

		var back = () =>
		{
			var venueNext = venuePrev;
			venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venueNext
			);
			universe.venueNext = venueNext;
		};

		var returnValue = new ControlContainer
		(
			"containerSettings",
			this._zeroes, // pos
			this.sizeBase.clone(),
			// children
			[
				new ControlLabel
				(
					"labelMusicVolume",
					Coords.fromXY(30, row1PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCentered
					"Music:",
					fontHeight
				),

				new ControlSelect
				(
					"selectMusicVolume",
					Coords.fromXY(70, row1PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						(c) => { return c.musicVolume; },
						(c, v) => { c.musicVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					new DataBinding
					(
						null, (c) => c.value, null
					), // bindingForOptionValues,
					new DataBinding
					(
						null, (c) => { return c.text; }, null
					), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelSoundVolume",
					Coords.fromXY(105, row1PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCentered
					"Sound:",
					fontHeight
				),

				new ControlSelect
				(
					"selectSoundVolume",
					Coords.fromXY(140, row1PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					new DataBinding
					(
						universe.soundHelper,
						(c) => c.soundVolume,
						(c, v) => { c.soundVolume = v; }
					), // valueSelected
					SoundHelper.controlSelectOptionsVolume(), // options
					DataBinding.fromGet( (c) => c.value ), // bindingForOptionValues,
					DataBinding.fromGet( (c) => c.text ), // bindingForOptionText
					fontHeight
				),

				new ControlLabel
				(
					"labelDisplaySize",
					Coords.fromXY(30, row2PosY + labelPadding), // pos
					Coords.fromXY(75, buttonHeight), // size
					false, // isTextCentered
					"Display:",
					fontHeight
				),

				new ControlSelect
				(
					"selectDisplaySize",
					Coords.fromXY(70, row2PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					universe.display.sizeInPixels, // valueSelected
					// options
					universe.display.sizesAvailable,
					DataBinding.fromGet( (c) => c ), // bindingForOptionValues,
					DataBinding.fromGet( (c) => c.toStringXY() ), // bindingForOptionText
					fontHeight
				),

				ControlButton.from8
				(
					"buttonDisplaySizeChange",
					Coords.fromXY(140, row2PosY), // pos
					Coords.fromXY(30, buttonHeight), // size
					"Change",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueControls = universe.venueCurrent ;
						var controlRootAsContainer = venueControls.controlRoot ;
						var selectDisplaySize =
							controlRootAsContainer.childrenByName.get("selectDisplaySize") ;
						var displaySizeSpecified = selectDisplaySize.optionSelected();

						var display = universe.display ;
						var platformHelper = universe.platformHelper;
						platformHelper.platformableRemove(display);
						display.sizeInPixels = displaySizeSpecified;
						display.canvas = null; // hack
						display.initialize(universe);
						platformHelper.initialize(universe);

						var venueNext= universe.controlBuilder.settings
						(
							universe, null, universe.venueCurrent
						).toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonInputs",
					Coords.fromXY(70, row3PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					"Inputs",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueCurrent = universe.venueCurrent;
						var controlGameControls =
							universe.controlBuilder.inputs(universe, size, venueCurrent);
						var venueNext= controlGameControls.toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo(venueCurrent, venueNext);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(70, row4PosY), // pos
					Coords.fromXY(65, buttonHeight), // size
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back // click
				),
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ "Escape" ], true ) ],

		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	slideshow(universe, size, imageNamesAndMessagesForSlides, venueAfterSlideshow)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var controlsForSlides= [];

		for (var i = 0; i < imageNamesAndMessagesForSlides.length; i++)
		{
			var imageNameAndMessage = imageNamesAndMessagesForSlides[i];
			var imageName = imageNameAndMessage[0];
			var message = imageNameAndMessage[1];

			var containerSlide = ControlContainer.from4
			(
				"containerSlide_" + i,
				this._zeroes, // pos
				this.sizeBase.clone(), // size
				// children
				[
					new ControlVisual
					(
						"imageSlide",
						this._zeroes,
						this.sizeBase.clone(), // size
						new DataBinding
						(
							new VisualImageFromLibrary(imageName), null, null
						),
						null, null
					),

					new ControlLabel
					(
						"labelSlideText",
						Coords.fromXY(100, this.fontHeightInPixelsBase * 2), // pos
						this.sizeBase.clone(), // size
						true, // isTextCentered,
						message,
						this.fontHeightInPixelsBase * 2
					),

					ControlButton.from8
					(
						"buttonNext",
						Coords.fromXY(75, 120), // pos
						Coords.fromXY(50, 40), // size
						"Next",
						this.fontHeightInPixelsBase,
						false, // hasBorder
						true, // isEnabled
						function(slideIndexNext) // click
						{
							var venueNext;
							if (slideIndexNext < controlsForSlides.length)
							{
								var controlForSlideNext = controlsForSlides[slideIndexNext];
								venueNext = controlForSlideNext.toVenue();
							}
							else
							{
								venueNext = venueAfterSlideshow;
							}
							venueNext = controlBuilder.venueTransitionalFromTo
							(
								universe.venueCurrent, venueNext
							);
							universe.venueNext = venueNext;
						}.bind(this, i + 1)
					)
				],
			);

			containerSlide.scalePosAndSize(scaleMultiplier);

			controlsForSlides.push(containerSlide);
		}

		return controlsForSlides[0];
	}

	title(universe, size)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var start = () =>
		{
			var venueMessage = VenueMessage.fromText("Loading profiles...");

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var result = Profile.toControlProfileSelect(universe, null, universe.venueCurrent);
					return result;
				},
				(universe, result) => // done
				{
					var venueProfileSelect = result.toVenue();

					universe.venueNext = controlBuilder.venueTransitionalFromTo
					(
						universe.venueCurrent, venueProfileSelect
					);
				}
			);

			universe.venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venueTask
			);
		};

		var visual = new VisualGroup
		([
			new VisualImageScaled
			(
				new VisualImageFromLibrary("Title"), size
			)
		]);

		var soundNameMusic = "Music_Title";
		visual.children.push
		(
			new VisualSound(soundNameMusic, true) // isMusic
		);

		var returnValue = new ControlContainer
		(
			"containerTitle",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlVisual
				(
					"imageTitle",
					this._zeroes.clone(),
					this.sizeBase.clone(), // size
					new DataBinding(visual, null, null),
					null, null // colors
				),

				ControlButton.from8
				(
					"buttonStart",
					Coords.fromXY(75, 120), // pos
					Coords.fromXY(50, fontHeight * 2), // size
					"Start",
					fontHeight * 2,
					false, // hasBorder
					true, // isEnabled
					start // click
				)
			], // end children

			[
				new Action( ControlActionNames.Instances().ControlCancel, start ),
				new Action( ControlActionNames.Instances().ControlConfirm, start )
			],

			null
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldDetail(universe, size, venuePrev)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var world = universe.world;

		var dateCreated = world.dateCreated;
		var dateSaved = world.dateSaved;

		var returnValue = ControlContainer.from4
		(
			"containerWorldDetail",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					Coords.fromXY(100, 40), // pos
					Coords.fromXY(100, 20), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelWorldName",
					Coords.fromXY(100, 55), // pos
					Coords.fromXY(150, 25), // size
					true, // isTextCentered
					"World: " + world.name,
					fontHeight
				),
				new ControlLabel
				(
					"labelStartDate",
					Coords.fromXY(100, 70), // pos
					Coords.fromXY(150, 25), // size
					true, // isTextCentered
					"Started:" + dateCreated.toStringTimestamp(),
					fontHeight
				),
				new ControlLabel
				(
					"labelSavedDate",
					Coords.fromXY(100, 85), // pos
					Coords.fromXY(150, 25), // size
					true, // isTextCentered
					"Saved:" + (dateSaved == null ? "[never]" : dateSaved.toStringTimestamp()),
					fontHeight
				),

				ControlButton.from8
				(
					"buttonStart",
					Coords.fromXY(50, 100), // pos
					Coords.fromXY(100, this.buttonHeightBase), // size
					"Start",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var world = universe.world;
						var venueWorld = world.toVenue();
						var venueNext;
						if (world.dateSaved != null)
						{
							venueNext = venueWorld;
						}
						else
						{
							var textInstructions =
								universe.mediaLibrary.textStringGetByName("Instructions");
							var instructions = textInstructions.value;
							var controlInstructions = controlBuilder.message
							(
								universe,
								size,
								DataBinding.fromContext(instructions),
								() => // acknowledge
								{
									universe.venueNext = controlBuilder.venueTransitionalFromTo
									(
										universe.venueCurrent, venueWorld
									);
								},
								false
							);

							var venueInstructions =
								controlInstructions.toVenue();

							var venueMovie = new VenueVideo
							(
								"Movie", // videoName
								venueInstructions // fader implicit
							);

							venueNext = venueMovie;
						}

						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonBack",
					Coords.fromXY(10, 10), // pos
					Coords.fromXY(15, 15), // size
					"<",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueNext = venuePrev;
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);
						universe.venueNext = venueNext;
					}
				),

				ControlButton.from8
				(
					"buttonDelete",
					Coords.fromXY(180, 10), // pos
					Coords.fromXY(15, 15), // size
					"x",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var saveState = universe.profile.saveStateSelected();
						var saveStateName = saveState.name;

						var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
						(
							universe,
							size,
							"Delete save \""
								+ saveStateName
								+ "\"?",
							universe.venueCurrent,
							() => // confirm
							{
								var storageHelper = universe.storageHelper;

								var profile = universe.profile;

								var saveStates = profile.saveStates;
								ArrayHelper.remove(saveStates, saveState);
								storageHelper.save(profile.name, profile);

								universe.world = null;
								storageHelper.delete(saveStateName);
							},
							null // cancel
						);

						var venueNext= controlConfirm.toVenue();
						venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueNext
						);

						universe.venueNext = venueNext;
					}
				),
			] // end children
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

	worldLoad(universe, size)
	{
		var controlBuilder = this;

		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var scaleMultiplier =
			this._scaleMultiplier.overwriteWith(size).divide(this.sizeBase);

		var fontHeight = this.fontHeightInPixelsBase;

		var confirm = () =>
		{
			var storageHelper = universe.storageHelper;

			var messageAsDataBinding = DataBinding.fromContextAndGet
			(
				null, // Will be set below.
				(c) => "Loading game..."
			);

			var venueMessage = VenueMessage.fromMessage
			(
				messageAsDataBinding
			);

			var venueTask = new VenueTask
			(
				venueMessage,
				() => // perform
				{
					var profile = universe.profile;
					var saveStateSelected = profile.saveStateSelected;
					return storageHelper.load(saveStateSelected.name);
				},
				(universe, saveStateReloaded) => // done
				{
					universe.world = saveStateReloaded.world;
					var venueNext= universe.controlBuilder.worldLoad
					(
						universe, null
					).toVenue();
					venueNext = controlBuilder.venueTransitionalFromTo
					(
						universe.venueCurrent, venueNext
					);
					universe.venueNext = venueNext;
				}
			);

			messageAsDataBinding.contextSet(venueTask);

			universe.venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venueTask
			);
		};

		var cancel = () =>
		{
			var venueNext= controlBuilder.worldLoad(universe, null).toVenue();
			venueNext = controlBuilder.venueTransitionalFromTo
			(
				universe.venueCurrent, venueNext
			);
			universe.venueNext = venueNext;
		};

		var returnValue = ControlContainer.from4
		(
			"containerWorldLoad",
			this._zeroes, // pos
			this.sizeBase.clone(), // size
			// children
			[
				new ControlLabel
				(
					"labelProfileName",
					Coords.fromXY(100, 25), // pos
					Coords.fromXY(120, 25), // size
					true, // isTextCentered
					"Profile: " + universe.profile.name,
					fontHeight
				),

				new ControlLabel
				(
					"labelSelectASave",
					Coords.fromXY(100, 40), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Select a Save:",
					fontHeight
				),

				ControlList.from8
				(
					"listSaveStates",
					Coords.fromXY(30, 50), // pos
					Coords.fromXY(140, 50), // size
					new DataBinding
					(
						universe.profile,
						(c) => c.saveStates,
						null
					), // items
					DataBinding.fromGet( (c) => c.name ), // bindingForOptionText
					fontHeight,
					new DataBinding
					(
						universe.profile,
						(c) => c.saveStateSelected(),
						(c, v) => { c.saveStateNameSelected = v.name; }
					), // bindingForOptionSelected
					DataBinding.fromGet( (c) => c ), // value
				),

				ControlButton.from8
				(
					"buttonLoadFromServer",
					Coords.fromXY(30, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Load",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContext(true), // isEnabled
					() => // click
					{
						var controlConfirm = universe.controlBuilder.confirm
						(
							universe, size, "Abandon the current game?", 
							confirm, cancel
						);
						var venueConfirm = controlConfirm.toVenue();
						universe.venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueConfirm
						);
					}
				),

				ControlButton.from8
				(
					"buttonLoadFromFile",
					Coords.fromXY(80, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Load File",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueFileUpload = new VenueFileUpload(null, null);

						var controlMessageReadyToLoad = 
							universe.controlBuilder.message
							(
								universe,
								size,
								DataBinding.fromContext("Ready to load from file..."),
								() => // acknowledge
								{
									function callback(fileContentsAsString)
									{
										var worldAsStringCompressed = fileContentsAsString;
										var compressor = universe.storageHelper.compressor;
										var worldSerialized = compressor.decompressString(worldAsStringCompressed);
										var worldDeserialized = universe.serializer.deserialize(worldSerialized);
										universe.world = worldDeserialized;

										var venueNext= controlBuilder.game
										(
											universe, size, universe.venueCurrent
										).toVenue();
										venueNext = controlBuilder.venueTransitionalFromTo
										(
											universe.venueCurrent, venueNext
										);
										universe.venueNext = venueNext;
									}

									var inputFile = venueFileUpload.toDomElement().getElementsByTagName("input")[0];
									var fileToLoad = inputFile.files[0];
									new FileHelper().loadFileAsBinaryString
									(
										fileToLoad,
										callback,
										null // contextForCallback
									);
								},
								null
							);

						var venueMessageReadyToLoad = 
							controlMessageReadyToLoad.toVenue();

						var controlMessageCancelled = universe.controlBuilder.message
						(
							universe,
							size,
							DataBinding.fromContext("No file specified."),
							() => // acknowlege
							{
								var venueNext= controlBuilder.game
								(
									universe, size, universe.venueCurrent
								).toVenue();
								venueNext = controlBuilder.venueTransitionalFromTo
								(
									universe.venueCurrent, venueNext
								);
								universe.venueNext = venueNext;
							},
							false //?
						);

						var venueMessageCancelled = controlMessageCancelled.toVenue();

						venueFileUpload.venueNextIfFileSpecified = venueMessageReadyToLoad;
						venueFileUpload.venueNextIfCancelled = venueMessageCancelled;

						universe.venueNext = venueFileUpload;
					}
				),

				ControlButton.from8
				(
					"buttonReturn",
					Coords.fromXY(130, 105), // pos
					Coords.fromXY(40, this.buttonHeightBase), // size
					"Return",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					() => // click
					{
						var venueGame = controlBuilder.game
						(
							universe, size, universe.venueCurrent
						).toVenue();
						universe.venueNext = controlBuilder.venueTransitionalFromTo
						(
							universe.venueCurrent, venueGame
						);
					}
				),
			]
		);

		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}
}
