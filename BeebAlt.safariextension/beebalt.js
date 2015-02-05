// Info on how to deal with settings is found here (thanks):
// http://stackoverflow.com/questions/3026686/safari-extension-questions
// specifically http://stackoverflow.com/a/3034888
// FIXME: make it react to settings changes
(function() {
	var settings, init = function() {
		// do extension stuff
		var TEXT_PADDING = '0.5em';

		if( window.top === window ) {
			var statusMessage = 'BeebAlt is loaded';

			// Look for a news/sport article
			var articleContent = document.getElementById('main-content')
				.getElementsByClassName('story-body')[0];

			if( articleContent ) {
				// Find and start processing images within the article
				var articleImages = articleContent.getElementsByTagName('img');

				if( articleImages.length > 0 ) {
					statusMessage = 'BeebAlt is active';
				}

				for( var i = 0; i < articleImages.length; i++ ) {
					var altText = articleImages[i].getAttribute('alt');

					// Create a visible alt element for most images
					// (some should be ignored)
					if( altText != 'line' && altText != 'Magazine Monitor' ) {
						var altElement = document.createElement('span');
						altElement.textContent = altText;
						altElement.style.backgroundColor = 'black';
						altElement.style.color = 'white';
						altElement.style.margin = 0;
						altElement.style.padding = TEXT_PADDING;
						altElement.style.fontWeight = 'bold';

						// Adjust width to match image
						altElement.style.width = 'calc('
								+ articleImages[i].getAttribute('width') + 'px'
								+ ' - 2 * ' + TEXT_PADDING + ')';

						// Some News articles have captions next to images;
						// Sport articles do not.
						var caption = articleImages[i]
							.parentNode.getElementsByTagName('span')[0];

						if( caption ) {
							caption.style.borderBottom = '1px solid black';
							caption.style.padding = TEXT_PADDING;
							// The width becomes too great when padded
							caption.style.width = altElement.style.width;
						}

						// Thanks http://stackoverflow.com/a/4793630
						articleImages[i].parentNode.insertBefore(
							altElement, caption);
					}
				}
			}

			if( settings.showActive ) {
				// Indicate when the extension is active
				var blurb = document.createElement('p');
				blurb.textContent = statusMessage;
				blurb.style.backgroundColor = 'white';
				blurb.style.color = 'black';
				blurb.style.padding = '1.0em';
				blurb.style.position = 'fixed';
				blurb.style.top = 0;
				blurb.style.right = 0;
				blurb.style.border = '2px solid black';
				blurb.style.zIndex = 420;
				document.body.insertBefore(blurb, document.body.firstChild);
			}
		}
	};

	// listen for an incoming setSettings message
	safari.self.addEventListener("message", function(e) {
		if( e.name === "setSettings" ) {
			settings = e.message;
			init();
		}
	}, false);

	// ask proxy.html for settings
	safari.self.tab.dispatchMessage("getSettings");
}())
