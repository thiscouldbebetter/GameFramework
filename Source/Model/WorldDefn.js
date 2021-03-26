

class WorldDefn
{
	defnArraysByTypeName;
	defnsByNameByTypeName;

	constructor(defnArrays)
	{
		this.defnArraysByTypeName = new Map();
		this.defnsByNameByTypeName = new Map();

		for (var i = 0; i < defnArrays.length; i++)
		{
			var defnsOfType = defnArrays[i];
			var defnsByName = ArrayHelper.addLookupsByName(defnsOfType);
			var itemFirst = defnsOfType[0];
			var itemTypeName = itemFirst.constructor.name;
			this.defnArraysByTypeName.set(itemTypeName, defnsOfType);
			this.defnsByNameByTypeName.set(itemTypeName, defnsByName);
		}
	}

	// Convenience methods.

	actionDefnByName(defnName)
	{
		return this.defnsByNameByTypeName.get(Action.name).get(defnName);
	}

	activityDefnByName(defnName)
	{
		return this.defnsByNameByTypeName.get(ActivityDefn.name).get(defnName);
	}

	entityDefnByName(defnName)
	{
		return this.defnsByNameByTypeName.get(Entity.name).get(defnName);
	}

	itemDefnByName(defnName)
	{
		return this.defnsByNameByTypeName.get(ItemDefn.name).get(defnName);
	}

	placeDefnByName(defnName)
	{
		return this.defnsByNameByTypeName.get(PlaceDefn.name).get(defnName);
	}

}
