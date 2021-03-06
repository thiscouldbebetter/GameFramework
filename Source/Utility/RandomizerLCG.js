

class RandomizerLCG
{
	// "LCG" = "Linear Congruential Generator"

	multiplier;
	addend;
	modulus;
	currentRandom;

	constructor(firstRandom, multiplier, addend, modulus)
	{
		this.currentRandom = firstRandom;
		this.multiplier = multiplier || 1103515245;
		this.addend = addend || 12345;
		this.modulus = modulus || Math.pow(2.0, 31);
	}

	static default()
	{
		return new RandomizerLCG
		(
			0.12345, // firstRandom
			1103515245, // multiplier
			12345, // addend
			Math.pow(2.0, 31) // modulus
		);
	}

	getNextRandom()
	{
		this.currentRandom =
		(
			(
				this.multiplier
				* (this.currentRandom * this.modulus)
				+ this.addend
			)
			% this.modulus
		)
		/ this.modulus;

		return this.currentRandom;
	}
}
