export default {
    currentMusic(state) {
        return state.playList[state.currentIndex] || {}
    },
    currentIndex(state) {
        return state.currentIndex
    }
}