

class CollisionHelper
{
	throwErrorIfCollidersCannotBeCollided;
	colliderTypeNamesToDoCollideLookup;
	colliderTypeNamesToDoesContainLookup;
	colliderTypeNamesToCollisionFindLookup;

	_box;
	_collision;
	_displacement;
	_polar;
	_pos;
	_range;
	_range2;
	_size;

	constructor()
	{
		this.throwErrorIfCollidersCannotBeCollided = true;

		this.colliderTypeNamesToDoCollideLookup = this.doCollideLookupBuild();
		this.colliderTypeNamesToDoesContainLookup = this.doesContainLookupBuild();
		this.colliderTypeNamesToCollisionFindLookup = this.collisionFindLookupBuild();

		// Helper variables.
		this._box = Box.create();
		this._collision = Collision.create();
		this._displacement = Coords.create();
		this._polar = Polar.create();
		this._pos = Coords.create();
		this._range = RangeExtent.create();
		this._range2 = RangeExtent.create();
		this._size = Coords.create();
	}

	// constructor helpers

	collisionFindLookupBuild()
	{
		var lookupOfLookups = new Map();
		var lookup;

		var notDefined = "undefined"; // todo

		var boxName = ( typeof Box == notDefined ? null : Box.name );
		var boxRotatedName = ( typeof BoxRotated == notDefined ? null : BoxRotated.name );
		var mapLocatedName = ( typeof MapLocated == notDefined ? null : MapLocated.name );
		var meshName = ( typeof Mesh == notDefined ? null : Mesh.name );
		var shapeGroupAllName = (typeof ShapeGroupAll == notDefined ? null : ShapeGroupAll.name);
		var shapeInverseName = (typeof ShapeInverse == notDefined ? null : ShapeInverse.name);
		var sphereName = ( typeof Sphere == notDefined ? null : Sphere.name );

		if (boxName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfBoxAndBox);
			lookup.set(mapLocatedName, this.collisionOfBoxAndMapLocated);
			lookup.set(meshName, this.collisionOfBoxAndMesh);
			lookup.set(shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll);
			lookup.set(shapeInverseName, this.collisionOfShapeAndShapeInverse);
			lookup.set(sphereName, this.collisionOfBoxAndSphere);
			lookupOfLookups.set(boxName, lookup);
		}

