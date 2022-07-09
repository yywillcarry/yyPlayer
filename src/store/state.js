import { getHistoryList } from 'utils/storage'
export default {
    yyid: JSON.parse(localStorage.getItem("yyid")) || null, //用户id
    playList: [], //播放列表
    currentIndex: -1, //当前音乐索引
    audio: null, //audio元素
    playing: false, //播放状态
    mode: Number(localStorage.getItem('mode')) || 0,
    orderList: [],
    yycookie: localStorage.getItem('yycookie') || null,
    historyList: getHistoryList() || []
}