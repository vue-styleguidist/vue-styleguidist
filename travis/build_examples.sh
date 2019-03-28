#!/bin/bash
cd examples
for D in *; do yarn build "${D}"; done