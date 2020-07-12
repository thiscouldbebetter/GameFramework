
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
		return transformable; // todo
	};

	transformCoords(coordsToTransform)
	{
		return coordsToTransform;
	}
}
