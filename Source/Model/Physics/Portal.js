

class Portal extends EntityProperty
{
	destinationPlaceName;
	destinationEntityName;
	velocityToApply;

	constructor
	(
		destinationPlaceName, destinationEntityName,
		velocityToApply
	)
	{
		super();
		this.destinationPlaceName = destinationPlaceName;
		this.destinationEntityName = destinationEntityName;
		this.velocityToApply = velocityToApply;
	}

	use(universe, world, placeToDepart, entityToTransport, entityPortal)
	{
		var entityPortalCollidable = entityPortal.collidable();
		entityPortalCollidable.ticksUntilCanCollide = 40; // hack

		var portal = entityPortal.portal();
		var venueCurrent = universe.venueCurrent;
		var messageBoxSize = universe.display.sizeDefault();
		var venueMessage = new VenueMessage
		(
			new DataBinding("Portal to: " + portal.destinationPlaceName, null, null),
			(universe) => // acknowledge
			{
				portal.transport
				(
					universe, universe.world, universe.world.placeCurrent,
					entityToTransport, entityPortal
				);
				universe.venueNext = new VenueFader(venueCurrent, null, null, null);
			},
			venueCurrent, // venuePrev
			messageBoxSize,
			true // showMessageOnly
		);
		universe.venueNext = venueMessage;
	}

	transport(universe, world, placeToDepart, entityToTransport, entityPortal)
	{
		var destinationPlace = world.placesByName.get(this.destinationPlaceName);
		destinationPlace.initialize(universe, world);
		var destinationEntity = destinationPlace.entitiesByName.get(this.destinationEntityName);
		var destinationCollidable = destinationEntity.collidable();
		if (destinationCollidable != null)
		{
			destinationCollidable.ticksUntilCanCollide = 50; // hack
		}
		var destinationPos = destinationEntity.locatable().loc.pos;

		var entityToTransportLoc = entityToTransport.locatable().loc;
		var entityToTransportPos = entityToTransportLoc.pos;

		world.placeNext = destinationPlace;
		entityToTransportPos.overwriteWith(destinationPos);
		entityToTransport.collidable().entitiesAlreadyCollidedWith.push(destinationEntity);

		if (this.velocityToApply != null)
		{
			entityToTransportLoc.vel.overwriteWith(this.velocityToApply);
		}

		placeToDepart.entitiesToRemove.push(entityToTransport);
		destinationPlace.entitiesToSpawn.push(entityToTransport);
	}

	clone()
	{
		return new Portal
		(
			this.destinationPlaceName,
			this.destinationEntityName,
			this.velocityToApply == null ? null : this.velocityToApply.clone()
		);
	}
}
