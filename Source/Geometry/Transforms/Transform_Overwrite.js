
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
		transformable.overwriteWith(this.transformableToOverwriteWith);
	}

	transformCoords(coordsToTransform)
	{
		return coordsToTransform;
	}
}
