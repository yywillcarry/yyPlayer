<!-- 音量控制组件 -->
<template>
  <div class="volume">
    <yy-icon
      class="pointer volume-icon"
      :type="getVolumeType()"
      :size="30"
      @click="changeVolumeIcon"
    />
    <div class="volume-progress-wrapper">
      <yy-progress
        :percent="volume"
        @progressChangeEnd="handleVolumeChange"
        @progressChange="handleVolumeChange"
      />
    </div>
  </div>
</template>

<script>
import yyProgress from "components/yyProgress";

export default {
  name: "Volume",
  components: {
    yyProgress,
  },
  props: {
    volume: {
      type: Number,
    },
  },
  computed: {
    isMute:{
      get(){
          return this.volume == 0;
      },
      set(newMute){
        const volume=newMute?0:this.lastVolume
        if(newMute){
          this.lastVolume=this.volume
        }
        this.handleVolumeChange(volume)
      }
    }
  },
  methods: {
    changeVolumeIcon() {
      this.isMute = !this.isMute;
    },
    getVolumeType() {
      return this.isMute ? "volume-off" : "volume";
    },
    handleVolumeChange(percent) {
      this.$emit("volumeChange", percent);
    },
  },
};
</script>

<style lang="less" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;
  &-icon {
    margin-right: 5px;
    color: #fff;
  }
  &-progress-wrapper {
    flex: 1;
  }
  @media (max-width: 768px) {
    top: 2px;
    width: 36px;
  }
}
</style>
