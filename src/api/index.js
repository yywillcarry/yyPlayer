import request from "./request";
import { formatSongs } from 'utils/song.js'

export const getUesrPlayList = (uid) => {
    return request({
        url: `/user/playlist`,
        method: 'get',
        params: { uid }
    })
}
export const getPlayListDetail = (id) => {
    return new Promise((resolve, reject) => {
        request({
            url: "/playlist/detail",
            method: 'get',
            params: { id }
        }).then(({ playlist }) => {

            if (!playlist || !Array.isArray(playlist.trackIds)) {
                reject(new Error('获取歌单详情失败'))
                return
            }
            const { trackIds, tracks } = playlist
            if (trackIds.length == tracks.length) {
                playlist.tracks = formatSongs(playlist.tracks)
                resolve(playlist)
                return
            }
            let ids = trackIds.slice(0, 200).map(v => v.id).toString()

            getMusicDetail(ids).then(({ songs }) => {
                playlist.tracks = formatSongs(songs)
                resolve(playlist)
            })
        })
    })

}
export const getMusicDetail = (ids) => {
    return request({
        url: '/song/detail',
        method: 'get',
        params: { ids },

    })
}
export const getSongLyricById = (id) => {
    return request({
        url: '/lyric',
        method: 'get',
        params: { id }
    })
}
export const getTopList = () => {
    return request({
        url: '/toplist/detail',
        method: 'get'
    })
}
export const getPersonalized = () => {
    return request({
        url: '/personalized',
        method: 'get'
    })
}
export const getSearchInfo = (keywords, page = 0, limit = 30) => {
    return request({
        url: '/cloudsearch',
        method: 'get',
        params: {
            keywords,
            limit,
            offset: page * limit
        }
    })
}
export const getSearchHot = () => {
    return request({
        url: '/search/hot',
        method: 'get'
    })
}
export const getComment = (id, page, limit = 20) => {
        return request({
            url: 'comment/music',
            params: {
                offset: page * limit,
                id,
                limit
            }
        })
    }
    // export const test = () => {
    //     return request({
    //         url: '/follow?id=32953014&t=5',
    //         method: 'get'
    //     })
    // }
export const getQRcodeKey = () => {
    return request({
        url: '/login/qr/key',
        method: 'get',
        params: { timestamp: Date.now() }
    })
}
export const getQRcode = (key => {
    return request({
        url: '/login/qr/create',
        method: 'get',
        params: { key, timestamp: Date.now() }
    })
})
export const getQRcodeState = (key => {
    return request({
        url: '/login/qr/check',
        method: 'get',
        params: { key, timestamp: Date.now() }
    })
})
export const getLoginState = (cookie) => {
    return request({
        url: '/login/status',
        method: 'get',
        params: { cookie, timestamp: Date.now() }
    })
}