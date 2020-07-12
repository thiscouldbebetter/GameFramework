
class Material
{
	name;
	colorStroke;
	colorFill;
	texture;

	constructor(name, colorStroke, colorFill, texture)
	{
		this.name = name;
		this.colorStroke = colorStroke;
		this.colorFill = colorFill;
		this.texture = texture;
	}

	static _instances;
	static Instances()
	{
		if (Material._instances == null)
		{
			Material._instances = new Material_Instances();
		}

		return Material._instances;
	};
}

class Material_Instances
{
	Default;

	constructor()
	{
		this.Default = new Material
		(
			"Default",
			Color.Instances().Blue, // colorStroke
			Color.Instances().Yellow, // colorFill
			null // texture
		);
	}
}

