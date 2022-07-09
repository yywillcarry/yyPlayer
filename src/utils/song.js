function assignSinger(singers) {
    let arr = []
    singers.forEach(item => {
        arr.push(item.name)
    })
    return arr.join("/")
}
class Song {
    constructor({ id, name, singer, album, image, duration, url }) {
        this.id = id
        this.name = name
        this.singer = singer
        this.album = album
        this.image = image
        this.duration = duration
        this.url = url
    }
}
export function createPlayList(music) {
    return new Song({
        id: music.id,
        name: music.name,
        singer: music.ar.length > 0 && assignSinger(music.ar),
        album: music.al.name,
        image: music.al.picUrl,
        duration: music.dt / 1000,
        url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`
    })
}
export function formatSongs(list) {
    let Songs = []
    list.forEach(item => {
        if (item.id) {
            Songs.push(createPlayList(item))
        }
    })
    return Songs
}