

class SkillLearner
{
	skillBeingLearnedName;
	learningAccumulated;
	skillsKnownNames;

	skillSelectedName;

	constructor
	(
		skillBeingLearnedName, learningAccumulated,
		skillsKnownNames
	)
	{
		this.skillBeingLearnedName = skillBeingLearnedName;
		this.learningAccumulated = learningAccumulated || 0;
		this.skillsKnownNames = skillsKnownNames || [];
	}

	isLearningInProgress()
	{
		return (this.learningAccumulated > 0);
	}

	isSkillBeingLearned()
	{
		return (this.skillBeingLearnedName != null);
	}

	skillCheapestAvailable(skillsAll)
	{
		var skillCheapest= null;

		var skillsAvailable = this.skillsAvailableToLearn(skillsAll);
		if (skillsAvailable.length > 0)
		{
			skillCheapest = skillsAvailable.sort
			(
				(x, y) => x.learningRequired - y.learningRequired
			)[0];
		}
		return skillCheapest;
	}

	learningIncrement
	(
		skillsAll, skillsByName, amountToIncrement
	)
	{
		var message = null;

		var skillBeingLearned = this.skillBeingLearned(skillsByName);

		if (skillBeingLearned == null)
		{
			var skillCheapest = this.skillCheapestAvailable(skillsAll);
			if (skillCheapest != null)
			{
				skillBeingLearned = skillCheapest;
				this.skillBeingLearnedName = skillCheapest.name;
				message = "Now learning '" + this.skillBeingLearnedName + "'."
			}
		}

		if (skillBeingLearned != null)
		{
			this.learningAccumulated += amountToIncrement;

			var learningRequired = skillBeingLearned.learningRequired;
			if (this.learningAccumulated >= learningRequired)
			{
				message = "Learned skill '" + this.skillBeingLearnedName + "'.";
				this.skillsKnownNames.push
				(
					this.skillBeingLearnedName
				);
				this.skillBeingLearnedName = null;
				this.learningAccumulated = 0;
			}
		}

		return message;
	}

	learningAccumulatedOverRequired(skillsAllByName)
	{
		return this.learningAccumulated + "/" + this.learningRequired(skillsAllByName);
	}

	learningRequired(skillsAllByName)
	{
		var skillBeingLearned = this.skillBeingLearned(skillsAllByName);
		var returnValue =
		(
			skillBeingLearned == null
			? 0
			: skillBeingLearned.learningRequired
		);
		return returnValue;
	}

	skillSelected(skillsAllByName)
	{
		return (this.skillSelectedName == null ? null : skillsAllByName.get(this.skillSelectedName));
	}

	skillsAvailableToLearn(skillsAll)
	{
		var skillsUnknown = [];

		for (var i = 0; i < skillsAll.length; i++)
		{
			var skill = skillsAll[i];
			var skillName = skill.name;

			var isAlreadyKnown =
				this.skillsKnownNames.some(x => x == skillName);

			if (isAlreadyKnown == false)
			{
				skillsUnknown.push(skill);
			}
		}

		var skillsUnknownWithKnownPrerequisites = [];

		for (var i = 0; i < skillsUnknown.length; i++)
		{
			var skill = skillsUnknown[i];
			var prerequisites = skill.namesOfPrerequisiteSkills;

			var areAllPrerequisitesKnown = true;

			for (var p = 0; p < prerequisites.length; p++)
			{
				var prerequisite = prerequisites[p];
				var isPrerequisiteKnown =
				(
					this.skillsKnownNames.some(x => x == prerequisite)
				);

				if (isPrerequisiteKnown == false)
				{
					areAllPrerequisitesKnown = false;
					break;
				}
			}

			if (areAllPrerequisitesKnown)
			{
				skillsUnknownWithKnownPrerequisites.push
				(
					skill
				);
			}
		}

		return skillsUnknownWithKnownPrerequisites;
	}

	skillsKnown(skillsAllByName)
	{
		var returnValues = [];

		for (var i = 0; i < this.skillsKnownNames.length; i++)
		{
			var skillName = this.skillsKnownNames[i];
			var skill = skillsAllByName.get(skillName);
			returnValues.push(skill);
		}

		return returnValues;
	}

	skillBeingLearned(skillsAllByName)
	{
		var returnValue = skillsAllByName.get(this.skillBeingLearnedName);

		return returnValue;
	}

	// EntityProperty.

	finalize(u, w, p, e){}
	initialize(u, w, p, e){}

	updateForTimerTick(universe, world, place, entity)
	{
		// Do nothing.
	}

	// controls

