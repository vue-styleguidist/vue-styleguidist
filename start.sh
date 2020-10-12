# kick start one example
# use `pnpm start (or build) docgen-nuxt`

exampleName=${2:-basic}
extra=$3
case "$exampleName" in 
("docgen*") extra="";;
("docgen") extra="";;
(*) ;;
esac

cd examples/$exampleName
if [ $1 = "build" ]; 
then
    if [[ $exampleName =~ vuecli3 ]] 
    then
        pnpm styleguide:build -- $extra
    else
        npm run styleguide:build -- $extra
    fi
else
    npm run styleguide -- $extra
fi
