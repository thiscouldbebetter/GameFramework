

class Skeleton
{
	name;
	boneRoot;

	bonesAll;
	bonesAllByName;

	constructor(name, boneRoot)
	{
		this.name = name;
		this.boneRoot = boneRoot;

		this.bonesAll = [];
		this.bonesAll = TreeHelper.addNodeAndAllDescendantsToList
		(
			this.boneRoot, []
		);
		this.bonesAllByName = ArrayHelper.addLookupsByName(this.bonesAll);
	}

	equals(other)
	{
		var returnValue = true;

		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var boneFromThis = this.bonesAll[i];
			var boneFromOther = other.bonesAll[i];
			if (boneFromThis.orientation.equals(boneFromOther.orientation) == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	// cloneable

	clone()
	{
		return new Skeleton
		(
			this.name,
			this.boneRoot.clone()
		);
	}

	overwriteWith(other)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var bone = this.bonesAll[i];
			var boneOther = other.bonesAll[i];
			bone.overwriteWith(boneOther);
		}
		return this;
	}

	// transformable

	transform(transformToApply)
	{
		for (var i = 0; i < this.bonesAll.length; i++)
		{
			var bone = this.bonesAll[i];
			bone.transform(transformToApply);
		}
	}
}
