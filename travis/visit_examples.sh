#!/bin/bash
cd examples
for D in *; do yarn test:browser "${D}"; done