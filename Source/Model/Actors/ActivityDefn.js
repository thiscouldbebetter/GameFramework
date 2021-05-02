

class ActivityDefn
{
	name;
	_perform;

	constructor
	(
		name,
		perform
	)
	{
		this.name = name;
		this._perform = perform;
	}

	static _instances;
	static Instances()
	{
		if (ActivityDefn._instances == null)
		{
			ActivityDefn._instances = new ActivityDefn_Instances();
		}
		return ActivityDefn._instances;
	}

	perform(u, w, p, e)
	{
		this._perform(u, w, p, e);
	}
}

class ActivityDefn_Instances
{
	_All;
	_AllByName;

	DoNothing;
	HandleUserInput;
	Simultaneous;

	constructor()
	{
		this.DoNothing = new ActivityDefn
		(
			"DoNothing",
			// perform
			(u, w, p, e) =>
			{}
		);

		this.HandleUserInput = UserInputListener.activityDefnHandleUserInput();

		this.Simultaneous = new ActivityDefn
		(
			"Simultaneous",
			// perform
			(u, w, p, e) =>
			{
				var activity = e.actor().activity;
				var childDefnNames = activity.target() ;
				for (var i = 0; i < childDefnNames.length; i++)
				{
					var childDefnName = childDefnNames[i];
					var childDefn = w.defn.activityDefnByName(childDefnName);
					childDefn.perform(u, w, p, e);
				}
			}
		);

		this._All =
		[
			this.DoNothing,
			this.HandleUserInput,
			this.Simultaneous
		];

		this._AllByName = ArrayHelper.addLookupsByName(this._All);
	}
}
