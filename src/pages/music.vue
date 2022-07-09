<template>
  <div class="music">
    <div class="music-content">
      <div class="music-left">
        <music-btn />

        <keep-alive>
          <router-view v-if="$route.meta.keepAlive" class="music-list" />
        </keep-alive>
        <router-view
          v-if="!$route.meta.keepAlive"
          :key="$route.path"
          class="music-list"
        />
      </div>
      <div class="music-right">
        <div class="close-lyric">关闭歌词</div>
        <lyric
          ref="lyric"
          :lyric="lyric"
          :nolyric="nolyric"
          :lyricIndex="lyricIndex"
        />
      </div>
    </div>
    <!--播放器-->
    <div
      class="music-bar"
      :class="{ disable: !musicReady || !currentMusic.id }"
    >
      <div class="music-bar-btns">
        <yy-icon
          class="pointer"
          type="prev"
          :size="36"
          title="上一曲 Ctrl + Left"
          @click="prev"
        />
        <div
          class="control-play pointer"
          @click="play"
          title="播放暂停 Ctrl + Space"
        >
          <yy-icon :type="playing ? 'pause' : 'play'" :size="24" />
        </div>
        <yy-icon
          class="pointer"
          type="next"
          :size="36"
          title="下一曲 Ctrl + Right"
          @click="next"
        />
      </div>
      <div class="music-music">
        <div class="music-bar-info">
          <template v-if="currentMusic && currentMusic.id">
            {{ currentMusic.name }}
            <span>- {{ currentMusic.singer }}</span>
          </template>
          <template v-else>欢迎使用yyPlayer在线音乐播放器</template>
        </div>
        <div class="music-bar-time" v-if="currentMusic.id">
          {{ currentTime | format }}/{{ currentMusic.duration % 3600 | format }}
        </div>
        <yy-progress
          :percent="percentMusic"
          class="music-progress"
          @progressChange="changeMusic"
          @progressChangeEnd="changeMusic"
        />
      </div>
      <!-- @progressChange='progressMusic' @progressChangeEnd="progressMusicEnd"  -->
      <!-- 播放模式 -->
      <yy-icon
        class="icon-color pointer mode"
        :type="getMode()"
        :title="getTitle()"
        :size="30"
        @click="modeChange"
      />

      <!-- 评论 -->
      <yy-icon
        class="icon-color pointer comment"
        type="comment"
        :size="30"
        @click="openComment"
      />

      <!-- 音量控制 -->
      <div
        class="music-bar-volume"
        title="音量加减 [Ctrl + Up / Down]"
      >
        <volume :volume="volume" @volumeChange="volumeChange" />
      </div>
    </div>
    <!--遮罩-->
    <div class="Player-bg" :style="{ backgroundImage: picUrl }"></div>
    <div class="Player-mask"></div>
  </div>
</template>

<script>
import yyPlayerMusic from "./yyPlayer";
import { getSongLyricById } from "api/index.js";
import { getVolume, setVolume } from "utils/storage.js";
import Volume from "@/components/volume";
import lyric from "@/pages/lyric";
import musicBtn from "@/components/musicBtn";
import yyProgress from "@/components/yyProgress";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { parseLyric, randomSort, format, silencePromise } from "utils/index.js";
export default {
  name: "music",
  components: {
    musicBtn,
    lyric,
    Volume,
    yyProgress,
  },
  filters: {
    format,
  },
  data() {
    return {
      nolyric: false,
      lyric: [],
      lyricIndex: 0,
      playMode: ["loop", "sequence", "random", "loop-one"],
      volume: getVolume(),
      musicReady: false,
      currentTime: 0,
    };
  },
  computed: {
    ...mapGetters(["currentIndex", "currentMusic"]),
    ...mapState([
      "audio",
      "playing",
      "playList",
      "mode",
      "orderList",
      "historyList",
    ]),
    picUrl() {
      return this.currentMusic.id && this.currentMusic.image
        ? `url(${this.currentMusic.image}?param=300y300)`
        : `url(${require("assets/background/bg.jpg")})`;
    },
    percentMusic() {
      let duration = this.currentMusic.duration;
      return this.currentTime && duration ? this.currentTime / duration : 0;
    },
  },
  watch: {
    currentMusic(newval, oldval) {
      if (!newval.id) {
        this.lyric = [];
        return;
      }
      this.audio.src = newval.url;
      this.currentTime = 0;
      this.lyricIndex = 0;
      this.getSongLyric(newval.id);
    },
    playing(newval, oldval) {
      this.$nextTick(() => {
        newval ? silencePromise(this.audio.play()) : this.audio.pause();
        this.musicReady = true;
      });
    },
    currentTime(newTime) {
      if (this.nolyric) {
        return;
      }
      let temp = 0;
      for (let i = 0; i < this.lyric.length; i++) {
        if (newTime > this.lyric[i].time) {
          temp = i;
        }
      }
      this.lyricIndex = temp;
    },
  },
  mounted() {
    this.volumeChange(this.volume);
    yyPlayerMusic.initAudio(this);
  },
  methods: {
    async getSongLyric(id) {
      let result = await getSongLyricById(id);
      if (result.nolyric) {
        this.nolyric = true;
      } else {
        this.nolyric = false;
        this.lyric = parseLyric(result.lrc.lyric);
      }
      silencePromise(this.audio.play());
       this.setPlaying(true);
    },
    prev() {
      if (!this.musicReady) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index < 0) {
        index = this.playList.length - 1;
      }
      this.setCurrentIndex(index);
        this.setPlaying(true);
      this.musicReady = false;
    },
    play() {
      if (!this.musicReady) {
        return;
      }
      this.setPlaying(!this.playing);
    },
    next() {
      if (!this.musicReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index == this.playList.length && this.mode == 1) {
        this.setCurrentIndex(-1);
        this.setPlaying(false);
        return;
      }
      if (index == this.playList.length) {
        this.setCurrentIndex(0);
      } else {
        this.setCurrentIndex(index); 
      }
       this.setPlaying(true);
      this.musicReady = false;
    },
    getMode() {
      return this.playMode[this.mode];
    },
    getTitle() {
      return ["列表循环", "顺序播放", "随机播放", "单曲循环"][this.mode];
    },
    loop() {
      this.audio.currentTime = 0;
      silencePromise(this.audio.play());
      this.setPlaying(true);
      if (this.lyric.length > 0) {
        this.lyricIndex = 0;
      }
    },
    modeChange() {
      let num = (this.mode + 1) % 4;
      this.setMode(num);
      if (num == 3) {
        return;
      }
      let list = [];
      if (num == 2) {
        list = randomSort(this.orderList);
      } else {
        list = this.orderList;
      }
      this.setPlayList(list);
    },
    openComment() {
      if (!this.currentMusic.id) {
        alert("还没有播放歌曲哦！");
        return;
      }
      this.$router.push(`/music/comment/${this.currentMusic.id}`);
    },
    volumeChange(percent) {
 
      this.volume = percent;
      this.audio.volume = percent;
      setVolume(percent);
    },
    // progressMusic(percent){
    //   this.currentTime=this.currentMusic.duration*percent
    // },
    // progressMusicEnd(percent){
    //   this.audio.currentTime=this.currentMusic.duration*percent
    //   this.currentTime=this.currentMusic.duration*percent
    // },
    changeMusic(percent) {
      this.audio.currentTime = this.currentMusic.duration * percent;

    },
    ...mapActions(["setCurrentIndex", "setPlaying", "setMode", "setHistory"]),
    ...mapMutations({
      setPlayList: "SETPLAYLIST",
    }),
  },
};
</script>

