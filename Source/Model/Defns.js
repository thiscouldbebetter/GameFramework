
class Defns
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
}
