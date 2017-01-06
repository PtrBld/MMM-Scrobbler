# MMM-Scrobbler
This is an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror). It displays your currently playing music. To use this module you need to have a Last.fm account and scrobble your music.

## Installation

1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/PtrBld/MMM-Scrobbler.git`.

2. A new folder will appear. That's all :)

##Configuration
You can scrobble all your music with Last.fm.

1. Create an [account](https://secure.last.fm/de/join)

2. Create an [api key](http://www.last.fm/api/account/create)

3. Configure your client to scrobble your music. [How To: Scrobble to Last.fm from iTunes, Spotify, and more](http://www.cnet.com/how-to/how-to-scrobble-to-last-fm-from-itunes-spotify-and-more/)

##Module Usage
The entry in the `module array` in your `config.js` can look like the following. Only username and apikey are mandatory fields. All other fields have default values.

```
{
			
	module: 'MMM-Scrobbler',
	
	position: 'top_right',
	config: {

		username: 'Last.fm username',
	
		apikey: 'Last.fm api key',
	
		//time interval to search for new song (every 15 seconds)
		updateInterval: 15 * 1000,
		//how often should we try to retrieve a song if not listening
		delayCount: 5,
		//time interval to search for new song if the 5 times not listening is received.
		//set this to the same number as updateInterval to ignore this option	
		delayInterval: 120*1000,
		animationSpeed: 1000,
		}
	
}
