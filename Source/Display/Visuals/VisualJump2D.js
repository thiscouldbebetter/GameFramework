

class VisualJump2D
{
	visualJumper;
	visualShadow;
	cameraFactory;

	_posSaved;

	constructor(visualJumper, visualShadow, cameraFactory)
	{
		this.visualJumper = visualJumper;
		this.visualShadow = visualShadow;

		this._posSaved = Coords.create();
	}

	// Transformable.

	transform(transformToApply)
	{
		transformToApply.transform(this.visualJumper);
		transformToApply.transform(this.visualShadow);
		return this;
	}

	// Visual.

	draw(universe, world, place, entity, display)
	{
		var entityPos = entity.locatable().loc.pos;
		var entityPosZ = entityPos.z;
		var camera = world.placeCurrent.camera().camera(); // hack
		entityPosZ -= camera.focalLength;
		var height = 0 - entityPosZ;
		if (height <= 0)
		{
			this.visualJumper.draw(universe, world, place, entity, display);
		}
		else
		{
			this.visualShadow.draw(universe, world, place, entity, display);
			this._posSaved.overwriteWith(entityPos);
			entityPos.y -= height;
			this.visualJumper.draw(universe, world, place, entity, display);
			entityPos.overwriteWith(this._posSaved);
		}
	}

	// Cloneable.

	clone()
	{
		return new VisualJump2D
		(
			this.visualJumper.clone(), this.visualShadow.clone(), this.cameraFactory
		);
	}

	overwriteWith(other)
	{
		this.visualJumper.overwriteWith(other.visualJumper);
		this.visualShadow.overwriteWith(other.visualShadow);
		return this;
	}
}
