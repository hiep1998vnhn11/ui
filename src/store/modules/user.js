import axios from 'axios'
import Cookies from 'js-cookie'

const state = {
  currentUser: null,
  token: Cookies.get('access_token') || null,
  socket: null,
  setHeader() {
    axios.defaults.headers.common['Authorization'] =
      'Bearer' + Cookies.get('access_token')
  },
  friends: []
}

const getters = {
  currentUser: state => state.currentUser,
  socket: state => state.socket,
  friends: state => state.friends,
  isLoggedIn: state => !!state.token
}

const actions = {
  async login({ commit, state }, user) {
    const response = await axios.post('/auth/login', {
      email: user.email,
      password: user.password
    })
    const token = response.data.access_token
    Cookies.set('access_token', token, { expires: 1 })
    state.setHeader()
    const userResponse = await axios.post('/auth/me')
    commit('SET_CURRENT_USER', userResponse.data.data)
    const friendResponse = await axios.post('/v1/user/friend/get')
    commit('SET_FRIENDS', friendResponse.data.data)
    commit('SET_ACCESS_TOKEN', token)
  },
  async getUser({ commit, state }) {
    state.setHeader()
    const response = await axios.post('/auth/me')
    commit('SET_CURRENT_USER', response.data.data)
  },
  async logout(context) {
    if (context.getters.isLoggedIn) {
      context.state.setHeader()
      await axios.post('/auth/logout')
      Cookies.remove('access_token')
      context.commit('DESTROY_TOKEN')
    }
  },
  async register(context, user) {
    const response = await axios.post('/auth/register', user)
    console.log(response)
  },
  async changeInfo(context, payload) {
    const url = '/v1/user/update_profile'
    const response = await axios.post(url, payload)
    return response.data
  },
  async getFriend(context) {
    const url = '/v1/user/friend/get'
    const response = await axios.post(url)
    context.commit('SET_FRIENDS', response.data.data)
  }
}

const mutations = {
  SET_CURRENT_USER: function(state, user) {
    state.currentUser = user
  },
  SET_ACCESS_TOKEN: function(state, token) {
    state.token = token
  },
  DESTROY_TOKEN: function(state) {
    state.token = null
    state.currentUser = null
    state.friends = []
  },
  SET_FRIENDS: function(state, friends) {
    state.friends = friends
  },
  USER_LOGGED_IN: function(state, userId) {
    state.friends.forEach(friend => {
      if (friend.friend_id === userId) {
        friend.user_friend.online_status.status = true
      }
    })
  },
  USER_LOGGED_OUT: function(state, userId) {
    state.friends.forEach(friend => {
      if (friend.friend_id === userId) {
        friend.user_friend.online_status.status = false
      }
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
