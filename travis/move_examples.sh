#!/bin/bash
for D in examples/*/; do mv "${D}"dist docs/dist/"${D}"; done