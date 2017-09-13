Module.register("MMM-Scrobbler",{
    // Default module config.
    defaults: {
        username: '',
		apikey: '',
		updateInterval: 15 * 1000,
		delayCount: 5,
		delayInterval: 120*1000,
		animationSpeed: 1000,
	    showAlbumArt: true,
	    showMetaData: true,
	    alignment: "bottom", //possible values: top, bottom, left, right
    },
	getStyles: function() {
		return ['MMM-Scrobbler.css']
		},
	start: function() {
		Log.info("Starting module: " + this.name);
		//set module data object
		this.songData = {playing:"false"};
		//prepare loading
		this.loaded = false;
		this.delay = this.config.updateInterval;
		this.failedCounter = 0;
		this.scheduleUpdate(0);
	},
    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
		if (!this.loaded) {
			wrapper.innerHTML = "Scrobble data...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		if (this.config.username == '' || this.config.apikey == '') {
			wrapper.innerHTML = "Please check your config file. Username or ApiKey is missing!";
			wrapper.className = "bright";
			return wrapper;
		}
		if(this.songData.playing === "true"){
			this.failedCounter = 0;
			this.delay = this.config.updateInterval;
			this.show(this.config.animationSpeed);
			var html = "<div class='player bright scrobbler-"+this.config.alignment+"'>";
			var albumart_html = '';
			var meta_html = '';
			if(this.config.showAlbumArt){
				albumart_html += "<div class='album-art-container'><div class='album-art'><img src='"+ this.songData.image +"' width='200'></div></div>";
			}
			if(this.config.showMetaData){
				meta_html += "<div class='meta'><table class='small'><tr class='track-name bright'><td>"+this.songData.title+"</td></tr><tr class='artist-name'><td>"+this.songData.artist +"</td></tr><tr class='album-name dimmed'><td>"+this.songData.album+"</td></tr></table></div>";
			}
			if(this.config.alignment === 'left' || this.config.alignment === 'top'){
				html += meta_html;
				html += albumart_html;
			}
			else{
				html += albumart_html;
				html += meta_html;		
			}
			html += "</div>";
			wrapper.innerHTML = html;
		}
		else{
			this.hide(this.config.animationSpeed);
			this.failedCounter = this.failedCounter + 1;
			if(this.failedCounter > this.config.delayCount){
				this.delay = this.config.delayInterval;
			}
			this.songData = {playing:"false"};
			wrapper.innerHTML = "Not playing...";
		}
		this.scheduleUpdate(this.delay);
		return wrapper;
    },
	queryLastFm: function(){
		var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+this.config.username+"&api_key="+this.config.apikey+"&limit=1&format=json";
		var self = this;		
		var i = new XMLHttpRequest;
		i.open("GET",url,true),i.onload=function(){
			var r=JSON.parse(i.responseText);
			if(!(i.status>=200&&i.status<400)){
				Log.error(r.message);
				self.hide(1000);
			}
			var a = r.recenttracks.track[0] ? r.recenttracks.track[0] : r.recenttracks.track;
			var nowplaying = false;
			if(a["@attr"]){ nowplaying = a["@attr"].nowplaying;}
			self.songData = {title:a.name,artist:a.artist["#text"],album:a.album["#text"],image:a.image[2]["#text"], playing: nowplaying};
			self.loaded = true;
			self.updateDom(self.config.animationSpeed);
			},
			i.onerror=function(){Log.error("Something went wrong")};
		i.send();
	},	
	scheduleUpdate: function(delay) {
		var nextLoad = this.delay;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		//set update timeout
		var self = this;		
		setTimeout(function() {
			self.queryLastFm();
		}, nextLoad);
	}
});
