
class Transform_Animate
{
	animationDefnGroup;
	animatable;

	constructor(animationDefnGroup)
	{
		this.animationDefnGroup = animationDefnGroup;
		this.animatable = new Animatable(); // hack
	}

	animationDefnCurrent()
	{
		var returnValue = null;

		if (this.animatable.animationDefnNameCurrent != null)
		{
			var animationDefns = this.animationDefnGroup.animationDefnsByName;
			returnValue = animationDefns.get(this.animatable.animationDefnNameCurrent);
		}

		return returnValue;
	};

	frameCurrent()
	{
		var returnValue = null;

		var animationDefn = this.animationDefnCurrent();

		var framesSinceBeginningOfCycle =
			this.animatable.timerTicksSoFar // world.timerTicksSoFar
			% animationDefn.numberOfFramesTotal;

		var i;

		var keyframes = animationDefn.keyframes;
		for (i = keyframes.length - 1; i >= 0; i--)
		{
			keyframe = keyframes[i];

			if (keyframe.frameIndex <= framesSinceBeginningOfCycle)
			{
				break;
			}
		}

		var keyframe = keyframes[i];
		var framesSinceKeyframe = framesSinceBeginningOfCycle - keyframe.frameIndex;

		var keyframeNext = keyframes[i + 1];
		var numberOfFrames = keyframeNext.frameIndex - keyframe.frameIndex;
		var fractionOfProgressFromKeyframeToNext = framesSinceKeyframe / numberOfFrames;

		returnValue = keyframe.interpolateWith
		(
			keyframeNext,
			fractionOfProgressFromKeyframeToNext
		);

		return returnValue;
	};

	overwriteWith(other)
	{
		return this; // todo
	}

	transform(transformable)
	{
		if (this.animatable.animationDefnNameCurrent != null)
		{
			var frameCurrent = this.frameCurrent();

			var transforms = frameCurrent.transforms;

			for (var i = 0; i < transforms.length; i++)
			{
				var transformToApply = transforms[i];
				transformToApply.transform(transformable);
			}
		}

		return transformable;
	};

	transformCoords(coordsToTransform)
	{
		return coordsToTransform;
	}
}
