

class Edge
{
	vertices;

	_box;
	_direction;
	_displacement;
	_transverse;

	constructor(vertices)
	{
		this.vertices = vertices || [ Coords.create(), Coords.create() ];

		this._direction = Coords.create();
		this._displacement = Coords.create();
		this._transverse = Coords.create();
	}

	static create()
	{
		return new Edge(null);
	}

	direction()
	{
		return this._direction.overwriteWith(this.displacement()).normalize();
	}

	equals(other)
	{
		return ArrayHelper.equals(this.vertices, other.vertices);
	}

	displacement()
	{
		return this._displacement.overwriteWith(this.vertices[1]).subtract(this.vertices[0]);
	}

	length()
	{
		return this.displacement().magnitude();
	}

	projectOntoOther(other)
	{
		var otherVertices = other.vertices;
		var otherVertex0 = otherVertices[0];
		var otherDirection = other.direction();
		var otherTransverse = other.transverse(Coords.Instances().ZeroZeroOne);

		for (var i = 0; i < this.vertices.length; i++)
		{
			var vertex = this.vertices[i];
			vertex.subtract(otherVertex0);
			vertex.overwriteWithDimensions
			(
				vertex.dotProduct(otherDirection),
				vertex.dotProduct(otherTransverse),
				0
			);
		}

		return this;
	}

	transverse(faceNormal)
	{
		return this._transverse.overwriteWith(this.direction()).crossProduct(faceNormal);
	}

	// string

	toString()
	{
		return this.vertices.toString();
	}

	// Cloneable.

	clone()
	{
		return new Edge(ArrayHelper.clone(this.vertices));
	}

	overwriteWith(other)
	{
		ArrayHelper.overwriteWith(this.vertices, other.vertices);
		return this;
	}

	// ShapeBase.

	locate(loc){ throw("Not implemented!"); }

	normalAtPos(posToCheck, normalOut){ throw("Not implemented!"); }

	surfacePointNearPos(posToCheck, surfacePointOut){ throw("Not implemented!"); }

	toBox(boxOut)
	{
		return boxOut.ofPoints(this.vertices);
	}

	// Transformable.

	transform(transformToApply){ throw("Not implemented!");  }
}
