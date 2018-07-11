
INDEX    = index.html
ICONS    = $(wildcard icons/*)
SHADERS  = $(wildcard shaders/*)
ROOT_CSS = $(wildcard *.css)
ROOT_JS  = $(wildcard *.js)
ROOT_TS  = $(wildcard *.ts)
ROOT_TSX = $(wildcard *.tsx)
ROOT_MAP = $(wildcard *.js.map)
JSPM     = $(shell find jspm_packages -name '*.js')
JSPM_MAP = $(shell find jspm_packages -name '*.js.map')
ASSETS   = $(shell find assets -name '*.png' -o -name '*.json')
SRCS     = manifest.webmanifest $(INDEX) $(ICONS) $(ROOT_CSS) $(JSPM_MAP) $(JSPM) $(ROOT_MAP) $(ROOT_JS) $(ROOT_TS) $(ROOT_TSX) $(ASSETS) $(SHADERS)

ALL: $(addprefix dist/,$(SRCS)) dist/service-worker.js
	@echo ALL DONE!

dist/service-worker.js: $(SRCS) Makefile
	@echo GEN service-worker.js
	@pushd dist && sw-precache && popd

dist/%: %
	@echo INSTALL $<
	@install -D $< $@

clean:
	rm -rf ./dist/*