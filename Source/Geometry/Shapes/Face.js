
function Face(vertices)
{
	this.vertices = vertices;
}
{
	Face.prototype.box = function()
	{
		if (this._box == null)
		{
			this._box = new Box(new Coords(0, 0, 0), new Coords(0, 0, 0));
		}
		this._box.ofPoints(this.vertices);
		return this._box;
	};

	Face.prototype.containsPoint = function(pointToCheck)
	{
		var returnValue = true;

		var edges = this.edges();
		var normal = this.plane.normal;
		for (var e = 0; e < edges.length; e++)
		{
			var edge = edges[e];
			var distanceAlongTransverse = edge.transverse(normal).dotProduct(pointToCheck);
			var isPointWithinEdge = (distanceAlongTransverse > 0);
			if (isPointWithinEdge == false)
			{
				returnValue = false;
				break;
			}
		}
		return returnValue;
	};

	Face.prototype.edges = function()
	{
		if (this._edges == null)
		{
			this._edges = [];

			for (var v = 0; v < this.vertices.length; v++)
			{
				var vNext = (v + 1).wrapToRangeMinMax(0, this.vertices.length);
				var vertex = this.vertices[v];
				var vertexNext = this.vertices[vNext];

				var edge = new Edge([vertex, vertexNext]);

				this._edges.push(edge);
			}
		}

		return this._edges;
	};

	Face.prototype.plane = function()
	{
		if (this._plane == null)
		{
			this._plane = new Plane(new Coords(), 0);
		}

		this._plane.fromPoints
		(
			this.vertices[0],
			this.vertices[1],
			this.vertices[2]
		);

		return this._plane;
	};
}
