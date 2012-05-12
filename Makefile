SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

BASE_FILES = ${SRC_DIR}/js/base.js\
	${SRC_DIR}/js/story.js\
	${SRC_DIR}/js/story_item.js\
	${SRC_DIR}/js/editor_shortcuts.js\
	${SRC_DIR}/js/inline_editable.js\
	${SRC_DIR}/js/sticky.js\
	${SRC_DIR}/js/text_editor.js\
	${SRC_DIR}/js/journal.js\
	${SRC_DIR}/js/undo.js\
	${SRC_DIR}/js/dropfile.js\
	${SRC_DIR}/js/plugins/factory.js\
	${SRC_DIR}/js/plugins/paragraph.js\
	${SRC_DIR}/js/plugins/rdoc.js\
	${SRC_DIR}/js/plugins/todo.js\
	${SRC_DIR}/js/plugins/image.js\
	${SRC_DIR}/js/plugins/unknown.js\
	${SRC_DIR}/js/plugins/layouts/one_column_layout.js\

SHELL := /bin/bash

jshint:
	jshint src
	jshint spec

build: jshint
	@@rm -rf ${DIST_DIR}
	@@mkdir ${DIST_DIR}
	@@cat ${BASE_FILES} > ${DIST_DIR}/wikimate.js
	uglifyjs ${DIST_DIR}/wikimate.js > ${DIST_DIR}/wikimate-min.js
	@@cp -r lib ${DIST_DIR}
	@@cp -r src/css ${DIST_DIR}
	@@cp -r src/images ${DIST_DIR}
	@@cp examples/packaged_demo.html ${DIST_DIR}

.PHONY: build