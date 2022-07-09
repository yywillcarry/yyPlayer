<template>
  <div id="app">
    <headers></headers>
    <router-view />
    <audio ref="yyPlayer" ></audio>
  </div>
</template>
<script>
import headers from "components/headers";
import { getPlayListDetail  } from "api/index.js";
import { mapActions } from "vuex";
export default {
  name: "App",
  components: {
    headers,
  },
  created() {
    // 24381616
    // 3778678

    getPlayListDetail(3778678).then((result) => {

      this.$store.dispatch("setPlayList",result.tracks);
    });
    this.$nextTick(() => {
      this.setAudio(this.$refs.yyPlayer);
    });
  },
  methods: {
    ...mapActions(["setAudio"]),
  },
};
</script>
<style lang="less">
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: @text_color;
  font-size: @font_size_medium;

  .router-view {
    width: 100%;
    height: 100%;
  }
  audio {
    position: fixed;
  }
}
</style>
