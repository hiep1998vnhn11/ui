import { io } from 'socket.io-client'
const state = {
  socket: null
}

const getters = {
  socket: state => state.socket
}

const actions = {
  connectSocket({ commit, rootState }) {
    const socket = io(process.env.VUE_APP_SOCKET_URL)
    socket.emit('login', rootState.user.currentUser.id)
    socket.emit('join', { userId: rootState.user.currentUser.id, roomId: 1 })

    // an user had send an message
    socket.on('receiptMessage', ({ userId, roomId, message, userName }) => {
      commit('message/RECEIVED_MESSAGE', message, { root: true })
      commit('thresh/RECEIVED_MESSAGE', { message, userName }, { root: true })
    })

    // An user had requested a friend request
    socket.on('responseAddFriend', data => {
      commit('notification/ADD_NOTIFICATION', data, { root: true })
    })

    // An user had accepted a friend request
    socket.on('acceptFriendNotification', data => {
      console.log(data)
    })

    // An user had logged in
    socket.on('userLoggedIn', userId => {
      commit('user/USER_LOGGED_IN', userId, { root: true })
    })

    // An user had logged out
    socket.on('userLoggedOut', userId => {
      commit('user/USER_LOGGED_OUT', userId, { root: true })
    })
    window.socket = socket
    commit('SET_SOCKET', socket)
  },
  disconnect({ commit }) {
    commit('DISCONNECT_SOCKET')
  }
}

const mutations = {
  SET_SOCKET: function(state, socket) {
    state.socket = socket
  },
  DISCONNECT_SOCKET: function(state) {
    state.socket = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