		if (mapLocatedName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfMapLocatedAndBox);
			lookup.set(shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll);
			lookup.set(sphereName, this.collisionOfMapLocatedAndSphere);
			lookupOfLookups.set(mapLocatedName, lookup);
		}

		if (meshName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfMeshAndBox);
			lookup.set(shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll);
			lookup.set(shapeInverseName, this.collisionOfShapeAndShapeInverse);
			lookup.set(sphereName, this.collisionOfMeshAndSphere);
			lookupOfLookups.set(meshName, lookup);
		}

		if (shapeGroupAllName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfShapeGroupAllAndShape);
			lookup.set(sphereName, this.collisionOfShapeGroupAllAndShape);
			lookupOfLookups.set(shapeGroupAllName, lookup);
		}

		if (shapeInverseName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfShapeInverseAndShape);
			lookup.set(meshName, this.collisionOfShapeInverseAndShape);
			lookup.set(sphereName, this.collisionOfShapeInverseAndShape);
			lookupOfLookups.set(shapeInverseName, lookup);
		}

		if (sphereName != null)
		{
			lookup = new Map();
			lookup.set(boxName, this.collisionOfSphereAndBox);
			lookup.set(boxRotatedName, this.collisionOfSphereAndBoxRotated);
			lookup.set(mapLocatedName, this.collisionOfSphereAndMapLocated);
			lookup.set(meshName, this.collisionOfSphereAndMesh);
			lookup.set(shapeGroupAllName, this.collisionOfShapeAndShapeGroupAll);
			lookup.set(shapeInverseName, this.collisionOfShapeAndShapeInverse);
			lookup.set(sphereName, this.collisionOfSpheres);
			lookupOfLookups.set(sphereName, lookup);
		}

		return lookupOfLookups;
	}

	doCollideLookupBuild()
	{
		var lookupOfLookups = new Map();

		var andText = "And";
		var collideText = "Collide";
		var doText = "do";

		var functionNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		var functionNamesDoCollide = functionNames.filter(
			x => x.startsWith(doText) && x.endsWith(collideText) && x.indexOf(andText) >= 0
		);

		for (var i = 0; i < functionNamesDoCollide.length; i++)
		{
			var functionName = functionNamesDoCollide[i];

			var colliderTypeNamesAsString = functionName.substr
			(
				doText.length,
				functionName.length - doText.length - collideText.length
			);

			var colliderTypeNames = colliderTypeNamesAsString.split(andText);
			var colliderTypeName0 = colliderTypeNames[0];
			var colliderTypeName1 = colliderTypeNames[1];

			var lookup = lookupOfLookups.get(colliderTypeName0);
			if (lookup == null)
			{
				lookup = new Map();
				lookupOfLookups.set(colliderTypeName0, lookup);
			}
			var thisAsAny = this ;
			var doCollideFunction = thisAsAny[functionName];
			lookup.set(colliderTypeName1, doCollideFunction);
		}

		return lookupOfLookups;
	}

	doesContainLookupBuild()
	{
		var lookupOfLookups = new Map();

		var containText = "Contain";
		var doesText = "does";

		var functionNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		var functionNamesDoesContain = functionNames.filter(
			x => x.startsWith(doesText) && x.indexOf(containText) >= 0
		);

		for (var i = 0; i < functionNamesDoesContain.length; i++)
		{
			var functionName = functionNamesDoesContain[i];

			var colliderTypeNamesAsString = functionName.substr
			(
				doesText.length
			);

			var colliderTypeNames = colliderTypeNamesAsString.split(containText);
			var colliderTypeName0 = colliderTypeNames[0];
			var colliderTypeName1 = colliderTypeNames[1];

			var lookup = lookupOfLookups.get(colliderTypeName0);
			if (lookup == null)
			{
				lookup = new Map();
				lookupOfLookups.set(colliderTypeName0, lookup);
			}
			var thisAsAny = this ;
			var doesContainFunction = thisAsAny[functionName];
			lookup.set(colliderTypeName1, doesContainFunction);
		}

		return lookupOfLookups;
	}

	// instance methods

	collisionClosest(collisionsToCheck)
	{
		var returnValue = collisionsToCheck.filter
		(
			x => x.isActive
		).sort
		(
			(x, y) => x.distanceToCollision - y.distanceToCollision
		)[0];

		return returnValue;
	}

	collisionOfEntities(entityColliding, entityCollidedWith, collisionOut)
	{
		var collider0 = entityColliding.collidable().collider;
		var collider1 = entityCollidedWith.collidable().collider;

		return this.collisionOfColliders(collider0, collider1, collisionOut);
	}

	collisionOfColliders(collider0, collider1, collisionOut)
	{
		collisionOut.isActive = false;

		// Prevents having to add some composite shapes, for example, Shell.
		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var collideLookup =
			this.colliderTypeNamesToCollisionFindLookup.get(collider0TypeName);
		if (collideLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error!  Colliders of types cannot be collided: " + collider0TypeName + "," + collider1TypeName;
			}
		}
		else
		{
			var collisionMethod = collideLookup.get(collider1TypeName);
			if (collisionMethod == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error!  Colliders of types cannot be collided: " + collider0TypeName + "," + collider1TypeName;
				}
			}
			else
			{
				collisionMethod.call
				(
					this, collider0, collider1, collisionOut, true // shouldCalculatePos
				);
			}
		}

		return collisionOut;
	}

	collisionsOfEntitiesCollidableInSets(entitiesCollidable0, entitiesCollidable1)
	{
		var returnValues = [];

		for (var i = 0; i < entitiesCollidable0.length; i++)
		{
			var entity0 = entitiesCollidable0[i];

			for (var j = 0; j < entitiesCollidable1.length; j++)
			{
				var entity1 = entitiesCollidable1[j];

				var doCollide = this.doEntitiesCollide(entity0, entity1);

				if (doCollide)
				{
					var collision = Collision.create();
					collision.collidables.push(entity0);
					collision.collidables.push(entity1);
					returnValues.push(collision);
				}
			}
		}

		return returnValues;
	}

	doEntitiesCollide(entity0, entity1)
	{
		var doCollidersCollide = false;

		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var collider0 = collidable0.collider;
		var collider1 = collidable1.collider;

		doCollidersCollide = this.doCollidersCollide(collider0, collider1);

		return doCollidersCollide;
	}

	doCollidersCollide(collider0, collider1)
	{
		var returnValue = false;

		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var doCollideLookup =
			this.colliderTypeNamesToDoCollideLookup.get(collider0TypeName);
		if (doCollideLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
			}
		}
		else
		{
			var collisionMethod = doCollideLookup.get(collider1TypeName);
			if (collisionMethod == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
				}
			}
			else
			{
				returnValue = collisionMethod.call
				(
					this, collider0, collider1
				);
			}
		}

		return returnValue;
	}

	doesColliderContainOther(collider0, collider1)
	{
		var returnValue = false;

		while (collider0.collider != null)
		{
			collider0 = collider0.collider();
		}

		while (collider1.collider != null)
		{
			collider1 = collider1.collider();
		}

		var collider0TypeName = collider0.constructor.name;
		var collider1TypeName = collider1.constructor.name;

		var doesContainLookup =
			this.colliderTypeNamesToDoesContainLookup.get(collider0TypeName);
		if (doesContainLookup == null)
		{
			if (this.throwErrorIfCollidersCannotBeCollided)
			{
				throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
			}
		}
		else
		{
			var doesColliderContainOther = doesContainLookup.get(collider1TypeName);
			if (doesColliderContainOther == null)
			{
				if (this.throwErrorIfCollidersCannotBeCollided)
				{
					throw "Error: Colliders of types cannot be collided: " + collider0TypeName + ", " + collider1TypeName;
				}
			}
			else
			{
				returnValue = doesColliderContainOther.call
				(
					this, collider0, collider1
				);
			}
		}

		return returnValue;
	}

	// shapes

	// collideEntitiesXAndY

	collideEntitiesBackUp(entity0, entity1)
	{
		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var entity0Loc = entity0.locatable().loc;
		var entity1Loc = entity1.locatable().loc;

		var pos0 = entity0Loc.pos;
		var pos1 = entity1Loc.pos;

		var vel0 = entity0Loc.vel;
		var vel1 = entity1Loc.vel;

		var speed0 = vel0.magnitude();
		var speed1 = vel1.magnitude();
		var speedMax = Math.max(speed0, speed1);

		var vel0InvertedNormalized = vel0.clone().invert().normalize();
		var vel1InvertedNormalized = vel1.clone().invert().normalize();

		var distanceBackedUpSoFar = 0;

		while (this.doEntitiesCollide(entity0, entity1) && distanceBackedUpSoFar < speedMax)
		{
			distanceBackedUpSoFar++;

			pos0.add(vel0InvertedNormalized);
			pos1.add(vel1InvertedNormalized);

			collidable0.colliderLocateForEntity(entity0);
			collidable1.colliderLocateForEntity(entity1);
		}
	}

	collideEntitiesBlock(entity0, entity1)
	{
		// todo - Needs separation 
		this.collideEntitiesBlockOrBounce(entity0, entity1, 0); // coefficientOfRestitution
	}

	collideEntitiesBounce(entity0, entity1)
	{
		this.collideEntitiesBlockOrBounce(entity0, entity1, 1); // coefficientOfRestitution
	}

	collideEntitiesBlockOrBounce(entity0, entity1, coefficientOfRestitution)
	{
		var collisionPos = this.collisionOfEntities
		(
			entity0, entity1, this._collision
		).pos;

		var collidable0 = entity0.collidable();
		var collidable1 = entity1.collidable();

		var collider0 = collidable0.collider;
		var collider1 = collidable1.collider;

		var normal0 = collider0.normalAtPos
		(
			collisionPos, Coords.create() // normalOut
		);
		var normal1 = collider1.normalAtPos
		(
			collisionPos, Coords.create() // normalOut
		);

		var entity0Loc = entity0.locatable().loc;
		var entity1Loc = entity1.locatable().loc;

		var vel0 = entity0Loc.vel;
		var vel1 = entity1Loc.vel;

		var vel0DotNormal1 = vel0.dotProduct(normal1);
		var vel1DotNormal0 = vel1.dotProduct(normal0);

		var multiplierOfRestitution = 1 + coefficientOfRestitution;

		if (vel0DotNormal1 < 0)
		{
			var vel0Bounce = normal1.multiplyScalar
			(
				0 - vel0DotNormal1
			).multiplyScalar
			(
				multiplierOfRestitution
			);

			vel0.add(vel0Bounce);
			entity0Loc.orientation.forwardSet(vel0.clone().normalize());
		}

		if (vel1DotNormal0 < 0)
		{
			var vel1Bounce = normal0.multiplyScalar
			(
				0 - vel1DotNormal0
			).multiplyScalar
			(
				multiplierOfRestitution
			);
			vel1.add(vel1Bounce);
			entity1Loc.orientation.forwardSet(vel1.clone().normalize());
		}
	}

	collideEntitiesSeparate(entity0, entity1)
	{
		var entity0Loc = entity0.locatable().loc;
		var entity0Pos = entity0Loc.pos;
		var collidable1 = entity1.collidable();
		var collider1 = collidable1.collider;

		var collider1Normal = collider1.normalAtPos
		(
			entity0Pos, Coords.create() // normalOut
		);

		var distanceMovedSoFar = 0;
		var distanceToMoveMax = 10;

		while (this.doEntitiesCollide(entity0, entity1) && distanceMovedSoFar < distanceToMoveMax)
		{
			distanceMovedSoFar++;
			entity0Pos.add(collider1Normal);

			var collidable0 = entity0.collidable();
			collidable0.colliderLocateForEntity(entity0);
		}
	}

	// collisionOfXAndY

	collisionOfBoxAndBox(box1, box2, collision)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var boxOfIntersection = box1.intersectWith(box2);
		if (boxOfIntersection != null)
		{
			collision.isActive = true;
			collision.pos.overwriteWith(boxOfIntersection.center)
		}

		return collision;
	}

	collisionOfBoxAndMapLocated(box, mapLocated, collision)
	{
		var doBoundsCollide =
			this.doBoxAndBoxCollide(mapLocated.box, box);

		if (doBoundsCollide == false)
		{
			return collision;
		}

		var map = mapLocated.map;
		var cell= map.cellPrototype.clone();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = new Box( Coords.create(), map.cellSize );

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) ;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndBoxCollide = this.doBoxAndBoxCollide(cellAsBox, box);
					if (doCellAndBoxCollide)
					{
						collision.isActive = true;
						collision.pos.overwriteWith(cellAsBox.center);
						break;
					}
				}
			}
		}

		return collision;
	}

	collisionOfBoxAndMesh(box, mesh, collision)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		// hack
		var meshBoundsAsBox = mesh.box();

		var boxOfIntersection = box.intersectWith(meshBoundsAsBox);
		if (boxOfIntersection != null)
		{
			collision.isActive = true;
			collision.pos.overwriteWith(boxOfIntersection.center)
		}

		return collision;
	}

	collisionOfBoxAndSphere
	(
		box, sphere, collision, shouldCalculatePos
	)
	{
		var doCollide = false;

		var displacementBetweenCenters = this._displacement.overwriteWith
		(
			sphere.center
		).subtract
		(
			box.center
		);

		var displacementBetweenCentersAbsolute =
			displacementBetweenCenters.absolute();

		var boxSizeHalf = box.sizeHalf();
		var sphereRadius = sphere.radius;

		var doExtentsCollide =
		(
			displacementBetweenCentersAbsolute.x <= boxSizeHalf.x + sphereRadius
			&& displacementBetweenCentersAbsolute.y <= boxSizeHalf.y + sphereRadius
			&& displacementBetweenCentersAbsolute.z <= boxSizeHalf.z + sphereRadius
		);

		if (doExtentsCollide)
		{
			var isSphereNotAtCorner =
			(
				displacementBetweenCentersAbsolute.x < boxSizeHalf.x
				|| displacementBetweenCentersAbsolute.y < boxSizeHalf.y
				|| displacementBetweenCentersAbsolute.z < boxSizeHalf.z
			);

			if (isSphereNotAtCorner)
			{
				doCollide = true;
			}
			else
			{
				var distanceBetweenCenters =
					displacementBetweenCentersAbsolute.magnitude();
				var boxDiagonal = boxSizeHalf.magnitude();

				var doesSphereContainCornerOfBox =
				(
					distanceBetweenCenters < (boxDiagonal + sphereRadius)
				);

				doCollide = doesSphereContainCornerOfBox;
			}
		}

		if (collision == null)
		{
			collision = Collision.create();
		}

		collision.isActive = doCollide;

		if (doCollide && shouldCalculatePos)
		{
			// todo - Fix this.
			var boxCircumscribedAroundSphere = new Box
			(
				sphere.center,
				new Coords(1, 1, 1).multiplyScalar(sphere.radius * 2)
			);
			collision = this.collisionOfBoxAndBox(box, boxCircumscribedAroundSphere, collision);
		}

		return collision;
	}

	collisionOfBoxRotatedAndSphere
	(
		boxRotated, sphere, collision, shouldCalculatePos
	)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var doCollide = this.doBoxRotatedAndSphereCollide
		(
			boxRotated, sphere
		);

		if (doCollide)
		{
			var collisionPos = collision.pos;
			var rectangleCenter = boxRotated.box.center;
			var displacementBetweenCenters = collisionPos.overwriteWith
			(
				sphere.center
			).subtract
			(
				rectangleCenter
			);

			var distanceBetweenCenters = displacementBetweenCenters.magnitude();
			var distanceFromRectangleCenterToSphere =
				distanceBetweenCenters - sphere.radius;
			var displacementToSphere = displacementBetweenCenters.divideScalar
			(
				distanceBetweenCenters
			).multiplyScalar
			(
				distanceFromRectangleCenterToSphere
			);

			collisionPos = displacementToSphere.add(rectangleCenter);

			var normals = collision.normals;
			boxRotated.normalAtPos(collision.pos, normals[0]);
			normals[1].overwriteWith(normals[0]).invert();

			var colliders = collision.colliders;
			colliders[0] = boxRotated;
			colliders[1] = sphere;

			return collision;
		}

		return collision;
	}

	collisionOfEdgeAndEdge(edge0, edge1, collision)
	{
		// 2D

		if (collision == null)
		{
			collision = Collision.create();
		}
		collision.clear();

		var edge0Bounds = edge0.box();
		var edge1Bounds = edge1.box();

		var doBoundsOverlap = edge0Bounds.overlapsWithXY(edge1Bounds);

		if (doBoundsOverlap)
		{
			var edge0ProjectedOntoEdge1 = edge0.clone().projectOntoOther(edge1);
			var edgeProjectedVertices = edge0ProjectedOntoEdge1.vertices;
			var edgeProjectedVertex0 = edgeProjectedVertices[0];
			var edgeProjectedVertex1 = edgeProjectedVertices[1];

			var doesEdgeCrossLineOfOther =
				(edgeProjectedVertex0.y > 0 && edgeProjectedVertex1.y <= 0)
				|| (edgeProjectedVertex0.y <= 0 && edgeProjectedVertex1.y > 0);

			if (doesEdgeCrossLineOfOther)
			{
				var edgeProjectedDirection = edge0ProjectedOntoEdge1.direction();

				var distanceAlongEdge0ToLineOfEdge1 =
					0
					- edgeProjectedVertex0.y
					/ edgeProjectedDirection.y;

				var distanceAlongEdge1ToEdge0 =
					edgeProjectedVertex0.x + edgeProjectedDirection.x * distanceAlongEdge0ToLineOfEdge1;

				var doesEdgeCrossOtherWithinItsExtent =
				(
					distanceAlongEdge1ToEdge0 >= 0
					&& distanceAlongEdge1ToEdge0 <= edge1.length()
				);

				if (doesEdgeCrossOtherWithinItsExtent)
				{
					collision.isActive = true;
					collision.distanceToCollision = distanceAlongEdge0ToLineOfEdge1;
					collision.pos.overwriteWith
					(
						edge0.direction()
					).multiplyScalar
					(
						distanceAlongEdge0ToLineOfEdge1
					).add
					(
						edge0.vertices[0]
					);
					collision.colliders.push(edge1);
					collision.collidersByName.set(Edge.name, edge1);
				}

			} // end if (doesEdgeCrossLineOfOther)

		} // end if (doBoundsOverlap)

		return collision;
	}

	collisionOfEdgeAndFace(edge, face, collision)
	{
		var facePlane = face.plane();

		collision = this.collisionOfEdgeAndPlane
		(
			edge, facePlane, collision
		);

		if (collision.isActive)
		{
			var isWithinFace = face.containsPoint
			(
				collision.pos
			);

			collision.isActive = isWithinFace;

			if (isWithinFace)
			{
				collision.colliders.push(face);
				collision.collidersByName.set(Face.name, face);
			}
		}

		return collision;
	}

	collisionsOfEdgeAndMesh(edge, mesh, collisions, stopAfterFirst)
	{
		if (collisions == null)
		{
			collisions = [];
		}

		var meshFaces = mesh.faces();
		for (var i = 0; i < meshFaces.length; i++)
		{
			var meshFace = meshFaces[i];
			var collision = this.collisionOfEdgeAndFace(edge, meshFace, null);
			if (collision != null && collision.isActive)
			{
				collision.colliders.push(mesh);
				collision.collidersByName.set(Mesh.name, mesh);
				collisions.push(collision);
				if (stopAfterFirst)
				{
					break;
				}
			}
		}

		return collisions;
	}

	collisionOfEdgeAndPlane(edge, plane, collision)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var returnValue = collision;

		var edgeVertex0 = edge.vertices[0];
		var edgeDirection = edge.direction();

		var planeNormal = plane.normal;

		var edgeDirectionDotPlaneNormal = edgeDirection.dotProduct(planeNormal);
		var doesEdgeGoTowardPlane = (edgeDirectionDotPlaneNormal < 0);

		if (doesEdgeGoTowardPlane)
		{
			var distanceToCollision =
				(
					plane.distanceFromOrigin
					- planeNormal.dotProduct(edgeVertex0)
				)
				/ planeNormal.dotProduct(edgeDirection);

			var edgeLength = edge.length();

			if (distanceToCollision >= 0 && distanceToCollision <= edgeLength)
			{
				collision.isActive = true;

				collision.pos.overwriteWith
				(
					edgeDirection
				).multiplyScalar
				(
					distanceToCollision
				).add
				(
					edge.vertices[0]
				);

				collision.distanceToCollision = distanceToCollision;

				var colliders = returnValue.colliders;
				var collidersByName = returnValue.collidersByName;

				colliders.length = 0;
				collidersByName.clear();

				colliders.push(edge);
				collidersByName.set(Edge.name, edge);
				colliders.push(plane);
				collidersByName.set(Plane.name, plane);
			}
		}

		return returnValue;
	}

	collisionOfHemispaceAndBox(hemispace, box, collision)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var plane = hemispace.plane;
		var boxVertices = box.vertices();
		for (var i = 0; i < boxVertices.length; i++)
		{
			var vertex = boxVertices[i];
			var distanceOfVertexFromOriginAlongNormal =
				vertex.dotProduct(plane.normal);
			var distanceOfVertexAbovePlane =
				distanceOfVertexFromOriginAlongNormal
				- plane.distanceFromOrigin;
			if (distanceOfVertexAbovePlane < 0)
			{
				collision.isActive = true;
				plane.pointClosestToOrigin(collision.pos);
				collision.colliders.length = 0;
				collision.colliders.push(hemispace);
				break;
			}
		}

		return collision;
	}

	collisionOfHemispaceAndSphere(hemispace, sphere, collision)
	{
		if (collision == null)
		{
			collision = Collision.create();
		}

		var plane = hemispace.plane;
		var distanceOfSphereCenterFromOriginAlongNormal =
			sphere.center.dotProduct(plane.normal);
		var distanceOfSphereCenterAbovePlane =
			distanceOfSphereCenterFromOriginAlongNormal
			- plane.distanceFromOrigin;
		if (distanceOfSphereCenterAbovePlane < sphere.radius)
		{
			collision.isActive = true;
			plane.pointClosestToOrigin(collision.pos);
			collision.colliders.length = 0;
			collision.colliders.push(hemispace);
		}
		return collision;
	}

	collisionOfMapLocatedAndBox(mapLocated, box, collision)
	{
		return this.collisionOfBoxAndMapLocated(box, mapLocated, collision);
	}

	collisionOfMapLocatedAndSphere(mapLocated, sphere, collision)
	{
		var doBoundsCollide =
			this.doBoxAndSphereCollide(mapLocated.box, sphere);

		if (doBoundsCollide == false)
		{
			return collision;
		}

		var map = mapLocated.map;
		var cell= map.cellPrototype.clone();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = new Box( Coords.create(), map.cellSize );

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) ;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndSphereCollide = this.doBoxAndSphereCollide(cellAsBox, sphere);
					if (doCellAndSphereCollide)
					{
						collision.isActive = true;
						collision.pos.overwriteWith(cellAsBox.center);
						break;
					}
				}
			}
		}

		return collision;
	}

	collisionOfMeshAndBox(mesh, box, collision)
	{
		return this.collisionOfBoxAndMesh(box, mesh, collision);
	}

	collisionOfMeshAndSphere(mesh, sphere, collision)
	{
		// hack
		var meshBoundsAsBox = mesh.box();
		return this.collisionOfBoxAndSphere(meshBoundsAsBox, sphere, collision, true); // shouldCalculatePos
	}

	collisionOfShapeAndShapeGroupAll(shape, shapeGroupAll, collisionOut)
	{
		return this.collisionOfColliders(shape, shapeGroupAll.shapes[0], collisionOut);
	}

	collisionOfShapeAndShapeInverse(shape, shapeInverse, collisionOut)
	{
		return collisionOut; // todo
	}

	collisionOfShapeGroupAllAndShape(shapeGroupAll, shape, collisionOut)
	{
		return this.collisionOfShapeAndShapeGroupAll(shape, shapeGroupAll, collisionOut);
	}

	collisionOfShapeInverseAndShape(shapeInverse, shape, collisionOut)
	{
		return this.collisionOfShapeAndShapeInverse(shape, shapeInverse, collisionOut);
	}

	collisionOfSphereAndBox(sphere, box, collision, shouldCalculatePos)
	{
		return this.collisionOfBoxAndSphere(box, sphere, collision, shouldCalculatePos);
	}

	collisionOfSphereAndBoxRotated(sphere, boxRotated, collision, shouldCalculatePos)
	{
		return this.collisionOfBoxRotatedAndSphere(boxRotated, sphere, collision, shouldCalculatePos);
	}

	collisionOfSphereAndMapLocated(sphere, mapLocated, collision)
	{
		return this.collisionOfMapLocatedAndSphere(mapLocated, sphere, collision);
	}

	collisionOfSphereAndMesh(sphere, mesh, collision)
	{
		return this.collisionOfMeshAndSphere(mesh, sphere, collision);
	}

	collisionOfSpheres(sphere0, sphere1, collision)
	{
		var sphere0Center = sphere0.center;
		var sphere1Center = sphere1.center;

		var sphere0Radius = sphere0.radius;
		var sphere1Radius = sphere1.radius;

		var displacementFromSphere0CenterTo1 = this._displacement.overwriteWith
		(
			sphere1Center
		).subtract
		(
			sphere0Center
		);

		var distanceBetweenCenters =
			displacementFromSphere0CenterTo1.magnitude();

		var distanceToRadicalCenter = 
		(
			distanceBetweenCenters * distanceBetweenCenters
			+ sphere0Radius * sphere0Radius
			- sphere1Radius * sphere1Radius
		)
		/ (2 * distanceBetweenCenters);

		var directionFromSphere0CenterTo1 =
			displacementFromSphere0CenterTo1.divideScalar(distanceBetweenCenters);
		var displacementFromSphereCenter0ToRadicalCenter =
			directionFromSphere0CenterTo1.multiplyScalar(distanceToRadicalCenter);

		collision.pos.overwriteWith
		(
			displacementFromSphereCenter0ToRadicalCenter
		).add
		(
			sphere0Center
		);

		return collision;
	}

	// doXAndYCollide

	doBoxAndBoxCollide(box0, box1)
	{
		var returnValue = box0.overlapsWith(box1);
		return returnValue;
	}

	doBoxAndBoxRotatedCollide(box, boxRotated)
	{
		// todo
		var boxRotatedAsSphere = boxRotated.sphereSwept();
		return this.doBoxAndSphereCollide(box, boxRotatedAsSphere);
	}

	doBoxAndCylinderCollide(box, cylinder)
	{
		var returnValue = false;

		var displacementBetweenCenters = this._displacement.overwriteWith
		(
			box.center
		).subtract
		(
			cylinder.center
		);

		if (displacementBetweenCenters.z < box.sizeHalf().z + cylinder.lengthHalf)
		{
			displacementBetweenCenters.clearZ();

			var direction = displacementBetweenCenters.normalize();

			var pointOnCylinderClosestToBoxCenter = direction.multiplyScalar
			(
				cylinder.radius
			).add
			(
				cylinder.center
			);

			pointOnCylinderClosestToBoxCenter.z = box.center.z;

			var isPointOnCylinderWithinBox = box.containsPoint
			(
				pointOnCylinderClosestToBoxCenter
			);

			returnValue = isPointOnCylinderWithinBox;
		}

		return returnValue;
	}

	doBoxAndHemispaceCollide(box, hemispace)
	{
		var returnValue = false;

		var vertices = Mesh.fromBox(box).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			if (hemispace.containsPoint(vertex))
			{
				returnValue = true;
				break;
			}
		}
		return returnValue;
	}

	doBoxAndMapLocatedCollide(box, mapLocated)
	{
		// todo
		return this.doBoxAndBoxCollide(box, mapLocated.box);
	}

	doBoxAndMeshCollide(box, mesh)
	{
		// todo
		return this.doBoxAndBoxCollide(box, mesh.box() );
	}

	doBoxAndShapeInverseCollide(box, shapeInverse)
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, box);
	}

	doBoxAndShapeGroupAllCollide(box, shapeGroupAll)
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, box);
	}

	doBoxAndSphereCollide(box, sphere)
	{
		return this.collisionOfBoxAndSphere(box, sphere, this._collision, false).isActive;
	}

	doCylinderAndCylinderCollide(cylinder0, cylinder1)
	{
		var returnValue = false;

		var displacement = this._displacement.overwriteWith
		(
			cylinder1.center
		).subtract
		(
			cylinder0.center
		).clearZ();

		var distance = displacement.magnitude();
		var sumOfRadii = cylinder0.radius + cylinder1.radius;
		var doRadiiOverlap = (distance < sumOfRadii);
		if (doRadiiOverlap)
		{
			var doLengthsOverlap = false; // todo
			/*
			(
				(
					cylinder0.zMin > cylinder1.zMin
					&& cylinder0.zMin < cylinder1.zMax
				)
				||
				(
					cylinder0.zMax > cylinder1.zMin
					&& cylinder0.zMax < cylinder1.zMax
				)
				||
				(
					cylinder1.zMin > cylinder0.zMin
					&& cylinder1.zMin < cylinder0.zMax
				)
				||
				(
					cylinder1.zMax > cylinder0.zMin
					&& cylinder1.zMax < cylinder0.zMax
				)
			);
			*/

			if (doLengthsOverlap)
			{
				returnValue = true;
			}
		}

		return returnValue;
	}

	doEdgeAndFaceCollide(edge, face, collision)
	{
		return (this.collisionOfEdgeAndFace(edge, face, collision).isActive);
	}

	doEdgeAndHemispaceCollide(edge, hemispace)
	{
		var vertices = edge.vertices;
		var returnValue = ( hemispace.containsPoint(vertices[0]) || hemispace.containsPoint(vertices[1]) );
		return returnValue;
	}

	doEdgeAndMeshCollide(edge, mesh)
	{
		var returnValue = false;

		var edgeDirection = edge.direction();
		var meshFaces = mesh.faces();
		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			var facePlane = face.plane();
			var faceNormal = facePlane.normal;
			var faceDotEdge = faceNormal.dotProduct(edgeDirection);

			if (faceDotEdge < 0)
			{
				returnValue = this.doEdgeAndFaceCollide(edge, face, null);
				if (returnValue == true)
				{
					break;
				}
			}
		}

		return returnValue;
	}

	doEdgeAndPlaneCollide(edge, plane)
	{
		return (this.collisionOfEdgeAndPlane(edge, plane, this._collision.clear()) != null);
	}

	doHemispaceAndBoxCollide(hemispace, box)
	{
		var collision = this.collisionOfHemispaceAndBox(hemispace, box, this._collision.clear());

		return collision.isActive;
	}

	doHemispaceAndSphereCollide(hemispace, sphere)
	{
		var collision = this.collisionOfHemispaceAndSphere(hemispace, sphere, this._collision.clear());

		return collision.isActive;
	}

	doMeshAndBoxCollide(mesh, box)
	{
		return this.doBoxAndMeshCollide(box, mesh);
	}

	doMeshAndMeshCollide(mesh0, mesh1)
	{
		var returnValue = true;

		// hack - Meshes are assumed to be convex.

		var meshVertices= [ mesh0.vertices(), mesh1.vertices() ];
		var meshFaces= [ mesh0.faces(), mesh1.faces() ];

		for (var m = 0; m < 2; m++)
		{
			var meshThisFaces = meshFaces[m];
			var meshThisVertices = meshVertices[m];
			var meshOtherVertices = meshVertices[1 - m];

			for (var f = 0; f < meshThisFaces.length; f++)
			{
				var face = meshThisFaces[f];
				var faceNormal = face.plane().normal;

				var vertexThis = meshThisVertices[0];
				var vertexThisProjectedMin = vertexThis.dotProduct(faceNormal);
				var vertexThisProjectedMax = vertexThisProjectedMin;
				for (var v = 1; v < meshThisVertices.length; v++)
				{
					vertexThis = meshThisVertices[v];
					var vertexThisProjected = vertexThis.dotProduct(faceNormal);
					if (vertexThisProjected < vertexThisProjectedMin)
					{
						vertexThisProjectedMin = vertexThisProjected;
					}

					if (vertexThisProjected > vertexThisProjectedMax)
					{
						vertexThisProjectedMax = vertexThisProjected;
					}
				}

				var vertexOther = meshOtherVertices[0];
				var vertexOtherProjectedMin = vertexOther.dotProduct(faceNormal);
				var vertexOtherProjectedMax = vertexOtherProjectedMin;
				for (var v = 1; v < meshOtherVertices.length; v++)
				{
					vertexOther = meshOtherVertices[v];
					var vertexOtherProjected = vertexOther.dotProduct(faceNormal);
					if (vertexOtherProjected < vertexOtherProjectedMin)
					{
						vertexOtherProjectedMin = vertexOtherProjected;
					}

					if (vertexOtherProjected > vertexOtherProjectedMax)
					{
						vertexOtherProjectedMax = vertexOtherProjected;
					}
				}

				var doProjectionsOverlap =
				(
					vertexThisProjectedMax > vertexOtherProjectedMin
					&& vertexOtherProjectedMax > vertexThisProjectedMin
				);

				if (doProjectionsOverlap == false)
				{
					returnValue = false;
					break;
				}
			}
		}

		return returnValue;
	}

	doMapLocatedAndBoxCollide(mapLocated, box)
	{
		return this.doBoxAndMapLocatedCollide(box, mapLocated);
	}

	doMapLocatedAndMapLocatedCollide(mapLocated0, mapLocated1)
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoxAndBoxCollide(mapLocated0.box, mapLocated1.box);

		if (doBoundsCollide == false)
		{
			return false;
		}

		var map0 = mapLocated0.map;
		var map1 = mapLocated1.map;

		var cell0 = map0.cellPrototype.clone() ;
		var cell1 = map1.cellPrototype.clone() ;

		var cell0PosAbsolute = Coords.create();

		var cell0PosInCells = Coords.create();
		var cell1PosInCells = Coords.create();

		var cell1PosInCellsMin = Coords.create();
		var cell1PosInCellsMax = Coords.create();

		var map0SizeInCells = map0.sizeInCells;

		var map1SizeInCellsMinusOnes = map1.sizeInCellsMinusOnes;

		var map0CellSize = map0.cellSize;
		var map1CellSize = map1.cellSize;

		var map0Pos = mapLocated0.loc.pos;
		var map1Pos = mapLocated1.loc.pos;

		for (var y0 = 0; y0 < map0SizeInCells.y; y0++)
		{
			cell0PosInCells.y = y0;
			cell0PosAbsolute.y = map0Pos.y + (y0 * map0CellSize.y);

			for (var x0 = 0; x0 < map0SizeInCells.x; x0++)
			{
				cell0PosInCells.x = x0;
				cell0PosAbsolute.x = map0Pos.x + (x0 * map0CellSize.x);

				cell0 = map0.cellAtPosInCells(cell0PosInCells) ;

				if (cell0.isBlocking)
				{
					cell1PosInCellsMin.overwriteWith
					(
						cell0PosAbsolute
					).subtract
					(
						map1Pos
					).divide
					(
						map1CellSize
					).floor();

					cell1PosInCellsMax.overwriteWith
					(
						cell0PosAbsolute
					).subtract
					(
						map1Pos
					).add
					(
						map0CellSize
					).divide
					(
						map1CellSize
					).floor();

					for (var y1 = cell1PosInCellsMin.y; y1 <= cell1PosInCellsMax.y; y1++)
					{
						cell1PosInCells.y = y1;

						for (var x1 = cell1PosInCellsMin.x; x1 < cell1PosInCellsMax.x; x1++)
						{
							cell1PosInCells.x = x1;

							var isCell1PosInBox = cell1PosInCells.isInRangeMinMax
							(
								Coords.Instances().Zeroes, map1SizeInCellsMinusOnes
							);
							if (isCell1PosInBox)
							{
								cell1 = map1.cellAtPosInCells(cell1PosInCells) ;

								if (cell1.isBlocking)
								{
									returnValue = true;

									y1 = cell1PosInCellsMax.y;
									x0 = map0SizeInCells.x;
									y0 = map0SizeInCells.y;
									break;
								}
							}
						}
					}
				}
			}
		}

		return returnValue;
	}

	doMapLocatedAndSphereCollide(mapLocated, sphere)
	{
		var returnValue = false;

		var doBoundsCollide =
			this.doBoxAndSphereCollide(mapLocated.box, sphere);

		if (doBoundsCollide == false)
		{
			return false;
		}

		var map = mapLocated.map;
		var cell= map.cellPrototype.clone();
		var cellPosAbsolute = Coords.create();
		var cellPosInCells = Coords.create();
		var mapSizeInCells = map.sizeInCells;
		var mapCellSize = map.cellSize;
		var mapSizeHalf = map.sizeHalf;
		var mapPos = mapLocated.loc.pos;
		var cellAsBox = new Box( Coords.create(), map.cellSize );

		for (var y = 0; y < mapSizeInCells.y; y++)
		{
			cellPosInCells.y = y;
			cellPosAbsolute.y = (y * mapCellSize.y) + mapPos.y - mapSizeHalf.y;

			for (var x = 0; x < mapSizeInCells.x; x++)
			{
				cellPosInCells.x = x;
				cellPosAbsolute.x = (x * mapCellSize.x) + mapPos.x - mapSizeHalf.x;

				cell = map.cellAtPosInCells(cellPosInCells) ;

				if (cell.isBlocking)
				{
					cellAsBox.center.overwriteWith(cellPosAbsolute);
					var doCellAndSphereCollide = this.doBoxAndSphereCollide(cellAsBox, sphere);
					if (doCellAndSphereCollide)
					{
						returnValue = true;
						break;
					}
				}
			}
		}

		return returnValue;
	}

	doMeshAndSphereCollide(mesh, sphere)
	{
		var returnValue = true;

		// hack - Mesh is assumed to be convex.

		var meshFaces = mesh.faces();
		var hemispace = new Hemispace(null);

		for (var f = 0; f < meshFaces.length; f++)
		{
			var face = meshFaces[f];
			hemispace.plane = face.plane();
			var doHemispaceAndSphereCollide = this.doHemispaceAndSphereCollide
			(
				hemispace,
				sphere
			);
			if (doHemispaceAndSphereCollide == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	doBoxRotatedAndBoxCollide(boxRotated, box)
	{
		return this.doBoxAndBoxRotatedCollide(box, boxRotated);
	}

	doBoxRotatedAndSphereCollide(boxRotated, sphere)
	{
		var box = boxRotated.box;
		var center = box.center;
		var sphereCenter = sphere.center;
		var sphereCenterToRestore = this._pos.overwriteWith(sphereCenter);
		sphereCenter.subtract(center);
		var polar = this._polar;
		polar.azimuthInTurns = boxRotated.angleInTurns;
		polar.radius = 1;
		var rectangleAxisX = polar.toCoords(Coords.create());
		polar.azimuthInTurns += .25;
		var rectangleAxisY = polar.toCoords(Coords.create());
		var x = sphereCenter.dotProduct(rectangleAxisX);
		var y = sphereCenter.dotProduct(rectangleAxisY);
		sphereCenter.x = x;
		sphereCenter.y = y;
		sphereCenter.add(box.center);
		var returnValue = this.doBoxAndSphereCollide(box, sphere);
		sphereCenter.overwriteWith(sphereCenterToRestore);
		return returnValue;
	}

	doSphereAndBoxCollide(sphere, box)
	{
		return this.doBoxAndSphereCollide(box, sphere);
	}

	doSphereAndMapLocatedCollide(sphere, mapLocated)
	{
		return this.doMapLocatedAndSphereCollide(mapLocated, sphere);
	}

	doSphereAndMeshCollide(sphere, mesh)
	{
		return this.doMeshAndSphereCollide(mesh, sphere);
	}

	doSphereAndBoxRotatedCollide(sphere, boxRotated)
	{
		return this.doBoxRotatedAndSphereCollide(boxRotated, sphere);
	}

	doSphereAndShapeContainerCollide(sphere, shapeContainer)
	{
		return this.doShapeContainerAndShapeCollide(shapeContainer, sphere);
	}

	doSphereAndShapeGroupAllCollide(sphere, shapeGroupAll)
	{
		return this.doShapeGroupAllAndShapeCollide(shapeGroupAll, sphere);
	}

	doSphereAndShapeGroupAnyCollide(sphere, shapeGroupAny)
	{
		return this.doShapeGroupAnyAndShapeCollide(shapeGroupAny, sphere);
	}

	doSphereAndShapeInverseCollide(sphere, shapeInverse)
	{
		return this.doShapeInverseAndShapeCollide(shapeInverse, sphere);
	}

	doSphereAndSphereCollide(sphere0, sphere1)
	{
		var displacement = this._displacement.overwriteWith
		(
			sphere1.center
		).subtract
		(
			sphere0.center
		);
		var distance = displacement.magnitude();
		var sumOfRadii = sphere0.radius + sphere1.radius;
		var returnValue = (distance < sumOfRadii);

		return returnValue;
	}

	// boolean combinations

	doShapeGroupAllAndBoxCollide(groupAll, shapeOther)
	{
		return this.doShapeGroupAllAndShapeCollide(groupAll, shapeOther);
	}

	doShapeGroupAllAndShapeCollide(groupAll, shapeOther)
	{
		var returnValue = true;

		var shapesThis = groupAll.shapes;
		for (var i = 0; i < shapesThis.length; i++)
		{
			var shapeThis = shapesThis[i];
			var doShapesCollide = this.doCollidersCollide(shapeThis, shapeOther);
			if (doShapesCollide == false)
			{
				returnValue = false;
				break;
			}
		}

		return returnValue;
	}

	doShapeGroupAnyAndBoxCollide(groupAny, box)
	{
		return this.doShapeGroupAnyAndShapeCollide(groupAny, box);
	}

	doShapeGroupAnyAndShapeCollide(groupAny, shapeOther)
	{
		var returnValue = false;

		var shapesThis = groupAny.shapes;
		for (var i = 0; i < shapesThis.length; i++)
		{
			var shapeThis = shapesThis[i];
			var doShapesCollide = this.doCollidersCollide(shapeThis, shapeOther);
			if (doShapesCollide)
			{
				returnValue = true;
				break;
			}
		}

		return returnValue;
	}

	doShapeContainerAndShapeCollide(container, shapeOther)
	{
		return this.doesColliderContainOther(container.shape, shapeOther);
	}

	doShapeContainerAndBoxCollide(container, box)
	{
		return this.doShapeContainerAndShapeCollide(container, box);
	}

	doShapeInverseAndShapeCollide(inverse, shapeOther)
	{
		return (this.doCollidersCollide(inverse.shape, shapeOther) == false);
	}

	doShapeGroupAllAndSphereCollide(group, shape)
	{
		return this.doShapeGroupAllAndShapeCollide(group, shape);
	}

	doBoxAndShapeGroupAnyCollide(box, group)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, box);
	}

	doShapeContainerAndSphereCollide(container, sphere)
	{
		return this.doShapeContainerAndShapeCollide(container, sphere);
	}

	doShapeGroupAnyAndSphereCollide(group, sphere)
	{
		return this.doShapeGroupAnyAndShapeCollide(group, sphere);
	}

	doShapeInverseAndBoxCollide(inverse, box)
	{
		return this.doShapeInverseAndShapeCollide(inverse, box);
	}

	doShapeInverseAndSphereCollide(inverse, sphere)
	{
		return this.doShapeInverseAndShapeCollide(inverse, sphere);
	}

	// contains

	doesBoxContainBox(box0, box1)
	{
		return box0.containsOther(box1);
	}

	doesBoxContainHemispace(box, hemispace)
	{
		return false;
	}

	doesBoxContainSphere(box, sphere)
	{
		var boxForSphere = new Box
		(
			sphere.center, new Coords(1, 1, 1).multiplyScalar(sphere.radius * 2)
		);

		var returnValue = box.containsOther(boxForSphere);

		return returnValue;
	}

	doesHemispaceContainBox(hemispace, box)
	{
		var returnValue = true;

		var vertices = Mesh.fromBox(box).vertices();
		for (var i = 0; i < vertices.length; i++)
		{
			var vertex = vertices[i];
			if (hemispace.containsPoint(vertex) == false)
			{
				returnValue = false;
				break;
			}
		}
		return returnValue;
	}

	doesHemispaceContainSphere(hemispace, sphere)
	{
		var plane = hemispace.plane;
		var distanceOfSphereCenterAbovePlane =
			sphere.center.dotProduct(plane.normal)
			- plane.distanceFromOrigin;
		var returnValue = (distanceOfSphereCenterAbovePlane >= sphere.radius);
		return returnValue;
	}

	doesSphereContainBox(sphere, box)
	{
		var sphereCircumscribingBox = new Sphere(box.center, box.max().magnitude());
		var returnValue = sphere.containsOther(sphereCircumscribingBox);
		return returnValue;
	}

	doesSphereContainHemispace(sphere, hemispace)
	{
		return false;
	}

	doesSphereContainSphere(sphere0, sphere1)
	{
		return sphere0.containsOther(sphere1);
	}
}
