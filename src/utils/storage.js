const _storage = window.localStorage
const storage = {
    get(key, data = []) {
        if (_storage) {
            return _storage.getItem(key) ?
                Array.isArray(data) ?
                JSON.parse(_storage.getItem(key)) :
                // _storage.getItem(key) :
                _storage.getItem(key) :
                data
        }
    },
    set(key, val) {
        if (_storage) {
            _storage.setItem(key, val)
        }
    },
    clear(key) {
        if (_storage) {
            _storage.removeItem(key)
        }
    }
}
const defaultVolume = 0.8
export function setVolume(volume = defaultVolume) {
    localStorage.setItem("volume", volume)
}
export function getVolume() {
    return Number(localStorage.getItem("volume"))
}
export function setHistoryList(music) {
    let list = storage.get('historyList')
    let index = list.findIndex(item => item.id == music.id)
    if (index == 0) {
        return list
    }
    if (index > 0) {
        list.splice(index, 1)
    }
    list.unshift(music)
    if (list.length > 100) {
        list.pop()
    }

    localStorage.setItem('historyList', JSON.stringify(list))
    return list
}
export function getHistoryList() {
    return storage.get('historyList')
}