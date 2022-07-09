<template>
  <div class="playList">
    <music-list
      :list="playList"
      list-type="duration"
      @select="selectItem"
      @del="deleteItem"
    >
      <div slot="listBtn" class="list-btn">
        <span @click="$refs.dialog.show()">清空列表</span>
      </div>
    </music-list>

    <dialogs confirm-btn-text="清空" ref="dialog">
      <p slot="text">是否清空正在播放列表</p>
    </dialogs>
  </div>
</template>

<script>
import musicList from "components/musicList";
import dialogs from "components/dialogs";

import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "playList",
  components: {
    musicList,
    dialogs,
  },
  methods: {
    selectItem(item, index) {
    
        this.setCurrentIndex(index);
        this.setPlaying(true);
     
    },
    deleteItem(item,index) {
      let list = this.playList;
      list.splice(index, 1);
      this.removePlayListItem({list,index});
 
    },
    ...mapActions(["setCurrentIndex", "removePlayListItem", "setPlaying"]),
  },
  computed: {
    ...mapState(["playList"]),
    ...mapGetters(["currentIndex", "currentMusic"]),
  },
};
</script>
<style lang="less">
.playList {
  position: relative;
  width: 100%;
  height: 100%;
  .musicList {
    width: 100%;
    height: 100%;
    .list-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      span {
        padding: 5px 20px;
        cursor: pointer;
        user-select: none;
        &:hover {
          color: @text_color_active;
        }
      }
    }
  }
}
</style>
