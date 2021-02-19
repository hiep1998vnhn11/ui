const state = {
  mini: false,
  drawer: true
}

const getters = {
  mini: state => state.mini,
  drawer: state => state.drawer
}

const actions = {
  setMini({ commit, state }, mini) {
    if (state.mini !== mini) commit('SET_MINI', mini)
  },
  setDrawer({ commit }, drawer) {
    if (state.drawer !== drawer) commit('SET_DRAWER', drawer)
  }
}

const mutations = {
  SET_MINI(state, mini) {
    state.mini = mini
  },
  SET_DRAWER(state, drawer) {
    state.drawer = drawer
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
