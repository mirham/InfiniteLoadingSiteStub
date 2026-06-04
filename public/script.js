const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let mediaLoaded = 0;
let totalMedia = 0;
let mediaArray = [];
let isInitialLoad = true;

let appConfig = {
    title: 'Infinite Media',
    heading: 'Random Media Gallery',
    favicon: 'favicon.ico',
    background: '',
    initialCount: 10,
    loadMoreCount: 30
};

async function loadConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            appConfig = await response.json();
        }
    } catch (error) {
        console.log('Using default config');
    }
    applyConfig();
}

function applyConfig() {
    document.title = appConfig.title;
    document.getElementById('page-title').textContent = appConfig.title;
    document.getElementById('main-heading').textContent = appConfig.heading;
    
    if (appConfig.favicon) {
        document.getElementById('favicon').href = appConfig.favicon;
    }
    
    if (appConfig.background) {
        document.body.style.backgroundImage = `url(${appConfig.background})`;
    }
}

function updateAPIURLWithNewCount(picCount) {
    return `/api/random-media?count=${picCount}`;
}

function mediaLoadedCallback() {
    mediaLoaded++;
    if (mediaLoaded === totalMedia) {
        ready = true;
        loader.hidden = true;
    }
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayMedia() {
    mediaLoaded = 0;
    totalMedia = mediaArray.length;

    mediaArray.forEach((media) => {
        const item = document.createElement('a');
        setAttributes(item, {
            href: media.url,
            target: '_blank'
        });

		if (media.type === 'video') {
			const video = document.createElement('video');
			
			video.muted = true;
			video.autoplay = true;
			video.loop = true;
			video.playsInline = true;
			video.preload = 'metadata';
			video.src = media.url;
			
			video.style.width = '100%';
			video.style.display = 'block';
			
			video.addEventListener('loadeddata', () => {
				mediaLoadedCallback();
				video.play().catch(err => {
					console.log('Autoplay blocked, waiting for interaction:', err);
				});
			});
			
			video.addEventListener('error', (e) => {
				console.error('Video error:', e);
				mediaLoadedCallback();
			});
		
			video.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				video.muted = !video.muted;
				// Try to play if paused
				if (video.paused) video.play();
			});
		
			item.appendChild(video);
		} else {
            const img = document.createElement('img');
            setAttributes(img, {
                src: media.url,
                alt: media.alt,
                title: media.alt
            });

            img.addEventListener('load', mediaLoadedCallback);
            img.addEventListener('error', mediaLoadedCallback);

            item.appendChild(img);
        }

        imageContainer.appendChild(item);
    });
}

async function getMedia() {
    try {
        const currentUrl = isInitialLoad 
            ? updateAPIURLWithNewCount(appConfig.initialCount) 
            : updateAPIURLWithNewCount(appConfig.loadMoreCount);
            
        const response = await fetch(currentUrl);

        if (!response.ok) throw new Error('Failed to fetch media');

        mediaArray = await response.json();
        displayMedia();

        if (isInitialLoad) {
            isInitialLoad = false;
        }
    } catch (error) {
        console.error('Error fetching media:', error);
        loader.hidden = true;
        ready = true;
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getMedia();
    }
});

loadConfig().then(() => {
    getMedia();
});