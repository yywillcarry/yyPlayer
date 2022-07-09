import { setHistoryList } from 'utils/storage.js'
export default {
    setId({ commit }, uid) {
        localStorage.setItem('yyid', uid)
        commit('SETID', uid)
    },
    setPlayList({ commit }, playList) {
        commit('SETPLAYLIST', playList)
        commit("SETORDERLIST", playList)
    },
    setCurrentIndex({ commit }, index) {
        commit('SETCURRENTINDEX', index)
    },
    removePlayListItem({ commit, state, getters }, { list, index }) {
        let currentIndex = getters.currentIndex
        if (index < getters.currentIndex) {
            commit('SETCURRENTINDEX', --currentIndex)
        }
        commit('SETPLAYLIST', list)
        if (!list.length) {
            commit('SETPLAYING', false)
        }
    },
    setAudio({ commit }, player) {
        commit('SETAUDIO', player)
    },
    setPlaying({ commit }, playing) {
        commit('SETPLAYING', playing)
    },
    setMode({ commit }, mode) {
        localStorage.setItem("mode", mode)
        commit('SETMODE', mode)
    },
    selectPlay({ dispatch }, { list, index }) {

        dispatch('setPlayList', list)
        dispatch('setCurrentIndex', index)
        dispatch('setPlaying', true)
    },
    addOneSong({ dispatch, state }, music) {
        let list = state.playList
        let index = list.findIndex(item => item.id == music.id)
        if (index != -1) {
            dispatch('setCurrentIndex', index)
        } else {
            list.unshift(music)
            dispatch('setPlayList', list)
            dispatch('setCurrentIndex', 0)

        }
        dispatch('setPlaying', true)

    },
    setCookie({ commit }, cookie) {
        localStorage.setItem('yycookie', cookie)
        commit('SETCOOKIE', cookie)
    },
    setHistory({ commit }, music) {
        commit('SETHISTORYLIST', setHistoryList(music))
    },
    clearHistory({ commit }) {
        localStorage.clear()
        commit('SETHISTORYLIST', [])
    },
    removeHistory({ commit }, list) {
        localStorage.setItem('historyList', JSON.stringify(list))
        commit('SETHISTORYLIST', list)
    }
}