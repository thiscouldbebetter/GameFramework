

class VideoHelper
{
	videos;
	videosByName;

	constructor(videos)
	{
		this.videos = videos;
		this.videosByName = ArrayHelper.addLookupsByName(this.videos);
	}
}
