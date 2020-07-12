
class Transform_Camera
{
	camera;

	transformTranslateInvert;
	transformOrientForCamera;
	transformPerspective;
	transformViewCenter;

	constructor(camera)
	{
		this.camera = camera;

		this.transformTranslateInvert = new Transform_TranslateInvert
		(
			this.camera.loc.pos
		);
		this.transformOrientForCamera = new Transform_OrientForCamera
		(
			this.camera.loc.orientation
		);
		this.transformPerspective = new Transform_Perspective
		(
			this.camera.focalLength
		);
		this.transformViewCenter = new Transform_Translate
		(
			this.camera.viewSizeHalf
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
	};
}
