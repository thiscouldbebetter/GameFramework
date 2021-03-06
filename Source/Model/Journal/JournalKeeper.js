

class JournalKeeper
{
	journal;

	isJournalEntrySelectedEditable;
	journalEntrySelected;
	statusMessage;

	constructor(journal)
	{
		this.journal = journal;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}

	// Controls.

	toControl
	(
		universe, size, entityJournalKeeper,
		venuePrev, includeTitleAndDoneButton
	)
	{
		var world = universe.world;
		var journalKeeper = entityJournalKeeper.journalKeeper();

		this.statusMessage = "Read and edit journal entries.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = Coords.fromXY(200, 135);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var back = () =>
		{
			var venueNext= venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var buttonSize = Coords.fromXY(20, 10);

		var childControls=
		[
			new ControlLabel
			(
				"labelJournalEntries",
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				false, // isTextCentered
				"Journal Entries:",
				fontHeightSmall
			),

			new ControlButton
			(
				"buttonEntryNew",
				Coords.fromXY(65, 5), // pos
				Coords.fromXY(30, 8), // size
				"New",
				fontHeightSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c) => true
				), // isEnabled
				() =>
				{
					var journal = journalKeeper.journal;
					var entryNew = new JournalEntry
					(
						world.timerTicksSoFar,
						"-", // title
						"", // body
					);
					journal.entries.push(entryNew);
				}, // click
				null, // context
				false // canBeHeldDown
			),

			new ControlList
			(
				"listEntries",
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(85, 110), // size
				DataBinding.fromContext(this.journal.entries), // items
				DataBinding.fromGet
				(
					(c) => c.toString(universe)
				), // bindingForItemText
				fontHeightSmall,
				new DataBinding
				(
					this,
					(c) => c.journalEntrySelected,
					(c, v) =>
					{
						c.journalEntrySelected = v;
						c.isJournalEntrySelectedEditable = false;
					}
				), // bindingForItemSelected
				DataBinding.fromGet( (c) => c ), // bindingForItemValue
				DataBinding.fromTrue(), // isEnabled
				(universe) => // confirm
				{
					// todo
				},
				null
			),

			new ControlLabel
			(
				"labelEntrySelected",
				Coords.fromXY(105, 5), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCentered
				"Entry Selected:",
				fontHeightSmall
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				Coords.fromXY(146, 5), // pos
				Coords.fromXY(15, 8), // size
				"Lock",
				fontHeightSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable
					)
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = false;
				}, // click
				null, // context
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedEdit",
				Coords.fromXY(164, 5), // pos
				Coords.fromXY(15, 8), // size
				"Edit",
				fontHeightSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					(
						c.journalEntrySelected != null
						&& c.isJournalEntrySelectedEditable == false
					)
				), // isEnabled
				() =>
				{
					journalKeeper.isJournalEntrySelectedEditable = true;
				}, // click
				null, // context
				false, // canBeHeldDown
			),

			new ControlButton
			(
				"buttonEntrySelectedDelete",
				Coords.fromXY(182, 5), // pos
				Coords.fromXY(8, 8), // size
				"X",
				fontHeightSmall,
				true, // hasBorder,
				DataBinding.fromContextAndGet
				(
					this,
					(c) => (c.journalEntrySelected != null)
				), // isEnabled
				() =>
				{
					var controlConfirm = universe.controlBuilder.confirmAndReturnToVenue
					(
						universe,
						universe.display.sizeInPixels, // size
						"Are you sure you want to delete this entry?",
						universe.venueCurrent,
						() => // confirm
						{
							var journal = journalKeeper.journal;
							var entryToDelete = journalKeeper.journalEntrySelected;
							ArrayHelper.remove(journal.entries, entryToDelete);
							journalKeeper.journalEntrySelected = null;
						},
						null // cancel
					);

					var venueNext= controlConfirm.toVenue();
					venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
					universe.venueNext = venueNext;

				}, // click
				null, // context
				false // canBeHeldDown
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				Coords.fromXY(105, 15), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCentered
				DataBinding.fromContext("Time Recorded:"),
				fontHeightSmall
			),

			new ControlLabel
			(
				"labelEntrySelectedTimeRecorded",
				Coords.fromXY(145, 15), // pos
				Coords.fromXY(100, 15), // size
				false, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var entry = c.journalEntrySelected;
						return (entry == null ? "-" : entry.timeRecordedAsStringH_M_S(universe));
					}
				),
				fontHeightSmall
			),

			new ControlTextBox
			(
				"textTitle",
				Coords.fromXY(105, 25), // pos
				Coords.fromXY(85, 10), // size
				new DataBinding
				(
					this,
					(c) =>
					{
						var j = c.journalEntrySelected;
						return (j == null ? "" : j.title);
					},
					(c, v) =>
					{
						var journalEntry = c.journalEntrySelected;
						if (journalEntry != null)
						{
							journalEntry.title = v;
						}
					}
				), // text
				fontHeightSmall,
				32, // charCountMax
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
						(c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)
				) // isEnabled
			),

			new ControlTextarea
			(
				"textareaEntryBody",
				Coords.fromXY(105, 40), // pos
				Coords.fromXY(85, 70), // size
				new DataBinding
				(
					this,
					(c) =>
					{
						var j = c.journalEntrySelected;
						return (j == null ? "" : j.body);
					},
					(c, v) =>
					{
						var journalEntry = c.journalEntrySelected;
						if (journalEntry != null)
						{
							journalEntry.body = v;
						}
					}
				), // text
				fontHeightSmall,
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
						(c.journalEntrySelected != null && c.isJournalEntrySelectedEditable)
				) // isEnabled
			),

			new ControlLabel
			(
				"infoStatus",
				Coords.fromXY(150, 120), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						return c.statusMessage;
					}
				), // text
				fontHeightSmall
			)
		];

		var returnValue = new ControlContainer
		(
			"Notes",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			[
				new Action("Back", back),
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ),
			]
		);

		if (includeTitleAndDoneButton)
		{
			childControls.splice
			(
				0, // indexToInsertAt
				0,
				new ControlLabel
				(
					"labelTitle",
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Journal",
					fontHeightLarge
				)
			);
			childControls.push
			(
				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY(170, 115), // pos
					buttonSize.clone(),
					"Done",
					fontHeightSmall,
					true, // hasBorder
					true, // isEnabled
					back // click
				)
			);
			var titleHeight = Coords.fromXY(0, 15);
			sizeBase.add(titleHeight);
			returnValue.size.add(titleHeight);
			returnValue.shiftChildPositions(titleHeight);
		}

		var scaleMultiplier = size.clone().divide(sizeBase);
		returnValue.scalePosAndSize(scaleMultiplier);

		return returnValue;
	}

}
