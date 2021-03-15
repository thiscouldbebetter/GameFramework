

class Transform_Overwrite
{
	transformableToOverwriteWith;

	constructor(transformableToOverwriteWith)
	{
		this.transformableToOverwriteWith = transformableToOverwriteWith;
	}

	overwriteWith(other)
	{
		return this; // todo
	}

	transform(transformable)
	{
		// todo
		//transformable.overwriteWith(this.transformableToOverwriteWith);
		return this;
	}

	transformCoords(coordsToTransform)
	{
		return coordsToTransform;
	}
}
