

class ShapeHelper
{
	_transformLocate;

	constructor()
	{
		this._transformLocate = new Transform_Locate(null);
	}

	static _instance;
	static Instance()
	{
		if (ShapeHelper._instance == null)
		{
			ShapeHelper._instance = new ShapeHelper();
		}
		return ShapeHelper._instance;
	}

	applyLocationToShapeDefault(loc, shape)
	{
		this._transformLocate.loc = loc;

		Transforms.applyTransformToCoordsMany
		(
			this._transformLocate,
			(shape ).coordsGroupToTranslate()
		);

		return shape;
	}
}
