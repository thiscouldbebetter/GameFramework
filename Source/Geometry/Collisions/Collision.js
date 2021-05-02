

class Collision
{
	pos;
	distanceToCollision;
	colliders;
	collidersByName;
	entitiesColliding;

	normals;
	isActive;

	constructor
	(
		pos,
		distanceToCollision,
		colliders,
		entitiesColliding
	)
	{
		this.pos = pos || Coords.create();
		this.distanceToCollision = distanceToCollision;
		this.colliders = colliders || new Array();
		this.entitiesColliding = entitiesColliding || new Array();

		this.collidersByName = new Map();
		this.normals = [ Coords.create(), Coords.create() ];

		this.isActive = false;
	}

	static create()
	{
		return new Collision
		(
			Coords.create(), 0, new Array(), new Array()
		);
	}

	static fromPosAndDistance(pos, distance)
	{
		return new Collision(pos, distance, [], []);
	}

	clear()
	{
		this.isActive = false;
		ArrayHelper.clear(this.entitiesColliding);
		ArrayHelper.clear(this.colliders);
		this.collidersByName.clear();
		return this;
	}

	equals(other)
	{
		var returnValue =
		(
			this.isActive == other.isActive
			&&
			(
				this.isActive == false
				||
				(
					this.pos.equals(other.pos)
					&& this.distanceToCollision == other.distanceToCollision
					&& ArrayHelper.equals(this.colliders, other.colliders)
				)
			)
		);

		return returnValue;
	}
}
