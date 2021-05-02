

class CraftingRecipe
{
	name;
	ticksToComplete;
	itemsIn;
	itemsOut;

	constructor
	(
		name, ticksToComplete, itemsIn,
		itemsOut
	)
	{
		this.name = name;
		this.ticksToComplete = ticksToComplete;
		this.itemsIn = itemsIn;
		this.itemsOut = itemsOut;
	}

	isFulfilledByItemHolder(itemHolderStaged)
	{
		var itemsStaged = itemHolderStaged.items;
		var areAllRequirementsFulfilledSoFar = true;

		for (var i = 0; i < this.itemsIn.length; i++)
		{
			var itemRequired = this.itemsIn[i];
			var itemStaged = itemsStaged.filter
			(
				x => x.defnName == itemRequired.defnName
			)[0];
			var isRequirementFulfilled =
			(
				itemStaged != null
				&& itemStaged.quantity >= itemRequired.quantity
			);

			if (isRequirementFulfilled == false)
			{
				areAllRequirementsFulfilledSoFar = false;
				break;
			}
		}

		return areAllRequirementsFulfilledSoFar;
	}

	itemsInHeldOverRequiredForItemHolder(itemHolder)
	{
		return this.itemsIn.map
		(
			x =>
				x.defnName
				+ " ("
				+ itemHolder.itemQuantityByDefnName(x.defnName)
				+ "/"
				+ x.quantity
				+ ")"
		);
	}

	nameAndSecondsToCompleteAsString(universe)
	{
		return this.name + " (" + this.secondsToComplete(universe) + "s)";
	}

	secondsToComplete(universe)
	{
		return (this.ticksToComplete / universe.timerHelper.ticksPerSecond);
	}

	// Cloneable.

	clone()
	{
		return new CraftingRecipe
		(
			this.name, this.ticksToComplete, ArrayHelper.clone(this.itemsIn),
			ArrayHelper.clone(this.itemsOut)
		);
	}
}
