
class AnimationDefnGroup
{
	name;
	animationDefns;
	animationDefnsByName;

	constructor(name, animationDefns)
	{
		this.name = name;
		this.animationDefns = animationDefns;
		this.animationDefnsByName = ArrayHelper.addLookupsByName(this.animationDefns);
	}
}
