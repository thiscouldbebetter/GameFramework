

class ControlList extends ControlBase
{
	_items;
	bindingForItemText;
	bindingForItemSelected;
	bindingForItemValue;
	bindingForIsEnabled;
	confirm;
	widthInItems;

	isHighlighted;
	_itemSpacing;
	parent;
	scrollbar;

	_drawLoc;
	_drawPos;
	_itemSelected;
	_mouseClickPos;

	constructor
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels,
		bindingForItemSelected,
		bindingForItemValue,
		bindingForIsEnabled,
		confirm,
		widthInItems
	)
	{
		super(name, pos, size, fontHeightInPixels);
		this._items = items;
		this.bindingForItemText = bindingForItemText;
		this.bindingForItemSelected = bindingForItemSelected;
		this.bindingForItemValue = bindingForItemValue;
		this.bindingForIsEnabled = bindingForIsEnabled || DataBinding.fromTrue();
		this.confirm = confirm;
		this.widthInItems = widthInItems || 1;

		var itemSpacingY = 1.2 * this.fontHeightInPixels; // hack
		this._itemSpacing = new Coords(0, itemSpacingY, 0);
		var scrollbarWidth = itemSpacingY;

		this.isHighlighted = false;

		this.scrollbar = new ControlScrollbar
		(
			new Coords(this.size.x - scrollbarWidth, 0, 0), // pos
			new Coords(scrollbarWidth, this.size.y, 0), // size
			this.fontHeightInPixels,
			itemSpacingY, // itemHeight
			this._items,
			0 // value
		);

		// Helper variables.
		this._drawPos = Coords.create();
		this._drawLoc = Disposition.fromPos(this._drawPos);
		this._mouseClickPos = Coords.create();
	}

	static fromPosSizeAndItems(pos, size, items)
	{
		var returnValue = new ControlList
		(
			"", // name,
			pos,
			size,
			items,
			DataBinding.fromContext(null), // bindingForItemText,
			10, // fontHeightInPixels,
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			DataBinding.fromTrue(), // isEnabled
			null, null
		);

		return returnValue;
	}

	static fromPosSizeItemsAndBindingForItemText
	(
		pos, size, items,
		bindingForItemText
	)
	{
		var returnValue = new ControlList
		(
			"", // name,
			pos,
			size,
			items,
			bindingForItemText,
			10, // fontHeightInPixels,
			null, // bindingForItemSelected,
			null, // bindingForItemValue,
			DataBinding.fromTrue(), // isEnabled
			null, null
		);

		return returnValue;
	}

	static from6
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels
	)
	{
		return new ControlList
		(
			name, pos, size, items, bindingForItemText, fontHeightInPixels,
			null, null, null, null, null
		);
	}

	static from7
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels,
		bindingForItemSelected,
	)
	{
		return new ControlList
		(
			name, pos, size, items, bindingForItemText, fontHeightInPixels,
			bindingForItemSelected, null, null, null, null
		);
	}

	static from8
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels,
		bindingForItemSelected,
		bindingForItemValue,
	)
	{
		return new ControlList
		(
			name, pos, size, items, bindingForItemText, fontHeightInPixels,
			bindingForItemSelected, bindingForItemValue, null, null, null
		);
	}

	static from9
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels,
		bindingForItemSelected,
		bindingForItemValue,
		bindingForIsEnabled
	)
	{
		return new ControlList
		(
			name, pos, size, items, bindingForItemText, fontHeightInPixels,
			bindingForItemSelected, bindingForItemValue, bindingForIsEnabled,
			null, null
		);
	}

	static from10
	(
		name,
		pos,
		size,
		items,
		bindingForItemText,
		fontHeightInPixels,
		bindingForItemSelected,
		bindingForItemValue,
		bindingForIsEnabled,
		confirm
	)
	{
		return new ControlList
		(
			name, pos, size, items, bindingForItemText, fontHeightInPixels,
			bindingForItemSelected, bindingForItemValue, bindingForIsEnabled,
			confirm, null
		);
	}

	actionHandle(actionNameToHandle, universe)
	{
		var wasActionHandled = false;
		var controlActionNames = ControlActionNames.Instances();
		if (actionNameToHandle == controlActionNames.ControlIncrement)
		{
			this.itemSelectedNextInDirection(1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlDecrement)
		{
			this.itemSelectedNextInDirection(-1);
			wasActionHandled = true;
		}
		else if (actionNameToHandle == controlActionNames.ControlConfirm)
		{
			if (this.confirm != null)
			{
				this.confirm(universe);
				wasActionHandled = true;
			}
		}
		return wasActionHandled;
	}

	indexOfFirstItemVisible()
	{
		return this.indexOfFirstRowVisible() * this.widthInItems;
	}

	indexOfFirstRowVisible()
	{
		return this.scrollbar.sliderPosInItems();
	}

	indexOfItemSelected(valueToSet)
	{
		var returnValue = valueToSet;
		var items = this.items();
		if (valueToSet == null)
		{
			returnValue = items.indexOf(this.itemSelected(null));
			if (returnValue == -1)
			{
				returnValue = null;
			}
		}
		else
		{
			var itemToSelect = items[valueToSet];
			this.itemSelected(itemToSelect);
		}
		return returnValue;
	}

	indexOfLastItemVisible()
	{
		return this.indexOfLastRowVisible() * this.widthInItems;
	}

	indexOfLastRowVisible()
	{
		var rowCountVisible = Math.floor(this.scrollbar.windowSizeInItems) - 1;
		var returnValue = this.indexOfFirstRowVisible() + rowCountVisible;
		return returnValue;
	}

	isEnabled()
	{
		return (this.bindingForIsEnabled == null ? true : this.bindingForIsEnabled.get());
	}

	itemSelected(itemToSet)
	{
		var returnValue = itemToSet;

		if (itemToSet == null)
		{
			if (this.bindingForItemSelected == null)
			{
				returnValue = this._itemSelected;
			}
			else
			{
				returnValue = (this.bindingForItemSelected.get == null ? this._itemSelected : this.bindingForItemSelected.get() );
			}
		}
		else
		{
			this._itemSelected = itemToSet;

			if (this.bindingForItemSelected != null)
			{
				var valueToSet;
				if (this.bindingForItemValue == null)
				{
					valueToSet = this._itemSelected;
				}
				else
				{
					valueToSet = this.bindingForItemValue.contextSet
					(
						this._itemSelected
					).get();
				}
				this.bindingForItemSelected.set(valueToSet);
			}
		}

		return returnValue;
	}

	itemSelectedNextInDirection(direction)
	{
		var items = this.items();
		var numberOfItems = items.length;

		var indexOfItemSelected = this.indexOfItemSelected(null);

		if (indexOfItemSelected == null)
		{
			if (numberOfItems > 0)
			{
				if (direction == 1)
				{
					indexOfItemSelected = 0;
				}
				else // if (direction == -1)
				{
					indexOfItemSelected = numberOfItems - 1;
				}
			}
		}
		else
		{
			indexOfItemSelected = NumberHelper.trimToRangeMinMax
			(
				indexOfItemSelected + direction, 0, numberOfItems - 1
			);
		}

		var itemToSelect = (indexOfItemSelected == null ? null : items[indexOfItemSelected]);
		this.itemSelected(itemToSelect);

		var indexOfFirstItemVisible = this.indexOfFirstItemVisible();
		var indexOfLastItemVisible = this.indexOfLastItemVisible();

		var indexOfItemSelected = this.indexOfItemSelected(null);
		if (indexOfItemSelected < indexOfFirstItemVisible)
		{
			this.scrollbar.scrollUp();
		}
		else if (indexOfItemSelected > indexOfLastItemVisible)
		{
			this.scrollbar.scrollDown();
		}

		var returnValue = this.itemSelected(null);
		return returnValue;
	}

	itemSpacing()
	{
		var scrollbarWidthVisible = (this.scrollbar.isVisible() ? this.scrollbar.size.x : 0);
		return this._itemSpacing.overwriteWithDimensions
		(
			(this.size.x - scrollbarWidthVisible) / this.widthInItems,
			this._itemSpacing.y,
			0
		);
	}

	items()
	{
		return (this._items.get == null ? this._items : this._items.get());
	}

	mouseClick(clickPos)
	{
		clickPos = this._mouseClickPos.overwriteWith(clickPos);

		var isClickPosInScrollbar =
			(clickPos.x - this.pos.x > this.size.x - this.scrollbar.handleSize.x);
		if (isClickPosInScrollbar)
		{
			if (clickPos.y - this.pos.y <= this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollUp();
			}
			else if (clickPos.y - this.pos.y >= this.scrollbar.size.y - this.scrollbar.handleSize.y)
			{
				this.scrollbar.scrollDown();
			}
		}
		else
		{
			var clickOffsetInPixels = clickPos.clone().subtract(this.pos);
			var clickOffsetInItems =
				clickOffsetInPixels.clone().divide(this.itemSpacing()).floor();
			var rowOfItemClicked =
				this.indexOfFirstRowVisible() + clickOffsetInItems.y;
			var indexOfItemClicked =
				rowOfItemClicked * this.widthInItems + clickOffsetInItems.x;

			var items = this.items();
			if (indexOfItemClicked < items.length)
			{
				var indexOfItemSelectedOld = this.indexOfItemSelected(null);
				if (indexOfItemClicked == indexOfItemSelectedOld)
				{
					if (this.confirm != null)
					{
						this.confirm(null); // todo
					}
				}
				else
				{
					this.indexOfItemSelected(indexOfItemClicked);
				}
			}
		}

		return true; // wasActionHandled
	}

	mouseEnter(){}

	mouseExit(){}

	mouseMove(movePos){ return false; }

	scalePosAndSize(scaleFactor)
	{
		this.pos.multiply(scaleFactor);
		this.size.multiply(scaleFactor);
		this.fontHeightInPixels *= scaleFactor.y;
		this._itemSpacing.multiply(scaleFactor);
		this.scrollbar.scalePosAndSize(scaleFactor);

		return this;
	}

	// drawable

	draw
	(
		universe, display, drawLoc,
		style
	)
	{
		drawLoc = this._drawLoc.overwriteWith(drawLoc);
		var drawPos = this._drawPos.overwriteWith(drawLoc.pos).add(this.pos);

		var style = style || this.style(universe);
		var colorFore = (this.isHighlighted ? style.colorFill : style.colorBorder);
		var colorBack = (this.isHighlighted ? style.colorBorder : style.colorFill);

		display.drawRectangle
		(
			drawPos,
			this.size,
			colorBack, // fill
			style.colorBorder, // border
			false // areColorsReversed
		);

		var textMarginLeft = 2;

		var items = this.items();

		if (items == null)
		{
			return;
		}

		var indexStart = this.indexOfFirstItemVisible();
		var indexEnd = this.indexOfLastItemVisible();
		if (indexEnd >= items.length)
		{
			indexEnd = items.length - 1;
		}

		var itemSelected = this.itemSelected(null);

		var drawPos2 = Coords.create();

		for (var i = indexStart; i <= indexEnd; i++)
		{
			var item = items[i];

			var iOffset = i - indexStart;
			var offsetInItems = new Coords
			(
				iOffset % this.widthInItems,
				Math.floor(iOffset / this.widthInItems),
				0
			);

			drawPos2.overwriteWith
			(
				this.itemSpacing()
			).multiply
			(
				offsetInItems
			).add
			(
				drawPos
			)

			if (item == itemSelected)
			{
				display.drawRectangle
				(
					drawPos2,
					this.itemSpacing(),
					colorFore, // colorFill
					null, null
				);
			}

			var text = this.bindingForItemText.contextSet
			(
				item
			).get();

			drawPos2.addDimensions
			(
				textMarginLeft, 0, 0
			);

			display.drawText
			(
				text,
				this.fontHeightInPixels,
				drawPos2,
				colorFore,
				colorBack,
				(i == this.indexOfItemSelected(null)), // areColorsReversed
				false, // isCentered
				this.size.x // widthMaxInPixels
			);
		}

		this.scrollbar.draw(universe, display, drawLoc, style);
	}
}
