

class ItemHolder
{
	items;
	massMax;
	reachRadius;

	itemSelected;
	statusMessage;

	constructor
	(
		items, massMax, reachRadius
	)
	{
		this.items = [];
		this.massMax = massMax;
		this.reachRadius = reachRadius || 20;

		this.itemsAdd(items || []);
	}

	static create()
	{
		return new ItemHolder([], null, null);
	}

	static fromItems(items)
	{
		return new ItemHolder(items, null, null);
	}

	// Instance methods.

	clear()
	{
		this.items.length = 0;
		this.itemSelected = null;
		this.statusMessage = "";

		return this;
	}

	equipItemInNumberedSlot
	(
		universe, entityItemHolder, slotNumber
	)
	{
		var itemToEquip = this.itemSelected;
		if (itemToEquip != null)
		{
			var world = universe.world;
			var place = world.placeCurrent;
			var equipmentUser = entityItemHolder.equipmentUser();
			var socketName = "Item" + slotNumber;
			var includeSocketNameInMessage = true;
			var itemEntityToEquip = itemToEquip.toEntity();
			var message = equipmentUser.equipItemEntityInSocketWithName
			(
				universe, world, place, entityItemHolder, itemEntityToEquip,
				socketName, includeSocketNameInMessage
			);
			this.statusMessage = message;
		}
	}

	hasItem(itemToCheck)
	{
		return this.hasItemWithDefnNameAndQuantity
		(
			itemToCheck.defnName, itemToCheck.quantity
		);
	}

	hasItemWithDefnNameAndQuantity
	(
		defnName, quantityToCheck
	)
	{
		var itemExistingQuantity = this.itemQuantityByDefnName(defnName);
		var returnValue = (itemExistingQuantity >= quantityToCheck);
		return returnValue;
	}

	itemEntities()
	{
		return this.items.map(x => x.toEntity());
	}

	itemsAdd(itemsToAdd)
	{
		itemsToAdd.forEach( (x) => this.itemAdd(x));
	}

	itemsAllTransferTo(other)
	{
		this.itemsTransferTo(this.items, other);
	}

	itemsByDefnName(defnName)
	{
		return this.items.filter
		(
			x => x.defnName == defnName
		);
	}

	itemsTransferTo(itemsToTransfer, other)
	{
		if (itemsToTransfer == this.items)
		{
			// Create a new array to avoid modifying the one being looped through.
			itemsToTransfer = new Array();
			itemsToTransfer.push(...this.items);
		}

		for (var i = 0; i < itemsToTransfer.length; i++)
		{
			var item = itemsToTransfer[i];
			this.itemTransferTo(item, other);
		}
	}

	itemsWithDefnNameJoin(defnName)
	{
		var itemsMatching = this.items.filter
		(
			x => x.defnName == defnName
		);
		var itemJoined = itemsMatching[0];
		if (itemJoined != null)
		{
			for (var i = 1; i < itemsMatching.length; i++)
			{
				var itemToJoin = itemsMatching[i];
				itemJoined.quantity += itemToJoin.quantity;
				ArrayHelper.remove(this.items, itemToJoin);
			}
		}

		return itemJoined;
	}

