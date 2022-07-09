let retry = 1
export default {
    initAudio(that) {
        const audio = that.audio
        audio.onprogress = () => {

        }
        audio.onplay = () => {
            that.musicReady = true
        }
        audio.ontimeupdate = () => {
            that.currentTime = audio.currentTime

        }
        audio.onended = () => {
            if (that.mode == 3) {
                that.loop()
            } else {
                that.next()
            }
        }
        audio.oncanplay = () => {
            if (that.historyList.length == 0 || that.currentMusic.id !== that.historyList[0].id) {

                that.setHistory(that.currentMusic)
            }
        }
        audio.onerror = () => {
            if (retry == 0) {
                let errormsg = '当前音乐不可播放'
                if (that.playList.length == 1) {
                    errormsg = '没有可播放的音乐哦~'
                }
                // alert(errormsg)
                console.log(errormsg);
                that.next()
            } else {
                retry -= 1
                audio.url = that.currentMusic.url
                audio.load()
            }
        }
        audio.onpuse = () => {
            that.setPlaying(false)
        }
    }
}