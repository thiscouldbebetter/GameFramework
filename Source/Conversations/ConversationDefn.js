
// classes

function ConversationDefn(name, imageName, contentTextStringName, talkNodeDefns, talkNodes)
{
	this.name = name;
	this.imageName = imageName;
	this.contentTextStringName = contentTextStringName;
	this.talkNodeDefns = talkNodeDefns.addLookups("name");
	this.talkNodes = talkNodes.addLookups("name");
}

{
	ConversationDefn.prototype.talkNodeByName = function(nameOfTalkNodeToGet)
	{
		return this.talkNodes[nameOfTalkNodeToGet];
	}

	ConversationDefn.prototype.talkNodesByNames = function(namesOfTalkNodesToGet)
	{
		var returnNodes = [];

		for (var i = 0; i < namesOfTalkNodesToGet.length; i++)
		{
			var nameOfTalkNodeToGet = namesOfTalkNodesToGet[i];
			var talkNode = this.talkNodeByName(nameOfTalkNodeToGet);
			returnNodes.push(talkNode);
		}

		return returnNodes;
	}

	ConversationDefn.prototype.expandFromContentTextString = function(contentTextString)
	{
		var contentText = contentTextString.value;
		var contentTextAsLines = contentText.split("\n");
		var tagToTextLinesLookup = {};
		var tagCurrent = null;
		var linesForTagCurrent;
		for (var i = 0; i < contentTextAsLines.length; i++)
		{
			var contentLine = contentTextAsLines[i];
			if (contentLine.startsWith("#"))
			{
				if (tagCurrent != null)
				{
					tagToTextLinesLookup[tagCurrent] = linesForTagCurrent;
				}
				tagCurrent = contentLine.split("\t")[0];
				linesForTagCurrent = [];
			}
			else
			{
				if (contentLine.length > 0)
				{
					linesForTagCurrent.push(contentLine);
				}
			}
		}
		tagToTextLinesLookup[tagCurrent] = linesForTagCurrent;

		var talkNodeDefns = TalkNodeDefn.Instances();
		var talkNodeDefnNamesToExpand =
		[
			talkNodeDefns["Display"].name,
			talkNodeDefns["Option"].name,
		];

		var talkNodesExpanded = [];
		for (var i = 0; i < this.talkNodes.length; i++)
		{
			var talkNodeToExpand = this.talkNodes[i];

			var talkNodeToExpandDefnName = talkNodeToExpand.defnName;
			var shouldTalkNodeBeExpanded =
				talkNodeDefnNamesToExpand.contains(talkNodeToExpandDefnName);
			if (shouldTalkNodeBeExpanded == false)
			{
				talkNodesExpanded.push(talkNodeToExpand);
			}
			else
			{
				var tag = talkNodeToExpand.text;
				var textLinesForTag = tagToTextLinesLookup[tag];
				for (var j = 0; j < textLinesForTag.length; j++)
				{
					var textLine = textLinesForTag[j];
					var talkNodeExpanded = new TalkNode
					(
						talkNodeToExpand.name + "_" + j,
						talkNodeToExpandDefnName,
						textLine,
						talkNodeToExpand.next,
						talkNodeToExpand.isActive
					)
					talkNodesExpanded.push(talkNodeExpanded);
				}
			}
		}

		this.talkNodes = talkNodesExpanded.addLookups("name");
	}

	// serialization

	ConversationDefn.deserialize = function(conversationDefnAsJSON)
	{
		var conversationDefn = JSON.parse(conversationDefnAsJSON);

		conversationDefn.__proto__ = ConversationDefn.prototype;

		var talkNodes = conversationDefn.talkNodes;
		for (var i = 0; i < talkNodes.length; i++)
		{
			var talkNode = talkNodes[i];
			talkNode.__proto__ = TalkNode.prototype;
			if (talkNode.name == null)
			{
				talkNode.name = TalkNode.idNext();
			}
			if (talkNode.isActive == null)
			{
				talkNode.isActive = true;
			}
		}
		talkNodes.addLookups("name");

		conversationDefn.talkNodeDefns = TalkNodeDefn.Instances()._All;

		return conversationDefn;
	}

	ConversationDefn.prototype.serialize = function()
	{
		var talkNodeDefnsToRestore = this.talkNodeDefns;
		delete this.talkNodeDefns;

		var returnValue = JSON.stringify(this, null, 4);

		this.talkNodeDefns = talkNodeDefnsToRestore;
		return returnValue;
	}
}
