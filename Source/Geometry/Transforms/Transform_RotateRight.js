
class Transform_RotateRight
{
	quarterTurnsToRotate;

	constructor(quarterTurnsToRotate)
	{
		this.quarterTurnsToRotate = quarterTurnsToRotate;
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
		for (var i = 0; i < this.quarterTurnsToRotate; i++)
		{
			var temp = coordsToTransform.x;
			coordsToTransform.x = 0 - coordsToTransform.y;
			coordsToTransform.y = temp;
		}

		return coordsToTransform;
	};
}
