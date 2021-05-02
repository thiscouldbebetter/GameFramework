

class PlaceDefn
{
	name;
	actions;
	actionsByName;
	actionToInputsMappings;
	propertyNamesToProcess;
	_placeInitialize;
	_placeFinalize;

	actionToInputsMappingsByInputName;
	actionToInputsMappingSelected;
	actionToInputsMappingsDefault;
	actionToInputsMappingsEdited;

	constructor
	(
		name,
		actions,
		actionToInputsMappings,
		propertyNamesToProcess,
		placeInitialize,
		placeFinalize
	)
	{
		this.name = name;
		this.actions = actions;
		this.actionsByName = ArrayHelper.addLookupsByName(this.actions);
		this.actionToInputsMappingsDefault = actionToInputsMappings;
		this.propertyNamesToProcess = propertyNamesToProcess;
		this._placeInitialize = placeInitialize;
		this._placeFinalize = placeFinalize;

		this.actionToInputsMappings = ArrayHelper.clone(this.actionToInputsMappingsDefault);
		this.actionToInputsMappingsEdited = ArrayHelper.clone(this.actionToInputsMappings);

		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, (x) => x.inputNames
		);
	}

	static default()
	{
		return new PlaceDefn
		(
			"Default", // name,
			[], // actions,
			[], // actionToInputsMappings,
			[], // propertyNamesToProcess,
			null, // placeInitialize
			null // placeFinalize
		);
	}

	static from4
	(
		name,
		actions,
		actionToInputsMappings,
		propertyNamesToProcess
	)
	{
		return new PlaceDefn
		(
			name, actions, actionToInputsMappings, propertyNamesToProcess,
			null, null // placeInitialize, placeFinalize
		);
	}

	actionToInputsMappingsEdit()
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappings
		);

		this.actionToInputsMappingSelected = null;
	}

	actionToInputsMappingsRestoreDefaults()
	{
		ArrayHelper.overwriteWith
		(
			this.actionToInputsMappingsEdited,
			this.actionToInputsMappingsDefault
		);
	}

	actionToInputsMappingsSave()
	{
		this.actionToInputsMappings = ArrayHelper.clone
		(
			this.actionToInputsMappingsEdited
		);
		this.actionToInputsMappingsByInputName = ArrayHelper.addLookupsMultiple
		(
			this.actionToInputsMappings, (x) => x.inputNames
		);
	}

	placeFinalize(universe, world, place)
	{
		if (this._placeFinalize != null)
		{
			this._placeFinalize(universe, world, place);
		}
	}

	placeInitialize(universe, world, place)
	{
		if (this._placeInitialize != null)
		{
			this._placeInitialize(universe, world, place);
		}
	}
}
