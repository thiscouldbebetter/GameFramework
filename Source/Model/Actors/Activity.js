

class Activity
{
	defnName;
	target;
	isDone;

	constructor(defnName, target)
	{
		this.defnName = defnName;
		this.target = target;

		this.isDone = false;
	}

	defn(world)
	{
		return world.defn.activityDefnByName(this.defnName);
	}

	defnNameAndTargetSet(defnName, target)
	{
		this.defnName = defnName;
		this.target = target;
		return this;
	}

	perform(u, w, p, e)
	{
		if (this.defnName != null)
		{
			this.defn(w).perform(u, w, p, e, this);
		}
	}
}