	itemAdd(itemToAdd)
	{
		var itemDefnName = itemToAdd.defnName;
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting == null)
		{
			this.items.push(itemToAdd);
		}
		else
		{
			itemExisting.quantity += itemToAdd.quantity;
		}
	}

	itemEntityFindClosest
	(
		universe, world, place,
		entityItemHolder
	)
	{
		var entityItemsInPlace = place.items();
		var entityItemClosest = entityItemsInPlace.filter
		(
			x =>
				x.locatable().distanceFromEntity(entityItemHolder) < this.reachRadius
		).sort
		(
			(a, b) =>
				a.locatable().distanceFromEntity(entityItemHolder)
				- b.locatable().distanceFromEntity(entityItemHolder)
		)[0];

		return entityItemClosest;
	}

	itemCanPickUp
	(
		universe, world, place, itemToPickUp
	)
	{
		var massAlreadyHeld = this.massOfAllItems(world);
		var massOfItem = itemToPickUp.mass(world);
		var massAfterPickup = massAlreadyHeld + massOfItem;
		var canPickUp = (massAfterPickup <= this.massMax);
		return canPickUp;
	}

	itemEntityPickUp
	(
		universe, world, place,
		entityItemHolder, itemEntityToPickUp
	)
	{
		var itemToPickUp = itemEntityToPickUp.item();
		this.itemAdd(itemToPickUp);
		place.entitiesToRemove.push(itemEntityToPickUp);
	}

	itemRemove(itemToRemove)
	{
		var doesExist = this.items.indexOf(itemToRemove) >= 0;
		if (doesExist)
		{
			ArrayHelper.remove(this.items, itemToRemove);
		}
	}

	itemSplit(itemToSplit, quantityToSplit)
	{
		var itemSplitted = null;

		if (itemToSplit.quantity <= 1)
		{
			itemSplitted = itemToSplit;
		}
		else
		{
			quantityToSplit =
				quantityToSplit || Math.floor(itemToSplit.quantity / 2);
			if (quantityToSplit >= itemToSplit.quantity)
			{
				itemSplitted = itemToSplit;
			}
			else
			{
				itemToSplit.quantity -= quantityToSplit;

				itemSplitted = itemToSplit.clone();
				itemSplitted.quantity = quantityToSplit;
				// Add with no join.
				ArrayHelper.insertElementAfterOther
				(
					this.items, itemSplitted, itemToSplit
				);
			}
		}

		return itemSplitted;
	}

	itemTransferTo(item, other)
	{
		other.itemAdd(item);
		ArrayHelper.remove(this.items, item);
		if (this.itemSelected == item)
		{
			this.itemSelected = null;
		}
	}

	itemTransferSingleTo(item, other)
	{
		var itemSingle = this.itemSplit(item, 1);
		this.itemTransferTo(itemSingle, other);
	}

	itemQuantityByDefnName(defnName)
	{
		return this.itemsByDefnName(defnName).map
		(
			y => y.quantity
		).reduce
		(
			(a,b) => a + b, 0
		);
	}

	itemSubtract(itemToSubtract)
	{
		this.itemSubtractDefnNameAndQuantity
		(
			itemToSubtract.defnName, itemToSubtract.quantity
		);
	}

	itemSubtractDefnNameAndQuantity
	(
		itemDefnName, quantityToSubtract
	)
	{
		this.itemsWithDefnNameJoin(itemDefnName);
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting != null)
		{
			itemExisting.quantity -= quantityToSubtract;
			if (itemExisting.quantity <= 0)
			{
				var itemExisting = this.itemsByDefnName(itemDefnName)[0];
				ArrayHelper.remove(this.items, itemExisting);
			}
		}
	}

	/*
	itemTransferTo2(itemToTransfer, other)
	{
		var itemDefnName = itemToTransfer.defnName;
		this.itemsWithDefnNameJoin(itemDefnName);
		var itemExisting = this.itemsByDefnName(itemDefnName)[0];
		if (itemExisting != null)
		{
			var itemToTransfer =
				this.itemSplit(itemExisting, itemToTransfer.quantity);
			other.itemAdd(itemToTransfer.clone());
			this.itemSubtract(itemToTransfer);
		}
	}
	*/

	itemsByDefnName2(defnName)
	{
		return this.itemsByDefnName(defnName);
	}

	massOfAllItems(world)
	{
		var massTotal = this.items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.mass(world),
			0 // sumSoFar
		);

		return massTotal;
	}

	massOfAllItemsOverMax(world)
	{
		return "" + Math.ceil(this.massOfAllItems(world)) + "/" + this.massMax;
	}

	tradeValueOfAllItems(world)
	{
		var tradeValueTotal = this.items.reduce
		(
			(sumSoFar, item) => sumSoFar + item.tradeValue(world),
			0 // sumSoFar
		);

		return tradeValueTotal;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}

	// Controllable.

	toControl
	(
		universe, size, entityItemHolder,
		venuePrev, includeTitleAndDoneButton
	)
	{
		this.statusMessage = "Use, drop, and sort items.";

		if (size == null)
		{
			size = universe.display.sizeDefault().clone();
		}

		var sizeBase = Coords.fromXY(200, 135);

		var fontHeight = 10;
		var fontHeightSmall = fontHeight * .6;
		var fontHeightLarge = fontHeight * 1.5;

		var itemHolder = this;
		var world = universe.world;

		var back = () =>
		{
			var venueNext= venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var drop = () =>
		{
			var itemEntityToKeep = itemHolder.itemSelected.toEntity();
			if (itemEntityToKeep != null)
			{
				var world = universe.world;
				var place = world.placeCurrent;
				var itemEntityToDrop = itemEntityToKeep.clone();
				var itemToDrop = itemEntityToDrop.item();
				itemToDrop.quantity = 1;
				var itemToDropDefn = itemToDrop.defn(world);
				var itemLocatable = itemEntityToDrop.locatable();
				if (itemLocatable == null)
				{
					itemLocatable = Locatable.create();
					itemEntityToDrop.propertyAddForPlace(itemLocatable, place);
					itemEntityToDrop.propertyAddForPlace
					(
						Drawable.fromVisual(itemToDropDefn.visual), place
					);
					// todo - Other properties, etc.
				}
				var posToDropAt = itemLocatable.loc.pos;
				var holderPos = entityItemHolder.locatable().loc.pos;
				posToDropAt.overwriteWith(holderPos);
				var collidable = itemEntityToDrop.collidable();
				if (collidable != null)
				{
					collidable.ticksUntilCanCollide = collidable.ticksToWaitBetweenCollisions;
				}
				place.entitySpawn(universe, world, itemEntityToDrop);
				itemHolder.itemSubtract(itemToDrop);
				if (itemEntityToKeep.item().quantity == 0)
				{
					itemHolder.itemSelected = null;
				}
				itemHolder.statusMessage = itemToDropDefn.appearance + " dropped."
				var equipmentUser = entityItemHolder.equipmentUser();
				if (equipmentUser != null)
				{
					equipmentUser.unequipItemEntity(itemEntityToKeep);
				}
			}
		};

		var use = () =>
		{
			var itemEntityToUse = itemHolder.itemSelected.toEntity();
			if (itemEntityToUse != null)
			{
				var itemToUse = itemEntityToUse.item();
				if (itemToUse.use != null)
				{
					var world = universe.world;
					var place = world.placeCurrent;
					var user = entityItemHolder;
					itemHolder.statusMessage =
						itemToUse.use(universe, world, place, user, itemEntityToUse);
					if (itemToUse.quantity <= 0)
					{
						itemHolder.itemSelected = null;
					}
				}
			}
		};

		var up = () =>
		{
			var itemToMove = itemHolder.itemSelected;
			var itemsAll = itemHolder.items;
			var index = itemsAll.indexOf(itemToMove);
			if (index > 0)
			{
				itemsAll.splice(index, 1);
				itemsAll.splice(index - 1, 0, itemToMove);
			}
		};

		var down = () =>
		{
			var itemToMove = itemHolder.itemSelected;
			var itemsAll = itemHolder.items;
			var index = itemsAll.indexOf(itemToMove);
			if (index < itemsAll.length - 1)
			{
				itemsAll.splice(index, 1);
				itemsAll.splice(index + 1, 0, itemToMove);
			}
		};

		var split = (universe) =>
		{
			itemHolder.itemSplit(itemHolder.itemSelected, null);
		};

		var join = () =>
		{
			var itemToJoin = itemHolder.itemSelected;
			var itemJoined =
				itemHolder.itemsWithDefnNameJoin(itemToJoin.defnName);
			itemHolder.itemSelected = itemJoined;
		};

		var sort = () =>
		{
			itemHolder.items.sort
			(
				(x, y) => (x.defnName > y.defnName ? 1 : -1)
			);
		};

		var buttonSize = Coords.fromXY(20, 10);
		var visualNone = new VisualNone();

		var childControls =
		[
			new ControlLabel
			(
				"labelItemsHeld",
				Coords.fromXY(10, 5), // pos
				Coords.fromXY(70, 25), // size
				false, // isTextCentered
				"Items Held:",
				fontHeightSmall
			),

			ControlList.from10
			(
				"listItems",
				Coords.fromXY(10, 15), // pos
				Coords.fromXY(70, 100), // size
				DataBinding.fromContext(this.items), // items
				DataBinding.fromGet
				(
					(c) => c.toString(world)
				), // bindingForItemText
				fontHeightSmall,
				new DataBinding
				(
					this,
					(c) => c.itemSelected,
					(c, v) => c.itemSelected = v
				), // bindingForItemSelected
				DataBinding.fromGet( (c) => c ), // bindingForItemValue
				DataBinding.fromTrue(), // isEnabled
				use
			),

			new ControlLabel
			(
				"infoWeight",
				Coords.fromXY(10, 115), // pos
				Coords.fromXY(100, 25), // size
				false, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c) => "Weight: " + c.massOfAllItemsOverMax(world)
				),
				fontHeightSmall
			),

			ControlButton.from8
			(
				"buttonUp",
				Coords.fromXY(85, 15), // pos
				Coords.fromXY(15, 10), // size
				"Up",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var returnValue =
						(
							c.itemSelected != null
							&& c.items.indexOf(c.itemSelected) > 0
						);
						return returnValue;
					}
				), // isEnabled
				up // click
			),

			ControlButton.from8
			(
				"buttonDown",
				Coords.fromXY(85, 30), // pos
				Coords.fromXY(15, 10), // size
				"Down",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var returnValue =
						(
							c.itemSelected != null
							&& c.items.indexOf(c.itemSelected) < c.items.length - 1
						);
						return returnValue;
					}
				), // isEnabled
				down
			),

			ControlButton.from8
			(
				"buttonSplit",
				Coords.fromXY(85, 45), // pos
				Coords.fromXY(15, 10), // size
				"Split",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var item = c.itemSelected;
						var returnValue =
						(
							item != null
							&& (item.quantity > 1)
						);
						return returnValue;
					}
				), // isEnabled
				split
			),

			ControlButton.from8
			(
				"buttonJoin",
				Coords.fromXY(85, 60), // pos
				Coords.fromXY(15, 10), // size
				"Join",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
						c.itemSelected != null
						&&
						(
							c.items.filter
							(
								(x) => x.defnName == c.itemSelected.defnName
							).length > 1
						)
				), // isEnabled
				join
			),

			ControlButton.from8
			(
				"buttonSort",
				Coords.fromXY(85, 75), // pos
				Coords.fromXY(15, 10), // size
				"Sort",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) => (c.itemEntities.length > 1)
				), // isEnabled
				sort
			),

			new ControlLabel
			(
				"labelItemSelected",
				Coords.fromXY(150, 10), // pos
				Coords.fromXY(100, 15), // size
				true, // isTextCentered
				"Item Selected:",
				fontHeightSmall
			),

			new ControlLabel
			(
				"infoItemSelected",
				Coords.fromXY(150, 20), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var i = c.itemSelected;
						return (i == null ? "-" : i.toString(world));
					}
				), // text
				fontHeightSmall
			),

			ControlVisual.from5
			(
				"visualImage",
				Coords.fromXY(125, 25), // pos
				Coords.fromXY(50, 50), // size
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var i = c.itemSelected;
						return (i == null ? visualNone : i.defn(world).visual);
					}
				),
				Color.byName("Black") // colorBackground
			),

			new ControlLabel
			(
				"infoStatus",
				Coords.fromXY(150, 115), // pos
				Coords.fromXY(200, 15), // size
				true, // isTextCentered
				DataBinding.fromContextAndGet
				(
					this,
					(c) => c.statusMessage
				), // text
				fontHeightSmall
			),

			ControlButton.from8
			(
				"buttonUse",
				Coords.fromXY(132.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Use",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) =>
					{
						var item = c.itemSelected;
						return (item != null && item.isUsable(world));
					}
				), // isEnabled
				use // click
			),

			ControlButton.from8
			(
				"buttonDrop",
				Coords.fromXY(152.5, 95), // pos
				Coords.fromXY(15, 10), // size
				"Drop",
				fontHeightSmall,
				true, // hasBorder
				DataBinding.fromContextAndGet
				(
					this,
					(c) => (c.itemSelected != null)
				), // isEnabled
				drop // click
			)
		];

		var returnValue = new ControlContainer
		(
			"Items",
			Coords.create(), // pos
			sizeBase.clone(), // size
			childControls,
			[
				new Action("Back", back),

				new Action("Up", up),
				new Action("Down", down),
				new Action("Split", split),
				new Action("Join", join),
				new Action("Sort", sort),
				new Action("Drop", drop),
				new Action("Use", use),

				new Action("Item0", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, null) ),
				new Action("Item1", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 1) ),
				new Action("Item2", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 2) ),
				new Action("Item3", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 3) ),
				new Action("Item4", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 4) ),
				new Action("Item5", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 5) ),
				new Action("Item6", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 6) ),
				new Action("Item7", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 7) ),
				new Action("Item8", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 8) ),
				new Action("Item9", () => itemHolder.equipItemInNumberedSlot(universe, entityItemHolder, 9) ),
			],

			[
				new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ),

				new ActionToInputsMapping( "Up", [ "[" ], true ),
				new ActionToInputsMapping( "Down", [ "]" ], true ),
				new ActionToInputsMapping( "Sort", [ "\\" ], true ),
				new ActionToInputsMapping( "Split", [ "/" ], true ),
				new ActionToInputsMapping( "Join", [ "=" ], true ),
				new ActionToInputsMapping( "Drop", [ "d" ], true ),
				new ActionToInputsMapping( "Use", [ "e" ], true ),

				new ActionToInputsMapping( "Item0", [ "_0" ], true ),
				new ActionToInputsMapping( "Item1", [ "_1" ], true ),
				new ActionToInputsMapping( "Item2", [ "_2" ], true ),
				new ActionToInputsMapping( "Item3", [ "_3" ], true ),
				new ActionToInputsMapping( "Item4", [ "_4" ], true ),
				new ActionToInputsMapping( "Item5", [ "_5" ], true ),
				new ActionToInputsMapping( "Item6", [ "_6" ], true ),
				new ActionToInputsMapping( "Item7", [ "_7" ], true ),
				new ActionToInputsMapping( "Item8", [ "_8" ], true ),
				new ActionToInputsMapping( "Item9", [ "_9" ], true ),

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
					"labelItems",
					Coords.fromXY(100, -5), // pos
					Coords.fromXY(100, 25), // size
					true, // isTextCentered
					"Items",
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

	// cloneable

	clone()
	{
		return new ItemHolder
		(
			ArrayHelper.clone(this.items),
			this.massMax,
			this.reachRadius
		);
	}
}
