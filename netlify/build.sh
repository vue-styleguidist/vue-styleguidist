#!/bin/bash
# this is the script used by netlify to create the previews
# NOTA: even is the script is in a netlify subfolder,
# it is going to be executed in the root of the repo
# => no need to cd ..
# node ./docs/.vuepress/preprocess.js --netlify
# npm run vuepress build docs

# since netlify does not have time to compile all examples
# only update the examples that are noted in examples.yml 
echo 'building examples'
while IFS= read -r line; do
(
    # remove windows \r char from the end of the line
    example=${line%'\r'/};
    if  [[ $example != '' ]] && [[ $example != \#* ]]; then
    (
        npm run build ${example} -- --ci;
        mv "examples/${example}/dist" "docs/dist/${example}";
    )
    fi
)
done < netlify/examples.yml
