

class PlaceBuilderDemo_Actions
{
	parent;

	constructor(parent)
	{
		this.parent = parent;
	}

	// actions

	actionsBuild()
	{
		var actionsAll = Action.Instances();

		var actions =
		[
			actionsAll.DoNothing,
			actionsAll.ShowMenu,

			new Action
			(
				"MoveDown",
				(universe, world, place, actor) => // perform
				{
					actor.movable().accelerateInDirection
					(
						universe, world, place, actor, Coords.Instances().ZeroOneZero
					);
				}
			),

			new Action
			(
				"MoveLeft",
				(universe, world, place, actor) => // perform
				{
					actor.movable().accelerateInDirection
					(
						universe, world, place, actor, Coords.Instances().MinusOneZeroZero
					);
				}
			),

			new Action
			(
				"MoveRight",
				(universe, world, place, actor) => // perform
				{
					actor.movable().accelerateInDirection
					(
						universe, world, place, actor, Coords.Instances().OneZeroZero
					);
				}
			),

			new Action
			(
				"MoveUp",
				(universe, world, place, actor) => // perform
				{
					actor.movable().accelerateInDirection
					(
						universe, world, place, actor, Coords.Instances().ZeroMinusOneZero
					);
				}
			),

			new Action
			(
				"Fire",
				(universe, world, place, actor) => // perform
				{
					var equipmentUser = actor.equipmentUser();
					var entityWieldableEquipped = equipmentUser.itemEntityInSocketWithName("Wielding");
					var actorHasWieldableEquipped = (entityWieldableEquipped != null);

					if (actorHasWieldableEquipped)
					{
						var deviceWieldable = entityWieldableEquipped.device();
						deviceWieldable.use(universe, world, place, actor, entityWieldableEquipped);
					}
				}
			),

			new Action
			(
				"Hide",
				(universe, world, place, actor) => // perform
				{
					var learner = actor.skillLearner();
					var knowsHowToHide = learner.skillsKnownNames.indexOf("Hiding") >= 0;
					if (knowsHowToHide)
					{
						var perceptible = actor.perceptible();
						var isAlreadyHiding = perceptible.isHiding;
						if (isAlreadyHiding)
						{
							perceptible.isHiding = false;
						}
						else
						{
							perceptible.isHiding = true;
						}
					}
				}
			),

			new Action
			(
				"Jump",
				(universe, world, place, actor) => // perform
				{
					var learner = actor.skillLearner();
					var canJump = learner.skillsKnownNames.indexOf("Jumping") >= 0;
					if (canJump)
					{
						var loc = actor.locatable().loc;
						var isNotAlreadyJumping = (loc.pos.z >= 0);
						if (isNotAlreadyJumping)
						{
							// For unknown reasons, setting accel instead of vel
							// results in nondeterministic jump height,
							// or often no visible jump at all.
							loc.vel.z = -10;
						}
					}
				}
			),

			new Action
			(
				"Pick Up",
				(universe, world, place, entityActor) => // perform
				{
					var itemHolder = entityActor.itemHolder();
					var itemEntityToPickUp = itemHolder.itemEntityFindClosest
					(
						universe, world, place, entityActor
					);

					if (itemEntityToPickUp == null)
					{
						return;
					}

					var canPickUp = itemHolder.itemEntityCanPickUp
					(
						universe, world, place, entityActor, itemEntityToPickUp
					);

					if (canPickUp)
					{
						var actor = entityActor.actor();
						var activity = actor.activity;
						if (activity.defnName == ActivityDefn.Instances().Simultaneous.name)
						{
							var childActivities = activity.target ;
							var activityDefnName = "ItemPickUp";
							var activityPickUpExists = childActivities.some
							(
								x => x.defnName == activityDefnName
							);
							if (activityPickUpExists == false)
							{
								var activityPickUp = new Activity(activityDefnName, itemEntityToPickUp);
								childActivities.push(activityPickUp);
							}
						}
					}
					else
					{
						var message = "Can't pick up!";
						place.entitySpawn
						(
							universe, world,
							universe.entityBuilder.messageFloater
							(
								message,
								entityActor.locatable().loc.pos,
								Color.byName("Red")
							)
						);
					}
				}
			),

			new Action
			(
				"Recording Start/Stop",
				(universe, world, place, actor) => // perform
				{
					var recorder = universe.displayRecorder;
					if (recorder.isRecording)
					{
						recorder.stop();
						recorder.framesRecordedDownload(universe);
					}
					else
					{
						recorder.start();
					}
				}
			),

			new Action
			(
				"Run",
				(universe, world, place, actor) => // perform
				{
					var learner = actor.skillLearner();
					var knowsHowToRun = learner.skillsKnownNames.indexOf("Running") >= 0;
					// knowsHowToRun = true; // debug
					if (knowsHowToRun)
					{
						var loc = actor.locatable().loc;
						var isOnGround = (loc.pos.z >= 0);
						if (isOnGround)
						{
							var vel = loc.vel;
							var speedRunning = 4;
							var speedCurrent = vel.magnitude();
							if (speedCurrent > 0 && speedCurrent < speedRunning)
							{
								vel.multiplyScalar(speedRunning);
							}
						}
					}
				}
			),

			new Action
			(
				"Sneak",
				(universe, world, place, actor) => // perform
				{
					// var learner = actor.skillLearner();
					// var knowsHowToSneak = learner.skillsKnownNames.indexOf("Sneaking") >= 0;
					var knowsHowToSneak = true; // debug
					if (knowsHowToSneak)
					{
						var loc = actor.locatable().loc;
						var isOnGround = (loc.pos.z >= 0);
						if (isOnGround)
						{
							var vel = loc.vel;
							var speedSneaking = .5;
							vel.trimToMagnitudeMax(speedSneaking);
						}
					}
				}
			),

			new Action
			(
				"Use",
				(universe, world, place, actor) => // perform
				{
					var entityUsablesInPlace = place.usables();
					var actorPos = actor.locatable().loc.pos;
					var radiusOfReach = 20; // todo
					var entityUsablesWithinReach = entityUsablesInPlace.filter
					(
						x => x.locatable().loc.pos.clone().subtract(actorPos).magnitude() < radiusOfReach
					);
					if (entityUsablesWithinReach.length > 0)
					{
						var entityToUse = entityUsablesWithinReach[0];
						entityToUse.usable().use(universe, world, place, actor, entityToUse);
					}
				}
			),

			new Action
			(
				"Wait",
				(universe, world, place, actor) => // perform
				{
					actor.actor().activity.defnName = "Wait";
				}
			),
			new Action("Item0", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 0)),
			new Action("Item1", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 1)),
			new Action("Item2", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 2)),
			new Action("Item3", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 3)),
			new Action("Item4", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 4)),
			new Action("Item5", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 5)),
			new Action("Item6", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 6)),
			new Action("Item7", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 7)),
			new Action("Item8", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 8)),
			new Action("Item9", (u, w, p, e) => e.equipmentUser().useItemInSocketNumbered(u, w, p, e, 9)),
		];

		return actions;
	}

	actionToInputsMappingsBuild()
	{
		var inputNames = Input.Names();

		var inactivateFalse = false;
		var inactivateTrue = true;

		var actionToInputsMappings =
		[
			new ActionToInputsMapping("ShowMenu", [ inputNames.Escape, inputNames.Tab ], inactivateFalse),

			new ActionToInputsMapping("MoveDown", 	[ inputNames.ArrowDown, inputNames.GamepadMoveDown + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveLeft", 	[ inputNames.ArrowLeft, inputNames.GamepadMoveLeft + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveRight", 	[ inputNames.ArrowRight, inputNames.GamepadMoveRight + "0" ], inactivateFalse),
			new ActionToInputsMapping("MoveUp", 	[ inputNames.ArrowUp, inputNames.GamepadMoveUp + "0" ], inactivateFalse),

			new ActionToInputsMapping("Fire", 		[ "f", inputNames.Enter, inputNames.GamepadButton0 + "0" ], inactivateTrue),
			new ActionToInputsMapping("Hide", 		[ "h", inputNames.GamepadButton0 + "3" ], inactivateFalse),
			new ActionToInputsMapping("Jump", 		[ inputNames.Space, inputNames.GamepadButton0 + "1" ], inactivateTrue),
			new ActionToInputsMapping("Pick Up", 	[ "g", inputNames.GamepadButton0 + "4" ], inactivateTrue),
			new ActionToInputsMapping("Run", 		[ inputNames.Shift, inputNames.GamepadButton0 + "2" ], inactivateFalse),
			new ActionToInputsMapping("Sneak", 		[ inputNames.Control, inputNames.GamepadButton0 + "6" ], inactivateFalse),
			new ActionToInputsMapping("Use", 		[ "e", inputNames.GamepadButton0 + "5" ], inactivateTrue),
			new ActionToInputsMapping("Wait", 		[ "w" ], inactivateTrue),

			new ActionToInputsMapping("Item0", 	[ "_0" ], inactivateTrue),
			new ActionToInputsMapping("Item1", 	[ "_1" ], inactivateTrue),
			new ActionToInputsMapping("Item2", 	[ "_2" ], inactivateTrue),
			new ActionToInputsMapping("Item3", 	[ "_3" ], inactivateTrue),
			new ActionToInputsMapping("Item4", 	[ "_4" ], inactivateTrue),
			new ActionToInputsMapping("Item5", 	[ "_5" ], inactivateTrue),
			new ActionToInputsMapping("Item6", 	[ "_6" ], inactivateTrue),
			new ActionToInputsMapping("Item7", 	[ "_7" ], inactivateTrue),
			new ActionToInputsMapping("Item8", 	[ "_8" ], inactivateTrue),
			new ActionToInputsMapping("Item9", 	[ "_9" ], inactivateTrue),

			new ActionToInputsMapping("Recording Start/Stop", [ "`" ], inactivateTrue),
		];

		return actionToInputsMappings;
	}

	activityDefnsBuild()
	{
		var activityDefns = [];
		activityDefns.push(...ActivityDefn.Instances()._All);
		activityDefns.push(this.activityDefnItemPickUpBuild());
		return activityDefns;
	}

	activityDefnItemPickUpBuild()
	{
		var activityDefnItemPickUp = new ActivityDefn
		(
			"ItemPickUp",
			// perform
			(universe, world, place, entityPickingUp, activity) =>
			{
				var itemEntityGettingPickedUp = activity.target ;

				var entityPickingUpLocatable = entityPickingUp.locatable();

				var itemLocatable = itemEntityGettingPickedUp.locatable();
				var distance =
					itemLocatable.approachOtherWithAccelerationAndSpeedMax //ToDistance
					(
						entityPickingUpLocatable, .5, 4 //, 1
					);
				itemLocatable.loc.orientation.default(); // hack

				if (distance < 1)
				{
					activity.isDone = true;

					var itemHolder = entityPickingUp.itemHolder();
					itemHolder.itemEntityPickUp
					(
						universe, world, place, entityPickingUp, itemEntityGettingPickedUp
					);

					var equipmentUser = entityPickingUp.equipmentUser();
					if (equipmentUser != null)
					{
						equipmentUser.equipItemEntityInFirstOpenQuickSlot
						(
							universe, world, place, entityPickingUp,
							itemEntityGettingPickedUp, true // includeSocketNameInMessage
						);
						equipmentUser.unequipItemsNoLongerHeld(entityPickingUp);
					}
				}
			}
		);

		return activityDefnItemPickUp;
	}
}
