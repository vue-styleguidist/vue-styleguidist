You can `require` external files in your examples:

    const names = require('./dog-names.json');
    <RandomButton :variants="names" />

Another example initializing Vue

    const names = require('./dog-names.json');

    new Vue({
      data(){
        return {
          list: names
        }
      },
      template: `
        <div>
          <RandomButton :variants="list" />
        </div>
      `
    })
