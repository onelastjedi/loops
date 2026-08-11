IMAGES := $(wildcard ./img/*.jpg)

dev:
	python3 -m http.server --bind 0.0.0.0 8080

inline-js:
	awk 'BEGIN { \
		while ((getline line < "./dist/index.js") > 0) \
			script = script line \
	} \
	/<script src="index\.js"><\/script>/ { \
		print "<script>"; \
		printf "%s", script; \
		print "</script>"; \
		next \
	} \
	{ print }' ./dist/index.html > tmp && mv tmp ./dist/index.html

inline-css:
	awk 'BEGIN { \
		while ((getline line < "./dist/index.css") > 0) \
			css = css line \
	} \
	/<link rel="stylesheet" href="index\.css">/ { \
		print "<style>"; \
		printf "%s", css; \
		print "</style>"; \
		next \
	} \
	{ print }' ./dist/index.html > tmp && mv tmp ./dist/index.html

jpg:
	@for file in ./vid/*.mp4; do \
		ffmpeg -i "$$file" -vframes:v 1 -q:v 2 "$${file%.*}.jpg"; \
	done
	mv ./vid/*.jpg ./img/

webm:
	for file in ./vid/*.mp4; do \
		ffmpeg -i $$file -c:v libvpx-vp9 -b:v 0 -crf 45 -c:a libopus -b:a 64k "$${file%.*}.webm"; \
	done

webp:
	@for f in $(IMAGES); do \
		cwebp "$$f" -q 30 -o "$${f%.jpg}.webp"; \
		echo "$$f"; \
		rm -f $$f; \
	done

minify-css:
	minify index.css > ./dist/index.css

minify-js:
	minify index.js > ./dist/index.js

minify-html:
	cp ./dist/index.html ./dist/index.html.tmp
	minify --type=html --html-keep-document-tags --html-keep-quotes ./dist/index.html.tmp > ./dist/index.html
	rm -f ./dist/index.html.tmp

copy:
	cp index.html ./dist/index.html
	cp -r img ./dist/img
	cp -r vid ./dist/vid
	cp -r api ./dist/api
	cp favicon.ico ./dist/favicon.ico

clean:
	rm -rf ./dist
	rm -rf ./img

makedir:
	mkdir img
	mkdir dist

prepare: clean makedir

build: webp copy minify-css minify-js inline-css inline-js minify-html
