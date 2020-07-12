
class Collision
{
	pos;
	distanceToCollision;
	colliders;

	collidables;
	normals;
	isActive;

	constructor(pos, distanceToCollision, colliders)
	{
		this.pos = (pos == null ? new Coords(0, 0, 0) : pos);
		this.distanceToCollision = distanceToCollision;
		this.collidables = [];
		this.colliders = colliders || [];
		this.normals = [ new Coords(0, 0, 0), new Coords(0, 0, 0) ];

		this.isActive = false;
	}

	clear()
	{
		this.isActive = false;
		ArrayHelper.clear(this.collidables);
		ArrayHelper.clear(this.colliders);
		return this;
	};

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
					&& this.colliders.equals(other.colliders)
				)
			)
		);

		return returnValue;
	};
}
