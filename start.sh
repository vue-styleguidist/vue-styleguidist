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
if [ $1 = "build" ] 
then
    if [ -z "${exampleName##*vuecli3*}" ] 
    then
        npm run styleguide:build -- $extra
    else
        pnpm styleguide:build -- $extra
    fi
else
    npm run styleguide -- $extra
fi
