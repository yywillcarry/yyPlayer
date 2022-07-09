<template>
  <div class="musicList">
    <template v-if="list.length > 0">
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span v-if="listType == 'duration'" class="list-time">时长</span>
        <span v-else class="list-album">专辑</span>
      </div>
      <div ref="listContent" class="list-content" @scroll="listScroll($event)">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="list-item"
          :class="{ on: playing && currentMusic.id == item.id }"
          @dblclick="selectItem(item, index)"
        >
          <span class="list-num" v-text="index + 1"></span>
          <div class="list-name">
            <span>{{ item.name }}</span>
            <div class="list-menu">
              <yy-icon
                class="hover"
                :type="getIconType(item)"
                :size="40"
                @click.stop="selectItem(item, index)"
              />
            </div>
          </div>
          <span class="list-artist">{{ item.singer }}</span>
          <span v-if="listType == 'duration'" class="list-time">
            {{ item.duration % 3600 | format }}
            <yy-icon
              class="hover list-menu-icon-del"
              type="delete-mini"
              :size="40"
              @click="deleteItem(item, index)"
            />
          </span>
          <span v-else class="list-album">{{ item.album }}</span>
        </div>
        <slot name="listBtn"></slot>
      </div>
    </template>
    <!-- <mm-no-result v-else title="弄啥呢，怎么啥也没有！！！" /> -->
  </div>
</template>

<script>
import { format } from "utils/index.js";
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  name: "musicList",
  data() {
    return {
      lockUp: true,
    };
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    listType: {
      type: String,
      default: "album",
    },
  },
  filters: {
    format,
  },
  watch: {
    list(newlist, oldlist) {
      if (newlist.length !== oldlist.length) {
        this.lockUp = false;
      } else if (
        newlist[newlist.length - 1].id !== oldlist[oldlist.length - 1].id
      ) {
        this.lockUp = false;
      }
    },
  },
  methods: {
    selectItem(item, index) {
      if (this.currentMusic.id && item.id == this.currentMusic.id) {
        this.setPlaying(!this.playing);
        return;
      }
      // if(this.currentMusic.id &&item.id!==this.currentMusic.id){
      //     this.setPlaying(true)
      // }
      this.$emit("select", item, index);
    },
    deleteItem(item, index) {
      this.$emit("del", item, index);
    },
    getIconType(item) {
      return this.playing && item.id == this.currentMusic.id
        ? "pause-mini"
        : "play-mini";
    },
    listScroll(e) {
      if (this.lockUp) {
        return;
      }
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      this.scrollTop = scrollTop;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        this.lockUp = true;
        this.$emit("pullUpList");
      }
    },
    scrollTo() {
      this.$refs.listContent.scrollTop = 0;
    },
    ...mapActions(["setPlaying"]),
  },
  computed: {
    ...mapGetters(["currentIndex", "currentMusic"]),
    ...mapState(["playing"]),
  },
  activated() {
    this.scrollTop &&
      this.$refs.listContent &&
      (this.$refs.listContent.scrollTop = this.scrollTop);
  },
};
</script>

<style lang="less" scoped>
.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;

  .list-name {
    padding-left: 40px;
    user-select: none;
  }
}

.list-content {
  width: 100%;
  height: calc(~"100% - 60px");
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.list-no {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: @text_color;
}

.list-item {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 50px;
  overflow: hidden;

  &.list-item-no {
    justify-content: center;
    align-items: center;
  }

  &.on {
    color: #fff;

    .list-num {
      font-size: 0;
      background: url("~assets/img/wave.gif") no-repeat center center;
    }
  }

  &:hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }
  }

  &:not([class*="list-header"]):hover {
    .list-name {
      padding-right: 80px;

      .list-menu {
        display: block;
      }
    }

    .list-time {
      font-size: 0;

      .list-menu-icon-del {
        display: block;
      }
    }
  }

  .list-num {
    display: block;
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }

  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;

    & > span {
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }

    small {
      margin-left: 5px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    /*hover菜单*/

    .list-menu {
      display: none;
      position: absolute;
      top: 50%;
      right: 10px;
      height: 40px;
      font-size: 0;
      transform: translateY(-50%);
    }
  }

  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    @media (max-width: 1440px) {
      width: 200px;
    }
    @media (max-width: 1200px) {
      width: 150px;
    }
  }

  .list-time {
    display: block;
    width: 60px;
    position: relative;

    .list-menu-icon-del {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}

@media (max-width: 960px) {
  .list-item .list-name {
    padding-right: 70px;
  }
}

@media (max-width: 768px) {
  .list-item {
    .list-name .list-menu {
      display: block;
    }

    .list-artist,
    .list-album {
      width: 20%;
    }
  }
}

@media (max-width: 640px) {
  .list-item {
    .list-artist {
      width: 80px;
    }

    .list-album,
    .list-time {
      display: none;
    }
  }
}
</style>
