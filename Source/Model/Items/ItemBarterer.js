

class ItemBarterer
{
	itemHolderCustomerOffer;
	itemHolderStoreOffer;
	statusMessage;
	patience;
	patienceMax;

	itemDefnNameCurrency;

	constructor()
	{
		this.itemHolderCustomerOffer = ItemHolder.create();
		this.itemHolderStoreOffer = ItemHolder.create();
		this.statusMessage = "Choose items to trade and click the 'Offer' button.";
		this.patience = 10;

		this.patienceMax = 10;
	}

	isAnythingBeingOffered()
	{
		var returnValue =
		(
			this.itemHolderCustomerOffer.items.length > 0
			|| this.itemHolderStoreOffer.items.length > 0
		);
		return returnValue;
	}

	isOfferProfitableEnough(world)
	{
		var profitMarginForStore = this.profitMarginOfOfferForStore(world);

		var isOfferProfitableToStore = (profitMarginForStore > 1);

		return isOfferProfitableToStore;
	}

	profitMarginOfOfferForStore(world)
	{
		var valueOfferedByCustomer = this.itemHolderCustomerOffer.tradeValueOfAllItems(world);
		var valueOfferedByStore = this.itemHolderStoreOffer.tradeValueOfAllItems(world);

		var profitMarginForStore = valueOfferedByCustomer / valueOfferedByStore;

		return profitMarginForStore;
	}

	patienceAdd(patienceToAdd)
	{
		this.patience = NumberHelper.trimToRangeMax
		(
			this.patience + patienceToAdd, this.patienceMax
		);
	}

	reset(entityCustomer, entityStore)
	{
		this.itemHolderCustomerOffer.itemsAllTransferTo
		(
			entityCustomer.itemHolder()
		);
		this.itemHolderStoreOffer.itemsAllTransferTo
		(
			entityStore.itemHolder()
		);
	}

