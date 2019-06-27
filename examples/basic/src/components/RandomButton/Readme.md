You can `require` external files in your examples:

    import {all as names} from 'dog-names';
    import {three as localNames} from './dog-names';

    <RandomButton :variants="names" />
    <RandomButton :variants="localNames" />

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
