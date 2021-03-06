

class Transform_Locate
{
	loc;

	transformOrient;
	transformTranslate;

	constructor(loc)
	{
		this.loc = loc || Disposition.create();

		this.transformOrient = new Transform_Orient(null);
		this.transformTranslate = new Transform_Translate(null);
	}

	overwriteWith(other)
	{
		return this; // todo
	}

	transform(transformable)
	{
		return transformable.transform(this);
	}

	transformCoords(coordsToTransform)
	{
		this.transformOrient.orientation = this.loc.orientation;
		this.transformOrient.transformCoords(coordsToTransform);

		this.transformTranslate.displacement = this.loc.pos;
		this.transformTranslate.transformCoords(coordsToTransform);

		return coordsToTransform;
	}
}
