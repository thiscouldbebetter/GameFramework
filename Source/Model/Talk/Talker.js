

class Talker extends EntityProperty
{
	conversationDefnName;

	constructor(conversationDefnName)
	{
		super();
		this.conversationDefnName = conversationDefnName;
	}

	talk(universe, world, place, entityTalker, entityTalkee)
	{
		var conversationDefnAsJSON =
			universe.mediaLibrary.textStringGetByName(this.conversationDefnName).value;
		var conversationDefn = ConversationDefn.deserialize(conversationDefnAsJSON);
		var venueToReturnTo = universe.venueCurrent;
		var conversation = new ConversationRun
		(
			conversationDefn,
			() => // quit
			{
				universe.venueNext = venueToReturnTo;
			},
			entityTalkee,
			entityTalker // entityTalker
		);
		var conversationSize = universe.display.sizeDefault().clone();
		var conversationAsControl =
			conversation.toControl(conversationSize, universe);

		var venueNext = conversationAsControl.toVenue();

		universe.venueNext = venueNext;
	}
}
