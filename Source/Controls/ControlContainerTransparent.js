
class ControlContainerTransparent
{
	name;
	containerInner;

	fontHeightInPixels;
	parent;
	pos;
	size;

	constructor(containerInner)
	{
		this.name = containerInner.name;
		this.containerInner = containerInner;
	}

	// instance methods

	actionToInputsMappings()
	{
		return this.containerInner.actionToInputsMappings();
	};

	childWithFocus()
	{
		return this.containerInner.childWithFocus();
	};

	childWithFocusNextInDirection(direction)
	{
		return this.containerInner.childWithFocusNextInDirection(direction);
	};

	childrenAtPosAddToList
	(
		posToCheck, listToAddTo, addFirstChildOnly
	)
	{
		return this.containerInner.childrenAtPosAddToList
		(
			posToCheck, listToAddTo, addFirstChildOnly
		);
	};

	actionHandle(actionNameToHandle, universe)
	{
		return this.containerInner.actionHandle(actionNameToHandle, universe);
	};

	focusGain() {}

	focusLose() {}

	isEnabled()
	{
		return true; // todo
	}

	mouseClick(mouseClickPos)
	{
		var childrenContainingPos = this.containerInner.childrenAtPosAddToList
		(
			mouseClickPos,
			ArrayHelper.clear(this.containerInner.childrenContainingPos),
			true // addFirstChildOnly
		);

		var wasClickHandled = false;
		if (childrenContainingPos.length > 0)
		{
			var child = childrenContainingPos[0];
			if (child.mouseClick != null)
			{
				var wasClickHandledByChild = child.mouseClick(mouseClickPos);
				if (wasClickHandledByChild)
				{
					wasClickHandled = true;
				}
			}
		}

		return wasClickHandled;
	};

	mouseEnter() {}

	mouseExit() {}

	mouseMove(mouseMovePos)
	{
		this.containerInner.mouseMove(mouseMovePos);
	};

	scalePosAndSize(scaleFactor)
	{
		return this.containerInner.scalePosAndSize(scaleFactor);
	};

	// drawable

	draw(universe, display, drawLoc)
	{
		drawLoc = this.containerInner._drawLoc.overwriteWith(drawLoc);
		var drawPos = this.containerInner._drawPos.overwriteWith(drawLoc.pos).add
		(
			this.containerInner.pos
		);

		display.drawRectangle
		(
			drawPos, this.containerInner.size,
			null, // display.colorBack,
			display.colorFore, null
		);

		var children = this.containerInner.children;
		for (var i = 0; i < children.length; i++)
		{
			var child = children[i];
			child.draw(universe, display, drawLoc);
		}
	};
}
