# Vertical video sliding UI

A short-video viewing interface with vertical scrolling, similar to TikTok / Instagram Reels,
with support for mobile and desktop. No third-party libraries were used.
### Structure
```
├── api			# Pseudo API mocks
├── bin			# Binary dependencies
├── favicon.ico	# Simple favicon
├── img			# Images directory
├── index.css	# Stylesheet
├── index.html	# Markup
├── Makefile	# Build
├── LICENSE		# License
├── README.md	# This readme
├── vid			# Videos directory
├── .gitignore	# Untracked files
```

## Dependencies

[ffmpeg](https://github.com/ffmpeg/ffmpeg), [cwebp](https://developers.google.com/speed/webp/download), [minify](https://github.com/tdewolff/minify/releases).
Download and install according to your OS.

## Development

Clone the repository and put the videos from the [link](https://drive.google.com/drive/folders/1L5lsFtOUSaIFt0nzQgo7fbAezBc0nBh-?usp=sharing) into the `vid` directory. Number videos from 0 to 10.
Then run `make dev`.

## Build

Run `make prepare; make jpg; make build`. This will get all files into `dist`. You can then serve
those files using a static web server such as Nginx.

## License
<a href="LICENSE"><img src="https://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png"></a>
