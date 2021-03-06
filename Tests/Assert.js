
class Assert
{
	static areEqual(objectExpected, objectActual)
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);
		if (areExpectedAndActualEqual == false)
		{
			var errorMessage = 
				"Expected: " + JSON.stringify(objectExpected)
				+ ", but was: " + JSON.stringify(objectActual) + "."

			throw(errorMessage);
		}
	}

	static areNotEqual(objectExpected, objectActual)
	{
		var areExpectedAndActualEqual = this.areObjectsEqual
		(
			objectExpected, objectActual
		);
		if (areExpectedAndActualEqual)
		{
			var errorMessage = 
				"The objects were equal, which was not expected.";
			throw(errorMessage);
		}
	}

	static isFalse(valueToTest)
	{
		if (valueToTest != false)
		{
			throw("Expected: false, but was: " + valueToTest + ".");
		}
	}

	static isNotNull(valueToTest)
	{
		if (valueToTest == null)
		{
			throw("Expected: not null, but was: null.");
		}
	}

	static isTrue(valueToTest)
	{
		if (valueToTest != true)
		{
			throw("Expected: true, but was: " + valueToTest + ".");
		}
	}

	// Helper methods.

	 static areObjectsEqual(objectExpected, objectActual)
	{
		var areExpectedAndActualEqual;

		if (objectExpected == objectActual)
		{
			areExpectedAndActualEqual = true;
		}
		else if
		(
			objectExpected.equals != null
			&& objectActual.equals != null
			&& objectExpected.equals(objectActual)
		)
		{
			areExpectedAndActualEqual = true;
		}
		else
		{
			var objectExpectedAsJson = JSON.stringify(objectExpected);
			var objectActualAsJson = JSON.stringify(objectActual);

			areExpectedAndActualEqual =
				(objectExpectedAsJson == objectActualAsJson);
		}

		return areExpectedAndActualEqual;
	}
}
