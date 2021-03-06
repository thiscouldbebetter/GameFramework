

class AnimationKeyframe
{
	frameIndex;
	transforms;
	transformsByPropertyName;

	constructor(frameIndex, transforms)
	{
		this.frameIndex = frameIndex;
		this.transforms = transforms;
		this.transformsByPropertyName = ArrayHelper.addLookups(this.transforms, (x) => x.propertyName );
	}

	interpolateWith(otherAsAny, fractionOfProgressTowardOther)
	{
		var other = otherAsAny ;

		var transformsInterpolated = [];

		for (var i = 0; i < this.transforms.length; i++)
		{
			var transformThis = this.transforms[i];
			var transformOther = other.transformsByPropertyName.get
			(
				transformThis.propertyName
			);

			var transformInterpolated = transformThis.interpolateWith
			(
				transformOther,
				fractionOfProgressTowardOther
			);

			transformsInterpolated.push(transformInterpolated);
		}

		var returnValue = new AnimationKeyframe
		(
			null, // frameIndex
			transformsInterpolated
		);

		return returnValue;
	}
}