<style lang="less">
.music {
  padding: 75px 25px 25px 25px;
  width: 100%;
  max-width: 1750px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .music-content {
    display: flex;
    width: 100%;
    height: calc(~"100% - 80px");
    .music-left {
      flex: 1;
      height: 100%;
      overflow: hidden;
      .music-list {
        height: calc(~"100% - 60px");
      }
    }
    .music-right {
      position: relative;
      width: 310px;
      margin-left: 10px;
      .close-lyric {
        position: absolute;
        top: 0;
        z-index: 1;
        cursor: pointer;
      }
    }
  }

  /*底部Player-bar*/
  .music-bar {
    display: flex;
    align-items: center;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    padding-bottom: 15px;
    color: #fff;
    &.disable {
      pointer-events: none;
      opacity: 0.6;
    }
    .icon-color {
      color: #fff;
    }
    .music-bar-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 180px;
      .control-play {
        .flex-center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
        .icon-bofang101 {
          transform: translateX(2px);
        }
      }
    }

    .flex-center;
    .btn-prev {
      width: 19px;
      min-width: 19px;
      height: 20px;
      background-position: 0 -30px;
    }
    .btn-play {
      width: 21px;
      min-width: 21px;
      height: 29px;
      margin: 0 50px;
      background-position: 0 0;
      &.btn-play-pause {
        background-position: -30px 0;
      }
    }
    .btn-next {
      width: 19px;
      min-width: 19px;
      height: 20px;
      background-position: 0 -52px;
    }
    .music-music {
      position: relative;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      padding-left: 40px;
      font-size: @font_size_small;
      color: @text_color_active;
      .music-bar-info {
        height: 15px;
        padding-right: 80px;
        line-height: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .music-bar-time {
        position: absolute;
        top: 0;
        right: 5px;
      }
    }
    .mode,
    .comment,
    .music-bar-volume {
      margin-left: 20px;
    }

    // 音量控制
    .volume-wrapper {
      margin-left: 20px;
      width: 150px;
    }
  }

  /*遮罩*/
  .Player-mask,
  .Player-bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }

  .Player-mask {
    z-index: -1;
    background-color: @mask_color;
  }

  .Player-bg {
    z-index: -2;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;

    filter: blur(12px);
    // opacity: 0.7;
    transition: all 0.8s;
    transform: scale(1.1);
  }

  @media (min-width: 960px) {
    .close-lyric {
      display: none;
    }
  }

  //当屏幕小于960时
  @media (max-width: 960px) {
    .music-right {
      display: none;
      &.show {
        display: block;
        margin-left: 0;
        width: 100%;
      }
    }
  }
  //当屏幕小于768时
  @media (max-width: 768px) {
    & {
      padding: 75px 15px 5px 15px;
    }

    .music-content .music-left {
      .music-list {
        font-size: @font_size_medium;
      }
    }

    .music-bar {
      .music-bar-info span,
      .music-bar-volume .Progress {
        display: none;
      }
    }
  }
  //当屏幕小于520时
  @media (max-width: 520px) {
    .music-bar {
      position: relative;
      flex-direction: column;
      .music-bar-btns {
        width: 60%;
        margin-top: 15px;
        order: 2;
      }
      .music-music {
        padding-left: 0;
        order: 1;
      }
      & > i.mode {
        position: absolute;
        top: 40px;
        left: 5px;
        margin: 0;
      }
      .comment {
        position: absolute;
        top: 40px;
        right: 5px;
      }
      .music-bar-volume {
        display: none;
      }
    }
  }
}
</style>