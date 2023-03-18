// https://github.com/vue-styleguidist/vue-styleguidist/issues/1456

export default {
  name: 'mixin',
  props: {
    /**
     * @type { String } // here
     */
    a: {
      type: String,
      default: 'xxxx'
    }
  }
}