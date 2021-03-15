

class Transform_TranslateInvert
{
	displacement;

	constructor(displacement)
	{
		this.displacement = displacement;
	}

	overwriteWith(other)
	{
		return this; // todo
	}

	transform(transformable)
	{
		return transformable; // todo
	}

	transformCoords(coordsToTransform)
	{
		return coordsToTransform.subtract(this.displacement);
	}
}
