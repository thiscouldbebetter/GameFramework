

class EquipmentSocketDefnGroup
{
	name;
	socketDefns;
	socketDefnsByName;

	constructor(name, socketDefns)
	{
		this.name = name;
		this.socketDefns = socketDefns;
		this.socketDefnsByName = ArrayHelper.addLookupsByName(this.socketDefns);
	}
}
