You can `require` external files in your examples:

    const names = require('dog-names').all;
    <RandomButton :variants="names" />

Another example initializing Vue

    const names = require('dog-names').all;

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
