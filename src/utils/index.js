export function toHttps(url) {
    if (!isString(url)) {
        return url
    }
    return url.replace('http://', 'https://')
}
// 时间格式化
export function format(value) {
    let minute = Math.floor(value / 60)
    let second = Math.floor(value % 60)
    return `${addZero(minute)}:${addZero(second)}`
}
// 补0函数
export function addZero(s) {
    return s < 10 ? '0' + s : s
}
// 歌词解析
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
export function parseLyric(lrc) {
    const lines = lrc.split('\n')
    const lyric = []
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const result = timeExp.exec(line)
        if (!result) {
            continue
        }
        const text = line.replace(timeExp, '').trim()
        if (text) {
            lyric.push({
                time: (result[1] * 6e4 + result[2] * 1e3 + (result[3] || 0) * 1) / 1e3,
                text
            })
        }
    }
    return lyric
}

// function deepCopy(object) {
//     if (!object || typeof object !== "object") return object;
//     let newObject = Array.isArray(object) ? [] : {};
//     for (let key in object) {
//         if (object.hasOwnProperty(key)) {
//             newObject[key] = typeof object[key] === "object" ? deepCopy(object[key]) : object[key];
//         }
//     }
//     return newObject;
// }
function deepCopy(obj) {
    if (!obj || typeof obj !== 'object') {
        return obj
    }
    let result = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = typeof obj[key] == 'object' ? deepCopy(obj[key]) : obj[key]
        }
    }
    return result
}
export function randomSort(array) {
    let length = array.length
    if (!length) {
        return []
    }
    let arr = deepCopy(array)
    while (length !== 0) {
        let random = Math.floor(Math.random() * length)
        length--;
        [arr[random], arr[length]] = [
            arr[length], arr[random]
        ]
    }
    return arr
}

export function throttle(fn, delay) {
    let timer
    return function() {
        let that = this
        if (timer) {
            return
        }
        timer = setTimeout(function() {
            fn.call(that, ...arguments)
        }, delay)
    }
}

function isPromise(v) {
    return v !== undefined && v !== null && typeof v.then === 'function'
}

export function silencePromise(value) {
    if (isPromise(value)) {
        value.then(null, () => {})
    }
}