

class DamageType
{
	name;

	constructor(name)
	{
		this.name = name;
	}

	static _instances;
	static Instances()
	{
		if (DamageType._instances == null)
		{
			DamageType._instances = new DamageType_Instances();
		}
		return DamageType._instances;
	}

	static byName(name)
	{
		var damageTypes = DamageType.Instances();
		return damageTypes._AllByName.get(name) || damageTypes._Unspecified;
	}
}

class DamageType_Instances
{
	_Unspecified;
	Cold;
	Heat;
	_All;
	_AllByName;

	constructor()
	{
		this._Unspecified = new DamageType("Unspecified");
		this.Cold = new DamageType("Cold");
		this.Heat = new DamageType("Heat");

		this._All =
		[
			this._Unspecified,
			this.Cold,
			this.Heat
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}
