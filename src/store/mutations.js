export default {
    SETID(state, uid) {
        state.yyid = uid
    },
    SETPLAYLIST(state, playList) {
        state.playList = playList
    },
    SETORDERLIST(state, playList) {
        state.orderList = playList
    },
    SETCURRENTINDEX(state, index) {
        state.currentIndex = index
    },
    SETAUDIO(state, player) {
        state.audio = player
    },
    SETPLAYING(state, playing) {
        state.playing = playing
    },
    SETMODE(state, mode) {
        state.mode = mode
    },
    SETCOOKIE(state, cookie) {
        state.cookie = cookie
    },
    SETHISTORYLIST(state, list) {
        state.historyList = list
    }

}