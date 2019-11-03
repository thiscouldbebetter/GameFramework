
function Wedge(vertex, directionMin, angleSpannedInTurns)
{
	this.vertex = vertex;
	this.directionMin = directionMin;
	this.angleSpannedInTurns = angleSpannedInTurns;

	// Helper variable.
	this.rayDirectionMinAsPolar = new Polar(0, 1);
}
{
	Wedge.prototype.angleInTurnsMax = function()
	{
		var returnValue = 
		(
			this.angleInTurnsMin() + this.angleSpannedInTurns
		).wrapToRangeMinMax
		(
			0, 1
		);

		return returnValue;
	};

	Wedge.prototype.angleInTurnsMin = function()
	{
		return this.rayDirectionMinAsPolar.fromCoords
		(
			this.directionMin
		).azimuthInTurns;
	};

	Wedge.prototype.collider = function()
	{
		if (this._collider == null)
		{
			this.rayDirectionMinAsPolar = new Polar(0, 1);
			this.rayDirectionMaxAsPolar = new Polar(0, 1);
			this.rayDirectionMin = new Coords();
			this.rayDirectionMax = new Coords();
			this.downFromVertex = new Coords();
			this.directionMinFromVertex = new Coords();
			this.directionMaxFromVertex = new Coords();
			this.planeForAngleMin = new Plane(new Coords());
			this.planeForAngleMax = new Plane(new Coords());
			this.hemispaces = 
			[ 
				new Hemispace(this.planeForAngleMin),
				new Hemispace(this.planeForAngleMax)
			];
			this.shapeGroupAll = new ShapeGroupAll(this.hemispaces);
			this.shapeGroupAny = new ShapeGroupAny(this.hemispaces);
		}

		var angleInTurnsMin = this.angleInTurnsMin();
		var angleInTurnsMax = this.angleInTurnsMax();

		this.rayDirectionMinAsPolar.azimuthInTurns = angleInTurnsMin;
		this.rayDirectionMinAsPolar.toCoords(this.rayDirectionMin);
		this.rayDirectionMaxAsPolar.azimuthInTurns = angleInTurnsMax;
		this.rayDirectionMaxAsPolar.toCoords(this.rayDirectionMax);

		var down = Coords.Instances().ZeroZeroOne;

		this.downFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			down
		);

		this.directionMinFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			this.rayDirectionMin
		);

		this.directionMaxFromVertex.overwriteWith
		(
			this.vertex
		).add
		(
			this.rayDirectionMax
		);

		this.planeForAngleMin.fromPoints
		(
			// Order matters!
			this.vertex, 
			this.directionMinFromVertex,
			this.downFromVertex
		);

		this.planeForAngleMax.fromPoints
		(
			this.vertex, 
			this.downFromVertex,
			this.directionMaxFromVertex
		);

		if (this.angleSpannedInTurns < .5)
		{
			this._collider = this.shapeGroupAll;
		}
		else
		{
			this._collider = this.shapeGroupAny;
		}

		return this._collider;
	};

	// cloneable

	Wedge.prototype.clone = function()
	{
		return new Wedge(this.vertex.clone(), this.directionMin.clone(), this.angleSpannedInTurns);
	};

	Wedge.prototype.overwriteWith = function(other)
	{
		this.vertex.overwriteWith(other.vertex);
		this.directionMin.overwriteWith(other.directionMin);
		this.angleSpannedInTurns = other.angleSpannedInTurns;
	};
}
