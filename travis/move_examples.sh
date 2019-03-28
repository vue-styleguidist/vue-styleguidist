#!/bin/bash
cd examples
for D in *; do mv "${D}"/dist ../docs/dist/"${D}"; done