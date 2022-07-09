<template>
  <!--搜索-->
  <div class="search">
    <div class="search-head">
      <span
        v-for="(item, index) in Artists"
        :key="index"
        @click="clickHot(item.first)"
      >
        {{ item.first }}
      </span>
      <input
        v-model.trim="searchValue"
        class="search-input"
        type="text"
        placeholder="音乐/歌手"
        @keyup.enter="onEnter"
      />
    </div>
    <music-list
      ref="musicList"
      :list="list"
      list-type="pullup"
      @select="selectItem"
      @pullUpList="pullUpList"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import { getSearchInfo, getSearchHot, getMusicDetail } from "api";
import { formatSongs } from "utils/song.js";
import musicList from "components/musicList";
export default {
  name: "Search",
  components: {
    musicList,
  },
  data() {
    return {
      searchValue: "", // 搜索关键词
      Artists: [], // 热搜数组
      list: [], // 搜索数组
      page: 0, // 分页
      lockUp: true, // 是否锁定上拉加载事件,默认锁定
    };
  },
  computed: {
    ...mapGetters(["currentMusic"]),
    ...mapState(["playing"]),
  },
  created() {
    // 获取热搜
    getSearchHot().then((result) => {
      this.Artists = result.result.hots.slice(0, 5);
    });
  },

  methods: {
    // 点击热搜
    clickHot(name) {
      this.searchValue = name;
      this.onEnter();
    },
    // 搜索事件
    async onEnter() {
      let result = await getSearchInfo(this.searchValue);

      this.list = formatSongs(result.result.songs);
      this.$refs.musicList.scrollTo()
    },
    // 播放歌曲
    selectItem(music) {
      this.addOneSong(music);
    },

    ...mapMutations({
      setPlaying: "SET_PLAYING",
    }),
    async pullUpList() {
      this.page += 1;
      let result = await getSearchInfo(this.searchValue, this.page);
      if (!result.result.songs) {
        alert("没有更多歌曲了");
        return;
      }
      this.list = [...this.list, ...formatSongs(result.result.songs)];
    },
    ...mapActions(["addOneSong"]),
  },
};
</script>

<style lang="less" scoped>
.search {
  position: relative;
  width: 100%;
  height: 100%;
  .search-head {
    display: flex;
    height: 40px;
    padding: 10px 15px;
    overflow: hidden;
    background: @search_bg_coloe;
    span {
      line-height: 40px;
      margin-right: 15px;
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
      @media (max-width: 640px) {
        & {
          display: none;
        }
      }
    }
    .search-input {
      flex: 1;
      height: 40px;
      box-sizing: border-box;
      padding: 0 15px;
      border: 1px solid @btn_color;
      outline: 0;
      background: transparent;
      color: @text_color_active;
      font-size: @font_size_medium;
      box-shadow: 0 0 1px 0 #fff inset;
      &::placeholder {
        color: @text_color;
      }
    }
  }
  .musicList {
    width: 100%;
    height: calc(~"100% - 50px");
  }
}
</style>
