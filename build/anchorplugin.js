/**
 * jQuery plugin for flash viewer
 */
var myListener = {
	me: null,
	onInit : function(me) {
		this.me = me;
		this.me.play();
		me.addEventListener('timeupdate', jQuery.proxy(this.onUpdate, this));
		jQuery("#playerplay").hide();
		jQuery("#playerpause").show();
		jQuery("#playermute").show();
		jQuery("#playerunmute").hide();

	},
	bChangingPosition: false,
	onUpdate: function(){
		if(!this.bChangingPosition){
			jQuery("#slider").slider({
				value : 100 * this.me.currentTime / this.me.duration
			});			
		}
	},
	playpause : function() {
		if (this.me.paused){
			this.me.play();
			jQuery("#playerplay").hide();
			jQuery("#playerpause").show();
		}
		else{
			this.me.pause();
			jQuery("#playerplay").show();
			jQuery("#playerpause").hide();
		}
	},
	start: function() {
		if(this.me) this.me.remove();
	    jQuery("#placeholder").hide();
	    jQuery("#video").show();
	    // doesn't work in ie11 if hidden?????
	    MediaElement('myFlash', {success: jQuery.proxy(this.onInit, this)});
	    	
	},
	muteunmute: function(){
		if (this.me.muted){
			this.me.setMuted(false);
			jQuery("#playermute").show();
			jQuery("#playerunmute").hide();
		}
		else{
			this.me.setMuted(true);
			jQuery("#playermute").hide();
			jQuery("#playerunmute").show();
		}
	},
	setPosition: function(){
        var position = jQuery("#slider").slider( "value" );
        this.me.setCurrentTime(this.me.duration * position/100);
        this.bChangingPosition = false;
	},
	startSliding: function(){
		this.bChangingPosition = true;
	},
	oPopup: null,
	popup :function(evt) {
		if(!this.oPopup){
			this.oPopup = jQuery(
					'<div id="popup">' +
					'<div id="placeholder"><a href="javascript:jQuery.proxy(myListener.start, myListener)()">' +
					'<img src="../build/play.svg" /></a></div>' +
					'<div id="video">' +
					'<video id="myFlash" width="320" height="240" type="video/x-flv"></video>' +
		            '<div id="playercontroller">' +
	                '<a href="javascript:jQuery.proxy(myListener.playpause, myListener)()" ><span id="playerplay"' +
					'class="glyphicon glyphicon-play"></span></a>' +
	                '<a href="javascript:jQuery.proxy(myListener.playpause, myListener)()"><span id="playerpause"' +
					'class="glyphicon glyphicon-pause"></span></a>' +
					'<div id="slider"></div>' +                
					'<a href="javascript:jQuery.proxy(myListener.muteunmute, myListener)()" >' +
					'<span id="playermute" class="glyphicon glyphicon-volume-off"></span></a>' +
	                '<a href="javascript:jQuery.proxy(myListener.muteunmute, myListener)()">' +
	                '<span id="playerunmute" class="glyphicon glyphicon-volume-up"></span></a>' +
	                '</div></div></div>' );
		}
		this.oPopup.dialog({ modal: true,  width: 328,
            height: 320, title: evt.target.title});
	    jQuery( "#slider" ).slider({value:0, min:0, max:100, 
	    	stop:jQuery.proxy(this.setPosition, this),
	    	start:jQuery.proxy(this.startSliding, this)});
	    jQuery("#myFlash").attr("src", evt.target.href);
	    this.bChangingPosition = false;
	    jQuery("#placeholder").show();
	    jQuery("#video").hide();
		return false;
	}
};

(function($) {
	$.fn.anchorPlugin = function() {
		jQuery(this).click(jQuery.proxy(myListener.popup, myListener));
		return this;
	};
}(jQuery));