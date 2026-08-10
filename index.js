(() => {
	var replace = (template, newName) => {
		return template.replace(
			/(src|poster)="([^"]*\/)([^\/"]+)(\.\w+)"/g,
			(match, attr, path, filename, ext) => (
				`${attr}="${path}${newName}${ext}"`
			)
		)
	};

	var json = (x) => x.json();

	var renderCounts = (o) => (
		['likes', 'msgs', 'saves', 'shares'].forEach((x) => {
			window[`$${x}`].innerText = o[x];
		})
	);

	Object.defineProperties($app, {
		play: {
			value: function (target) {
				target = target.querySelector('video') || target;
				target.muted = !!Number(this.muted);
				target.play();
			}
		},
		stop: {
			value: (target) => {
				target = target.querySelector('video') || target;
				target.pause();
				target.currentTime = 0;
			}
		},
		toggleMute: {
			value: function (target) {
				target = target.querySelector('video') || target;
				target.muted = target.muted ? false : true;
				this.muted = +target.muted;
				$toggle_mute.innerHTML = (!+this.muted
					? '<svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M7 16a3 3 0 0 0-3 3v11.17a3 3 0 0 0 3 3h4.2a2 2 0 0 1 1.46.63l8.88 9.5A2 2 0 0 0 25 41.93V6.4a2 2 0 0 0-3.51-1.3L12.67 15.3a2 2 0 0 1-1.52.7H7ZM37.43 37.44a1.04 1.04 0 0 1-.02-1.44 18.17 18.17 0 0 0 0-24 1.04 1.04 0 0 1 .02-1.43l1.42-1.42a.97.97 0 0 1 1.4.02 22.2 22.2 0 0 1 0 29.66c-.38.41-1.01.41-1.4.02l-1.42-1.41Z"></path><path d="M31.03 18.38a1.1 1.1 0 0 1 .04-1.45l1.41-1.42a.94.94 0 0 1 1.39.03 13.12 13.12 0 0 1 0 16.92.94.94 0 0 1-1.39.03l-1.41-1.42a1.1 1.1 0 0 1-.04-1.45c2.6-3.24 2.6-8 0-11.24Z"></path></svg>'
					: '<svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M3 19v11.17a3 3 0 0 0 3 3h4.2a2 2 0 0 1 1.46.63l8.88 9.5A2 2 0 0 0 24 41.93V6.4a2 2 0 0 0-3.51-1.3L11.67 15.3a2 2 0 0 1-1.52.7H6a3 3 0 0 0-3 3ZM29.3 18.12 35.16 24l-5.88 5.88a1 1 0 0 0 0 1.41l1.42 1.42a1 1 0 0 0 1.41 0L38 26.83l5.88 5.88a1 1 0 0 0 1.41 0l1.42-1.42a1 1 0 0 0 0-1.41L40.83 24l5.88-5.88a1 1 0 0 0 0-1.41l-1.42-1.42a1 1 0 0 0-1.41 0L38 21.17l-5.88-5.88a1 1 0 0 0-1.41 0l-1.42 1.42a1 1 0 0 0 0 1.41Z"></path></svg>'
				);
				$sound.innerText = !+this.muted ? 'on' : 'off';
			}
		},
		togglePlay: {
			value: function (target) {
				target = target.querySelector('video') || target;
				target.paused ? target.play() : target.pause();
				this.playing = +!target.paused;
			}
		},
		scrollIntoView: {
			value: (target) => (
				target && target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			)
		},
		muted: {
			get () { return this.dataset.muted },
			set (val) { this.dataset.muted = val; }
		},
		playing: {
			get () { return this.dataset.playing },
			set (val) { this.dataset.playing = val; }
		}
	});

	window.onkeydown = (evt) => {
		var action = {
			'Space': () => $app.togglePlay(current),
			'ArrowDown': () => $app.scrollIntoView(next),
			'ArrowUp': () => $app.scrollIntoView(prev)
		}
		
		[evt.code]; action && action(evt.preventDefault());
	};

	window.onclick = (evt) => {
		var video = evt.target.closest('video');
		if (video)
			$app.togglePlay(video);
			
		var btn = evt.target.closest('button');
		if (btn && btn.id === '$toggle_mute')
			$app.toggleMute(current);
	};

	var previousY = 0,
		previousRatio = 0,
		totalSlides = 11;

	var prev = null, 
		[current, next] = $app.children;

	var markSlides = ({ target }) => {
		current = target;
		next = current.nextElementSibling;
		prev = current.previousElementSibling;
		current.dataset.current = "";
	};

	var render = (
		(renderFn) => (url) => (
			fetch(url).then(json).then(renderFn)
		)
	)(renderCounts);

	$app.slideDown = function () {
		$app.play(current);
		$app.stop(prev);
		delete prev.dataset.current;
		observer.observe(next);
		observer.observe(prev);		
		var len = $app.children.length;
		var slidesCount = len % totalSlides;
		var last = `<section data-id="${len}">${replace(next.innerHTML, slidesCount)}`;
		$app.insertAdjacentHTML('beforeend', last);
		render(`/api/${current.dataset.id % totalSlides}.json`)
	};

	$app.slideUp = function () {
		$app.play(current);
		$app.stop(next);
		delete next.dataset.current;
		var last = $app.children.length - 1;
		$app.children[last].remove();
		render(`/api/${current.dataset.id % totalSlides}.json`)
	};

	var observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			var currentY = entry.boundingClientRect.y;
			var currentRatio = entry.intersectionRatio;
			var isIntersecting = entry.isIntersecting;
			
			// Scrolling up
			if (currentY < previousY) {
				if (currentRatio > previousRatio && isIntersecting) {
					markSlides(entry);
					$app.slideUp();
				}
			}
			
			// Scrolling down
			else if (currentY > previousY && isIntersecting) {
				if (currentRatio > previousRatio) {
					markSlides(entry);	
					$app.slideDown();
				}
			}
		});
	}, { threshold: 0.5 });

	observer.observe(next);
})();
