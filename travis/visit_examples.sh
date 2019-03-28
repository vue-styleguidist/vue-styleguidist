#!/bin/bash
for D in examples/*/; do yarn test:browser "${D}"; done