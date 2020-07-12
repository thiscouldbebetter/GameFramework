
class Terrain
{
	name;
	codeChar;
	level;
	isBlocking;
	visuals;

	constructor(name, codeChar, level, isBlocking, visuals)
	{
		this.name = name;
		this.codeChar = codeChar;
		this.level = level;
		this.isBlocking = isBlocking;
		this.visuals = visuals;
	}
}
