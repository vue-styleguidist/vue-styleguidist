# Test Documentation

You can build a docuemntation here from scratch if you need to or integrate it with your current vuepress site. This opens up the posibility for a lot more including using docz or even gatsby to showcase your components.

Click through the components on the left and open the `.vuepress/config.js` file. You should see that the docs are just using the same tools that you are used to.

## The way it works

1.  Look inside the components folder and creat a markdown file from every component
1.  Combine this documentation markdown file with the `Readme.md` and the `<docs>` block
1.  Save all those component documentations in the docs folder
1.  Launch a chokidar watcher to update each doc when needed
1.  Start vuepress to visualize the obtained markdown files
