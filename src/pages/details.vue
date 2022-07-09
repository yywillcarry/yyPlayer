<template>
  <!--歌单详情-->
  <div class="details">
    <!-- <mm-loading v-model="mmLoadShow" /> -->
    <music-list :list="list" @select="selectItem" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getPlayListDetail } from "api";
// import MmLoading from 'base/mm-loading/mm-loading'
import musicList from "components/musicList";
// import { loadMixin } from '@/utils/mixin'
export default {
  name: "Detail",
  components: {
    musicList,
  },
  //   mixins: [loadMixin],
  data() {
    return {
      list: [], // 列表
    };
  },
  created() {
    // 获取歌单详情
    this.getSongList();
  },
  methods: {
    // 播放暂停事件
    selectItem(item, index) {
      this.selectPlay({ list: this.list, index });
    },
    async getSongList() {
      let result = await getPlayListDetail(this.$route.params.id);

      this.list = result.tracks;
      document.title = `${result.name} - yyPlayer在线音乐播放器`;
      // this.list = playlist.tracks
      // this._hideLoad()
    },
    ...mapActions(["selectPlay"]),
  },
};
</script>

<style lang="less" scoped>
.details {
  position: relative;
  width: 100%;
  height: 100%;
  .musicList {
    width: 100%;
    height: 100%;
  }
}
</style>