	trade(entityCustomer, entityStore)
	{
		this.itemHolderCustomerOffer.itemsAllTransferTo
		(
			entityStore.itemHolder()
		);
		this.itemHolderStoreOffer.itemsAllTransferTo
		(
			entityCustomer.itemHolder()
		);

		var entities = [ entityCustomer, entityStore ];
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];
			var entityEquipmentUser = entity.equipmentUser();
			if (entityEquipmentUser != null)
			{
				entityEquipmentUser.unequipItemsNoLongerHeld(entity);
			}
		}
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}
	updateForTimerTick(u, w, p, e){}

	// Controls.

	toControl
	(
		universe, size, entityCustomer,
		entityStore, venuePrev
	)
	{
		if (size == null)
		{
			size = universe.display.sizeDefault();
		}

		var fontHeight = 10;
		var margin = fontHeight * 1.5;
		var buttonSize = Coords.fromXY(4, 2).multiplyScalar(fontHeight);
		var buttonSizeSmall = Coords.fromXY(2, 2).multiplyScalar(fontHeight);
		var listSize = Coords.fromXY((size.x - margin * 3) / 2, 80);

		var itemBarterer = this;
		var itemHolderCustomer = entityCustomer.itemHolder();
		var itemHolderStore = entityStore.itemHolder();

		var world = universe.world;

		var back = () =>
		{
			itemBarterer.reset(entityCustomer, entityStore);
			var venueNext= venuePrev;
			venueNext = VenueFader.fromVenuesToAndFrom(venueNext, universe.venueCurrent);
			universe.venueNext = venueNext;
		};

		var itemOfferCustomer = () =>
		{
			if (itemHolderCustomer.itemSelected != null)
			{
				var offer = itemBarterer.itemHolderCustomerOffer;
				itemHolderCustomer.itemTransferSingleTo
				(
					itemHolderCustomer.itemSelected, offer
				);
			}
		};

		var itemOfferStore = () =>
		{
			if (itemHolderStore.itemSelected != null)
			{
				var offer = itemBarterer.itemHolderStoreOffer;
				itemHolderStore.itemTransferSingleTo
				(
					itemHolderStore.itemSelected, offer
				);
			}
		};

		var itemUnofferCustomer = () =>
		{
			var offer = itemBarterer.itemHolderCustomerOffer;

			if (offer.itemSelected != null)
			{
				offer.itemTransferSingleTo
				(
					offer.itemSelected, itemHolderCustomer
				);
			}
		};

		var itemUnofferStore = () =>
		{
			var offer = itemBarterer.itemHolderStoreOffer;

			if (offer.itemSelected != null)
			{
				offer.itemTransferSingleTo
				(
					offer.itemSelected, itemHolderStore
				);
			}
		};

		var offer = () =>
		{
			if (itemBarterer.patience <= 0)
			{
				var profitMargin =
					itemBarterer.profitMarginOfOfferForStore(world);
				var isCustomerDonatingToStore =
					(profitMargin == Number.POSITIVE_INFINITY);
				if (isCustomerDonatingToStore)
				{
					itemBarterer.statusMessage = "Very well, I accept your gift.";
					itemBarterer.trade(entityCustomer, entityStore);
					itemBarterer.patienceAdd(1);
				}
				else
				{
					itemBarterer.statusMessage = "No.  I'm sick of your nonsense.";
				}
			}
			else
			{
				var isOfferAccepted = itemBarterer.isOfferProfitableEnough(world);
				if (isOfferAccepted)
				{
					itemBarterer.statusMessage = "It's a deal!";
					itemBarterer.trade(entityCustomer, entityStore);
					itemBarterer.patienceAdd(1);
				}
				else
				{
					itemBarterer.statusMessage = "This deal is not acceptable.";
					itemBarterer.patienceAdd(-1);
				}
			}
		};

		var returnValue = new ControlContainer
		(
			"containerTransfer",
			Coords.create(), // pos
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelStoreName",
					Coords.fromXY(margin, margin - fontHeight / 2), // pos
					Coords.fromXY(listSize.x, 25), // size
					false, // isTextCentered
					entityStore.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listStoreItems",
					Coords.fromXY(margin, margin + fontHeight), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderStore,
						(c) =>
							c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
					), // items
					DataBinding.fromGet
					(
						(c) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderStore,
						(c) => c.itemSelected,
						(c, v) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferStore,
					null
				),

				ControlButton.from8
				(
					"buttonStoreOffer",
					Coords.fromXY
					(
						listSize.x - buttonSizeSmall.x * 2,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"v",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							(itemHolderStore.itemSelected != null)
					), // isEnabled
					itemOfferStore // click
				),

				ControlButton.from8
				(
					"buttonStoreUnoffer",
					Coords.fromXY
					(
						margin + listSize.x - buttonSizeSmall.x,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"^",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							(c.itemHolderStoreOffer.itemSelected != null)
					), // isEnabled
					itemUnofferStore // click
				),

				new ControlLabel
				(
					"labelItemsOfferedStore",
					Coords.fromXY
					(
						margin,
						margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2
					), // pos
					Coords.fromXY(100, 15), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				new ControlList
				(
					"listItemsOfferedByStore",
					Coords.fromXY
					(
						margin,
						margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y
					), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							c.itemHolderStoreOffer.items
					), // items
					DataBinding.fromGet
					(
						(c) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						this.itemHolderStoreOffer,
						(c) => c.itemSelected,
						(c, v) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemUnofferStore,
					null
				),

				new ControlLabel
				(
					"labelCustomerName",
					Coords.fromXY
					(
						size.x - margin - listSize.x, margin - fontHeight / 2
					), // pos
					Coords.fromXY(85, 25), // size
					false, // isTextCentered
					entityCustomer.name + ":",
					fontHeight
				),

				new ControlList
				(
					"listCustomerItems",
					Coords.fromXY
					(
						size.x - margin - listSize.x, margin + fontHeight
					), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						itemHolderCustomer,
						(c) =>
							c.items //.filter(x => x.item().defnName != itemDefnNameCurrency);
					), // items
					DataBinding.fromGet
					(
						(c) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						itemHolderCustomer,
						(c) => c.itemSelected,
						(c, v) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferCustomer,
					null
				),

				ControlButton.from8
				(
					"buttonCustomerOffer",
					Coords.fromXY
					(
						size.x - margin * 2 - buttonSizeSmall.x * 2,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"v",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							(itemHolderCustomer.itemSelected != null)
					), // isEnabled
					itemOfferCustomer // click
				),

				ControlButton.from8
				(
					"buttonCustomerUnoffer",
					Coords.fromXY
					(
						size.x - margin - buttonSizeSmall.x,
						margin * 2 + fontHeight + listSize.y
					), // pos
					buttonSizeSmall.clone(),
					"^",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							c.itemHolderCustomerOffer.itemSelected != null
					), // isEnabled
					itemUnofferCustomer // click
				),

				new ControlLabel
				(
					"labelItemsOfferedCustomer",
					Coords.fromXY
					(
						size.x - margin - listSize.x,
						margin * 2 + fontHeight + listSize.y + buttonSize.y - fontHeight / 2
					), // pos
					Coords.fromXY(100, 15), // size
					false, // isTextCentered
					"Offered:",
					fontHeight
				),

				ControlList.from10
				(
					"listItemsOfferedByCustomer",
					Coords.fromXY
					(
						size.x - margin - listSize.x,
						margin * 2 + fontHeight * 2 + listSize.y + buttonSize.y
					), // pos
					listSize.clone(),
					DataBinding.fromContextAndGet
					(
						this,
						(c) => c.itemHolderCustomerOffer.items
					), // items
					DataBinding.fromGet
					(
						(c) => c.toString(world)
					), // bindingForItemText
					fontHeight,
					new DataBinding
					(
						this.itemHolderCustomerOffer,
						(c) => c.itemSelected,
						(c, v) => c.itemSelected = v
					), // bindingForItemSelected
					DataBinding.fromGet( (c) => c ), // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					itemOfferCustomer
				),

				new ControlLabel
				(
					"infoStatus",
					Coords.fromXY(size.x / 2, size.y - margin * 2 - buttonSize.y), // pos
					Coords.fromXY(size.x, fontHeight), // size
					true, // isTextCentered
					DataBinding.fromContextAndGet(this, c => c.statusMessage),
					fontHeight
				),

				ControlButton.from8
				(
					"buttonReset",
					Coords.fromXY(margin, size.y - margin - buttonSize.y), // pos
					buttonSize.clone(),
					"Reset",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) => c.isAnythingBeingOffered()
					), // isEnabled
					() => // click
						itemBarterer.reset(entityCustomer, entityStore)
				),

				ControlButton.from8
				(
					"buttonOffer",
					Coords.fromXY
					(
						(size.x - buttonSize.x) / 2,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Offer",
					fontHeight,
					true, // hasBorder
					DataBinding.fromContextAndGet
					(
						this,
						(c) => c.isAnythingBeingOffered()
					), // isEnabled
					offer // click
				),

				ControlButton.from8
				(
					"buttonDone",
					Coords.fromXY
					(
						size.x - margin - buttonSize.x,
						size.y - margin - buttonSize.y
					), // pos
					buttonSize.clone(),
					"Done",
					fontHeight,
					true, // hasBorder
					true, // isEnabled
					back // click
				)
			],

			[ new Action("Back", back) ],

			[ new ActionToInputsMapping( "Back", [ Input.Names().Escape ], true ) ],

		);

		return returnValue;
	}
}
