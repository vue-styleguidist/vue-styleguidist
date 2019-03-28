#!/bin/bash
for D in examples/*/; do yarn build "${D}"; done