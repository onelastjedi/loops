# Vertical video sliding UI

A short-video viewing interface with vertical scrolling, similar to TikTok / Instagram Reels,
with support for mobile and desktop.

No third-party libraries were used.

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

## Development

Clone the repository and put the videos from the link into the `vid` directory.
Then run `make dev`.

## Build

Run `make build`. This will get all files into `dist`. You can then serve
those files using a static web server such as Nginx.

## License
[WTFPL](LICENSE)
