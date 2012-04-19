SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

BASE_FILES = ${SRC_DIR}/js/base.js\
	${SRC_DIR}/js/story.js\
	${SRC_DIR}/js/text_editor.js\
	${SRC_DIR}/js/journal.js\
	${SRC_DIR}/js/undo.js\
	${SRC_DIR}/js/plugins/paragraph.js\

SHELL := /bin/bash

jshint:
	jshint src

build: jshint
	@@rm -rf ${DIST_DIR}
	@@mkdir ${DIST_DIR}
	@@cat ${BASE_FILES} > ${DIST_DIR}/wikimate.js
	uglifyjs ${DIST_DIR}/wikimate.js > ${DIST_DIR}/wikimate-min.js

.PHONY: build