	toControl
	(
		universe, size, entity,
		venueToReturnTo, includeTitle
	)
	{
		var display = universe.display;
		//var size = display.sizeInPixels.clone();
		var labelHeight = display.fontHeightInPixels * 1.2;
		var margin = 20;
		var labelHeightLarge = labelHeight * 2;

		size = size.clone().addDimensions(0, 30, 0); // hack

		var listSize = Coords.fromXY
		(
			(size.x - margin * 3) / 2, 150
		);

		var defns = universe.world.defn;
		var skillLearner = this;
		var skillsAll = defns.defnArraysByTypeName.get(Skill.name); // todo - Just use the -ByName lookup.
		var skillsAllByName = defns.defnsByNameByTypeName.get(Skill.name);

		var returnValue = ControlContainer.from4
		(
			"Skills", // name,
			Coords.create(), // pos,
			size.clone(),
			// children
			[
				new ControlLabel
				(
					"labelSkillsKnown", // name,
					Coords.fromXY(margin, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Skills Known:", //text
					labelHeight // fontHeightInPixels
				),

				ControlList.from6
				(
					"listSkillsKnown",
					Coords.fromXY(margin, 60), // pos
					listSize,
					// items
					DataBinding.fromContext(this.skillsKnownNames),
					DataBinding.fromContext(null), // bindingForItemText
					labelHeight // fontHeightInPixels
				),

				new ControlLabel
				(
					"labelSkillsAvailable", // name,
					Coords.fromXY(size.x - margin - listSize.x, 40), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContext("Skills Available:"), // text
					labelHeight // fontHeightInPixels
				),

				ControlList.from10
				(
					"listSkillsAvailable", // name,
					Coords.fromXY(size.x - margin - listSize.x, 60), // pos,
					listSize,
					// items,
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							c.skillsAvailableToLearn(skillsAll)
					),
					DataBinding.fromGet
					(
						(c) => c.name
					), // bindingForItemText
					labelHeight, // fontHeightInPixels
					new DataBinding
					(
						this,
						(c) =>
						{
							return c.skillSelected(skillsAllByName);
						},
						(c, v) =>
						{
							var skillName = v.name;
							c.skillSelectedName = skillName;
						}
					), // bindingForItemSelected
					null, // bindingForItemValue
					DataBinding.fromTrue(), // isEnabled
					(u) =>
					{
						skillLearner.skillBeingLearnedName =
							skillLearner.skillSelectedName;
					} // confirm
				),

				ControlLabel.from5
				(
					"labelSkillSelected", // name,
					Coords.fromXY(margin, 220), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Selected:" // text
				),

				ControlLabel.from5
				(
					"labelSkillSelected", // name,
					Coords.fromXY(80, 220), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this, (c) => (c.skillSelectedName || "-")
					)
				),

				new ControlLabel
				(
					"labelSkillSelectedDescription", // name,
					Coords.fromXY(margin, 232), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
						{
							var skill = c.skillSelected(skillsAllByName);
							return (skill == null ? "-" : skill.description);
						}
					),
					null
				),

				ControlLabel.from5
				(
					"labelSkillBeingLearned", // name,
					Coords.fromXY(margin, size.y - margin - labelHeight * 2), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Skill Being Learned:" // text
				),

				new ControlLabel
				(
					"textSkillBeingLearned", // name,
					Coords.fromXY(145, size.y - margin - labelHeight * 2), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
						{
							return (c.skillBeingLearnedName || "-");
						}
					),
					null
				),

				ControlLabel.from5
				(
					"labelLearningAccumulated", // name,
					Coords.fromXY(margin, size.y - margin - labelHeight), // pos,
					Coords.fromXY(size.x - margin * 2, labelHeight), // size,
					false, // isTextCentered,
					"Learning Accumulated:" // text
				),

				ControlLabel.from5
				(
					"textLearningAccumulated", // name,
					Coords.fromXY(145, size.y - margin - labelHeight), // pos,
					Coords.fromXY(30, labelHeight), // size,
					false, // isTextCentered,
					DataBinding.fromContextAndGet
					(
						this,
						(c) =>
							c.learningAccumulatedOverRequired(skillsAllByName)
					) // text
				),
			]
		);

		if (includeTitle)
		{
			returnValue.children.splice
			(
				0, 0,
				new ControlLabel
				(
					"labelSkills",
					Coords.fromXY(200, 20), // pos
					Coords.fromXY(120, 25), // size
					true, // isTextCentered
					"Skills",
					labelHeightLarge
				)
			);
		}
		else
		{
			var titleHeightInverted = Coords.fromXY(0, -30);
			returnValue.size.add(titleHeightInverted);
			returnValue.shiftChildPositions(titleHeightInverted);
		}

		return returnValue;
	}
}
