export const state = {
  count: 10
}
export const getters = {
  count: state => {
    return state.count
  }
}
export const mutations = {
  increment (state) {
    state.count++
  }
}
