

class Transform_Camera
{
	_camera;

	transformTranslateInvert;
	transformOrientForCamera;
	transformPerspective;
	transformViewCenter;

	constructor(camera)
	{
		this._camera = camera;

		this.transformTranslateInvert = new Transform_TranslateInvert
		(
			camera.loc.pos
		);
		this.transformOrientForCamera = new Transform_OrientForCamera
		(
			camera.loc.orientation
		);
		this.transformPerspective = new Transform_Perspective
		(
			camera.focalLength
		);
		this.transformViewCenter = new Transform_Translate
		(
			camera.viewSizeHalf
		);
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
		this.transformTranslateInvert.transformCoords(coordsToTransform);
		this.transformOrientForCamera.transformCoords(coordsToTransform);
		this.transformPerspective.transformCoords(coordsToTransform);
		this.transformViewCenter.transformCoords(coordsToTransform);
		return coordsToTransform;
	}
}
