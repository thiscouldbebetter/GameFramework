

class Collision
{
	pos;
	distanceToCollision;
	colliders;
	collidersByName;

	collidables;
	normals;
	isActive;

	constructor(pos, distanceToCollision, colliders)
	{
		this.pos = pos || Coords.create();
		this.distanceToCollision = distanceToCollision;
		this.collidables = [];
		this.colliders = colliders || [];
		this.collidersByName = new Map();
		this.normals = [ Coords.create(), Coords.create() ];

		this.isActive = false;
	}

	static create()
	{
		return new Collision(null, null, null);
	}

	clear()
	{
		this.isActive = false;
		ArrayHelper.clear(this.collidables);
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
