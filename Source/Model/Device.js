
function Device(name, ticksToCharge, use)
{
	this.name = name;
	this.ticksToCharge = ticksToCharge;
	this.use = use;

	this.tickLastUsed = 0;
}

{
	// static methods

	Device.gun = function()
	{
		var returnValue = new Device
		(
			"Gun",
			10, // ticksToCharge
			function use(universe, world, place, actor, entityDevice, device)
			{
				if (device.ticksSinceUsed(world) < device.ticksToCharge)
				{
					return;
				}

				var actorAsItemHolder = actor.ItemHolder;
				var hasAmmo = actorAsItemHolder.hasItemWithDefnNameAndQuantity("Ammo", 1);
				if (hasAmmo == false)
				{
					return;
				}

				actorAsItemHolder.itemSubtractDefnNameAndQuantity("Ammo", 1);

				device.tickLastUsedUpdate(world);

				var actorLoc = actor.Locatable.loc;
				var actorPos = actorLoc.pos;
				var actorVel = actorLoc.vel;
				var actorSpeed = actorVel.magnitude();
				if (actorSpeed == 0) { return; }

				var projectileColor = "Cyan";
				var projectileRadius = 3;
				var projectileVisual = new VisualGroup
				([
					new VisualEllipse
					(
						projectileRadius * 2, // semimajorAxis,
						projectileRadius, // semiminorAxis,
						0, // rotationInTurns,
						projectileColor // colorFill
					),
					new VisualOffset
					(
						new VisualText("Projectile", projectileColor),
						new Coords(0, projectileRadius)
					)
				]);
				projectileVisual = new VisualCamera
				(
					projectileVisual,
					(universe, world) => world.placeCurrent.camera()
				);

				var actorDirection = actorVel.clone().normalize();
				var actorRadius = actor.Collidable.collider.radius;
				var projectilePos = actorPos.clone().add
				(
					actorDirection.clone().multiplyScalar(actorRadius).double().double()
				);
				var projectileOri = new Orientation
				(
					actorVel.clone().normalize()
				);
				var projectileLoc = new Location(projectilePos, projectileOri);
				projectileLoc.vel.overwriteWith(actorVel).double();

				var projectileCollider =
					new Sphere(new Coords(0, 0), projectileRadius);

				var projectileCollide = function(universe, world, place, entityPlayer, entityOther)
				{
					if (entityOther.Killable != null)
					{
						place.entitiesToRemove.push(entityOther);
					}
				};

				var projectileEntity = new Entity
				(
					"Projectile",
					[
						new Damager(1),
						new Ephemeral(32),
						new Locatable( projectileLoc ),
						new Collidable
						(
							projectileCollider,
							[ Killable.name ],
							projectileCollide
						),
						new Drawable(projectileVisual)
					]
				);

				place.entitiesToSpawn.push(projectileEntity);
			}
		);

		return returnValue;
	};

	// instance methods

	Device.prototype.tickLastUsedUpdate = function(world)
	{
		this.tickLastUsed = world.timerTicksSoFar;
	};

	Device.prototype.ticksSinceUsed = function(world)
	{
		return world.timerTicksSoFar - this.tickLastUsed;
	};

	// clonable

	Device.prototype.clone = function()
	{
		return new Device(this.name, this.ticksToCharge, this.energyToUse, this.use);
	};
}
