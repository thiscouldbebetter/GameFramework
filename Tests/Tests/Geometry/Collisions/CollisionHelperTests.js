
class CollisionHelperTests extends TestFixture
{
	_collisionHelper;

	constructor()
	{
		super(CollisionHelperTests.name);
		var mockEnvironment = new MockEnvironment();
		var universe = mockEnvironment.universe;
		this._collisionHelper = universe.collisionHelper;
	}

	tests())[]
	{
		var tests =
		[
			this.collisionActiveClosest,
			this.collisionOfEntities,
			this.collisionOfColliders,

			/*
			// todo - These tests not yet implemented. 

			this.collisionsOfEntitiesCollidableInSets,
			this.doEntitiesCollide,
			this.doCollidersCollide,
			this.doesColliderContainOther,

			// Shapes.

			// collideEntitiesXAndY

			this.collideEntitiesBackUp,
			this.collideEntitiesBlock,
			this.collideEntitiesBounce,
			this.collideEntitiesBlockOrBounce,
			this.collideEntitiesSeparate,

			// collisionOfXAndY

			this.collisionOfBoxAndBox,
			this.collisionOfBoxAndBoxRotated,
			this.collisionOfBoxAndMapLocated,
			this.collisionOfBoxAndMesh,
			this.collisionOfBoxAndSphere,
			this.collisionOfBoxRotatedAndBox,
			this.collisionOfBoxRotatedAndBoxRotated,
			this.collisionOfBoxRotatedAndMapLocated,
			this.collisionOfBoxRotatedAndSphere,
			this.collisionOfEdgeAndEdge,
			this.collisionOfEdgeAndFace,
			this.collisionsOfEdgeAndMesh,
			this.collisionOfEdgeAndPlane,
			this.collisionOfHemispaceAndBox,
			this.collisionOfHemispaceAndSphere,
			this.collisionOfMapLocatedAndBox,
			this.collisionOfMapLocatedAndBoxRotated,
			this.collisionOfMapLocatedAndMapLocated,
			this.collisionOfMapLocatedAndSphere,
			this.collisionOfMeshAndBox,
			this.collisionOfMeshAndSphere,
			this.collisionOfShapeAndShapeGroupAll,
			this.collisionOfShapeAndShapeInverse,
			this.collisionOfShapeGroupAllAndShape,
			this.collisionOfShapeInverseAndShape,
			this.collisionOfSphereAndBox,
			this.collisionOfSphereAndBoxRotated,
			this.collisionOfSphereAndMapLocated,
			this.collisionOfSphereAndMesh,
			this.collisionOfSpheres,

			// doXAndYCollide

			this.doBoxAndBoxCollide,
			this.doBoxAndBoxRotatedCollide,
			this.doBoxAndCylinderCollide,
			this.doBoxAndHemispaceCollide,
			this.doBoxAndMapLocatedCollide,
			this.doBoxAndMeshCollide,
			this.doBoxAndShapeInverseCollide,
			this.doBoxAndShapeGroupAllCollide,
			this.doBoxAndSphereCollide,
			this.doBoxRotatedAndBoxCollide,
			this.doBoxRotatedAndBoxRotatedCollide,
			this.doBoxRotatedAndMapLocatedCollide,
			this.doBoxRotatedAndSphereCollide,
			this.doCylinderAndCylinderCollide,
			this.doEdgeAndFaceCollide,
			this.doEdgeAndHemispaceCollide,
			this.doEdgeAndMeshCollide,
			this.doEdgeAndPlaneCollide,
			this.doHemispaceAndBoxCollide,
			this.doHemispaceAndSphereCollide,
			this.doMeshAndBoxCollide,
			this.doMeshAndMeshCollide,
			this.doMeshAndShapeInverseCollide,
			this.doMapLocatedAndBoxCollide,
			this.doMapLocatedAndBoxRotatedCollide,
			this.doMapLocatedAndMapLocatedCollide,
			this.doMapLocatedAndSphereCollide,
			this.doMeshAndSphereCollide,
			this.doSphereAndBoxCollide,
			this.doSphereAndMapLocatedCollide,
			this.doSphereAndMeshCollide,
			this.doSphereAndBoxRotatedCollide,
			this.doSphereAndShapeContainerCollide,
			this.doSphereAndShapeGroupAllCollide,
			this.doSphereAndShapeGroupAnyCollide,
			this.doSphereAndShapeInverseCollide,
			this.doSphereAndSphereCollide,

			// boolean combinations

			this.doShapeGroupAllAndBoxCollide,
			this.doShapeGroupAllAndShapeCollide,
			this.doShapeGroupAllAndMeshCollide,
			this.doShapeGroupAnyAndBoxCollide,
			this.doShapeGroupAnyAndShapeCollide,
			this.doShapeContainerAndShapeCollide,
			this.doShapeContainerAndBoxCollide,
			this.doShapeInverseAndMeshCollide,
			this.doShapeInverseAndShapeCollide,
			this.doShapeGroupAllAndSphereCollide,
			this.doBoxAndShapeGroupAnyCollide,
			this.doShapeContainerAndSphereCollide,
			this.doShapeGroupAnyAndSphereCollide,
			this.doShapeInverseAndBoxCollide,
			this.doShapeInverseAndSphereCollide,

			// contains

			this.doesBoxContainBox,
			this.doesBoxContainHemispace,
			this.doesBoxContainSphere,
			this.doesHemispaceContainBox,
			this.doesHemispaceContainSphere,
			this.doesSphereContainBox,
			this.doesSphereContainHemispace,
			this.doesSphereContainSphere

			*/

		];

		return tests;
	}

	collisionActiveClosest()
	{
		var posNear = Coords.fromXY(1, 0);
		var posMidrange = Coords.fromXY(2, 0);
		var posFar = Coords.fromXY(3, 0);

		var collisionNear = Collision.fromPosAndDistance(posNear, posNear.x);
		var collisionMidrange = Collision.fromPosAndDistance(posMidrange, posMidrange.x);
		var collisionFar = Collision.fromPosAndDistance(posFar, posFar.x);

		var collisionsToCheck =
			[ collisionNear, collisionMidrange, collisionFar ];

		collisionsToCheck.forEach(x => x.isActive = true);

		var collisionActiveClosest =
			this._collisionHelper.collisionActiveClosest(collisionsToCheck);

		Assert.areEqual(collisionNear, collisionActiveClosest);
	}

	collisionOfEntities()
	{
		var colliderRadius = 10;
		var collider = new Sphere(Coords.create(), colliderRadius);
		var entity0 = new Entity
		(
			"Entity0",
			[
				Collidable.fromCollider(collider),
				Locatable.fromPos(Coords.create())
			]
		);

		var entity1Pos = Coords.create();
		var entity1 = new Entity
		(
			"Entity1",
			[
				Collidable.fromCollider(collider),
				Locatable.fromPos(entity1Pos)
			]
		);

		var collision = this._collisionHelper.collisionOfEntities
		(
			entity0, entity1, Collision.create()
		);
		Assert.areEqual(entity1Pos, collision.pos);
	}

	collisionOfColliders()
	{
		var colliderRadius = 10;
		var collider0 = new Sphere(Coords.create(), colliderRadius);
		var collider1 = new Sphere(Coords.create(), colliderRadius);

		var collision = this._collisionHelper.collisionOfColliders
		(
			collider0, collider1, Collision.create()
		);
		Assert.areEqual(collider0.center, collision.pos);
	}

	collisionsOfEntitiesCollidableInSets()
	{
		// todo
		// entitiesCollidable0, entitiesCollidable1
	}

	doEntitiesCollide()
	{
		// todo
		// entity0, entity1
	}

	doCollidersCollide()
	{
		// todo
		// collider0, collider1
	}

	doesColliderContainOther()
	{
		// todo
		// collider0, collider1
	}

	// Shapes.

	// collideEntitiesXAndY

	collideEntitiesBackUp()
	{
		// todo
		// entity0, entity1
	}

	collideEntitiesBlock()
	{
		// todo
		// entity0, entity1
	}

	collideEntitiesBounce()
	{
		// todo
		// entity0, entity1
	}

	collideEntitiesBlockOrBounce()
	{
		// todo
		// entity0, entity1, coefficientOfRestitution
	}

	collideEntitiesSeparate()
	{
		// todo
		// entity0, entity1
	}

	// collisionOfXAndY

	collisionOfBoxAndBox()
	{
		// todo
		// box1, box2, collision
	}

	collisionOfBoxAndBoxRotated()
	{
		// todo
		// box, boxRotated, collision, shouldCalculatePos
	}

	collisionOfBoxAndMapLocated()
	{
		// todo
		// box, mapLocated, collision
	}

	collisionOfBoxAndMesh()
	{
		// todo
		// box, mesh, collision
	}

	collisionOfBoxAndSphere()
	{
		// todo
		// box, sphere, collision, shouldCalculatePos
	}

	collisionOfBoxRotatedAndBox()
	{
		// todo
		// boxRotated, box, collision, shouldCalculatePos
	}

	collisionOfBoxRotatedAndBoxRotated()
	{
		// todo
		// boxRotated0, boxRotated1, collision, shouldCalculatePos
	}

	collisionOfBoxRotatedAndMapLocated()
	{
		// todo
		// boxRotated, mapLocated, collision, shouldCalculatePos
	}

	collisionOfBoxRotatedAndSphere()
	{
		// todo
		// boxRotated, sphere, collision, shouldCalculatePos
	}

	collisionOfEdgeAndEdge()
	{
		// todo
		// edge0, edge1, collision
	}

	collisionOfEdgeAndFace()
	{
		// todo
		// edge, face, collision
	}

	collisionsOfEdgeAndMesh()
	{
		// todo
		// edge, mesh, collisions, stopAfterFirst
	}

	collisionOfEdgeAndPlane()
	{
		// todo
		// edge, plane, collision)
	}

	collisionOfHemispaceAndBox()
	{
		// todo
		// hemispace, box, collision)
	}

	collisionOfHemispaceAndSphere()
	{
		// todo
		// hemispace, sphere, collision
	}

	collisionOfMapLocatedAndBox()
	{
		// todo
		// mapLocated, box, collision
	}

	collisionOfMapLocatedAndBoxRotated()
	{
		// todo
		/*
		mapLocated, boxRotated,
		collision, shouldCalculateCollisionPos
		*/
	}

	collisionOfMapLocatedAndMapLocated()
	{
		// todo
		// mapLocated0, mapLocated1, collision
	}

	collisionOfMapLocatedAndSphere()
	{
		// todo
		// mapLocated, sphere, collision
	}

	collisionOfMeshAndBox()
	{
		// todo
		// mesh, box, collision)
	}

	collisionOfMeshAndSphere()
	{
		// todo
		// mesh, sphere, collision)
	}

	collisionOfShapeAndShapeGroupAll()
	{
		// todo
		// shape, shapeGroupAll, collisionOut)
	}

	collisionOfShapeAndShapeInverse()
	{
		// todo
		// shape, shapeInverse, collisionOut)
	}

	collisionOfShapeGroupAllAndShape()
	{
		// todo
		// shapeGroupAll, shape, collisionOut)
	}

	collisionOfShapeInverseAndShape()
	{
		// todo
		// shapeInverse, shape, collisionOut)
	}

	collisionOfSphereAndBox()
	{
		// todo
		// sphere, box, collision, shouldCalculatePos)
	}

	collisionOfSphereAndBoxRotated()
	{
		// todo
		// sphere, boxRotated, collision, shouldCalculatePos)
	}

	collisionOfSphereAndMapLocated()
	{
		// todo
		// sphere, mapLocated, collision)
	}

	collisionOfSphereAndMesh()
	{
		// todo
		// sphere, mesh, collision)
	}

	collisionOfSpheres()
	{
		// todo
		// sphere0, sphere1, collision)
	}

	// doXAndYCollide

	doBoxAndBoxCollide()
	{
		// todo
		// box0, box1)
	}

	doBoxAndBoxRotatedCollide()
	{
		// todo
		// box, boxRotated)
	}

	doBoxAndCylinderCollide()
	{
		// todo
		// box, cylinder)
	}

	doBoxAndHemispaceCollide()
	{
		// todo
		// box, hemispace)
	}

	doBoxAndMapLocatedCollide()
	{
		// todo
		// box, mapLocated)
	}

	doBoxAndMeshCollide()
	{
		// todo - box, mesh)
	}

	doBoxAndShapeInverseCollide()
	{
		// todo - box, shapeInverse)
	}

	doBoxAndShapeGroupAllCollide()
	{
		// todo - box, shapeGroupAll)
	}

	doBoxAndSphereCollide()
	{
		// todo - box, sphere)
	}

	doBoxRotatedAndBoxCollide()
	{
		// todo - boxRotated, box)
	}

	doBoxRotatedAndBoxRotatedCollide()
	{
		// todo - boxRotated0, boxRotated1)
	}

	doBoxRotatedAndMapLocatedCollide()
	{
		// todo - boxRotated, mapLocated)
	}

	doBoxRotatedAndSphereCollide()
	{
		// todo - boxRotated, sphere)
	}

	doCylinderAndCylinderCollide()
	{
		// todo - cylinder0, cylinder1)
	}

	doEdgeAndFaceCollide()
	{
		// todo - edge, face, collision)
	}

	doEdgeAndHemispaceCollide()
	{
		// todo - edge, hemispace)
	}

	doEdgeAndMeshCollide()
	{
		// todo - edge, mesh)
	}

	doEdgeAndPlaneCollide()
	{
		// todo - edge, plane)
	}

	doHemispaceAndBoxCollide()
	{
		// todo - hemispace, box)
	}

	doHemispaceAndSphereCollide()
	{
		// todo - hemispace, sphere)
	}

	doMeshAndBoxCollide()
	{
		// todo - mesh, box)
	}

	doMeshAndMeshCollide()
	{
		// todo - mesh0, mesh1)
	}

	doMeshAndShapeInverseCollide()
	{
		// todo - mesh, inverse)
	}

	doMapLocatedAndBoxCollide()
	{
		// todo - mapLocated, box)
	}

	doMapLocatedAndBoxRotatedCollide()
	{
		// todo - mapLocated, boxRotated)
	}

	doMapLocatedAndMapLocatedCollide()
	{
		// todo - mapLocated0, mapLocated1)
	}

	doMapLocatedAndSphereCollide()
	{
		// todo - mapLocated, sphere)
	}

	doMeshAndSphereCollide()
	{
		// todo - mesh, sphere)
	}

	doSphereAndBoxCollide()
	{
		// todo - sphere, box)
	}

	doSphereAndMapLocatedCollide()
	{
		// todo - sphere, mapLocated)
	}

	doSphereAndMeshCollide()
	{
		// todo - sphere, mesh)
	}

	doSphereAndBoxRotatedCollide()
	{
		// todo - sphere, boxRotated)
	}

	doSphereAndShapeContainerCollide()
	{
		// todo - sphere, shapeContainer)
	}

	doSphereAndShapeGroupAllCollide()
	{
		// todo - sphere, shapeGroupAll)
	}

	doSphereAndShapeGroupAnyCollide()
	{
		// todo - sphere, shapeGroupAny)
	}

	doSphereAndShapeInverseCollide()
	{
		// todo - sphere, shapeInverse)
	}

	doSphereAndSphereCollide()
	{
		// todo - sphere0, sphere1)
	}

	// boolean combinations

	doShapeGroupAllAndBoxCollide()
	{
		// todo - groupAll, shapeOther)
	}

	doShapeGroupAllAndShapeCollide()
	{
		// todo - groupAll, shapeOther)
	}

	doShapeGroupAllAndMeshCollide()
	{
		// todo - groupAll, mesh)
	}

	doShapeGroupAnyAndBoxCollide()
	{
		// todo - groupAny, box)
	}

	doShapeGroupAnyAndShapeCollide()
	{
		// todo - groupAny, shapeOther)
	}

	doShapeContainerAndShapeCollide()
	{
		// todo - container, shapeOther)
	}

	doShapeContainerAndBoxCollide()
	{
		// todo - container, box)
	}

	doShapeInverseAndMeshCollide()
	{
		// todo - inverse, mesh)
	}

	doShapeInverseAndShapeCollide()
	{
		// todo - inverse, shapeOther)
	}

	doShapeGroupAllAndSphereCollide()
	{
		// todo - group, shape)
	}

	doBoxAndShapeGroupAnyCollide()
	{
		// todo - box, group)
	}

	doShapeContainerAndSphereCollide()
	{
		// todo - container, sphere)
	}

	doShapeGroupAnyAndSphereCollide()
	{
		// todo - group, sphere)
	}

	doShapeInverseAndBoxCollide()
	{
		// todo - inverse, box)
	}

	doShapeInverseAndSphereCollide()
	{
		// todo - inverse, sphere)
	}

	// contains

	doesBoxContainBox()
	{
		// todo - box0, box1)
	}

	doesBoxContainHemispace()
	{
		// todo - box, hemispace
	}

	doesBoxContainSphere()
	{
		// todo - box, sphere)
	}

	doesHemispaceContainBox()
	{
		// todo - hemispace, box)
	}

	doesHemispaceContainSphere()
	{
		// todo - hemispace, sphere)
	}

	doesSphereContainBox()
	{
		// todo - sphere, box)
	}

	doesSphereContainHemispace()
	{
		// todo - sphere, hemispace)
	}

	doesSphereContainSphere()
	{
		// todo - sphere0, sphere1)
	}
}
