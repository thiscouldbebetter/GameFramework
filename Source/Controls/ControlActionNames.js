
class ControlActionNames_Instances
{
	ControlCancel;
	ControlConfirm;
	ControlDecrement;
	ControlIncrement;
	ControlNext;
	ControlPrev;

	constructor()
	{
		this.ControlCancel = "ControlCancel";
		this.ControlConfirm = "ControlConfirm";
		this.ControlDecrement = "ControlDecrement";
		this.ControlIncrement = "ControlIncrement";
		this.ControlNext = "ControlNext";
		this.ControlPrev = "ControlPrev";
	}
}

class ControlActionNames
{
	static _instances;

	static Instances()
	{
		if (ControlActionNames._instances == null)
		{
			ControlActionNames._instances = new ControlActionNames_Instances();
		}

		return ControlActionNames._instances;
	};
}
