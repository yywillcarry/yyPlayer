<template>
  <!--进度条拖动-->
  <div ref="progress" class="progress" @click="barClick">
    <div class="progress-bar"></div>
    <div ref="percentProgress" class="progress-outer"></div>
    <div ref="progressInner" class="progress-inner">
      <div ref="progressDot" class="progress-dot" @mousedown="barDown"></div>
    </div>
  </div>
</template>

<script>
const dotWidth = 10;
export default {
  name: "yyProgress",
  props: {
    // 进度值一
    percent: {
      type: Number,
      default: 0,
    },
    // 进度值二（歌曲缓冲进度用）
    // percentProgress: {
    //   type: [Number],
    //   default: 0
    // },
  },
  data() {
    return {
      move: {
        status: false,
        startX: 0,
        left: 0,
      },
    };
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0) {
        let barWidth = this.$refs.progress.clientWidth - dotWidth;
        let offsetWidth = newPercent * barWidth;
        this.moveSlide(offsetWidth);
      }
    },
  },
  mounted() {
    this.bindEvents();
    let barWidth = this.$refs.progress.clientWidth - dotWidth;
    let offsetWidth = this.percent * barWidth;
    this.moveSlide(offsetWidth);
  },
  beforeDestroy() {
    this.unbindEvents();
  },
  methods: {
    bindEvents() {
      document.addEventListener("mousemove", this.barMove);
      document.addEventListener("mouseup", this.barUp);
    },
    unbindEvents() {
      document.removeEventListener("mousemove", this.barMove);
      document.removeEventListener("mouseup", this.barUp);
    },
    barClick(e) {
      let rect = this.$refs.progress.getBoundingClientRect();
      let offsetWidth = Math.min(
        this.$refs.progress.clientWidth - dotWidth,
        e.clientX - rect.left
      );

      this.moveSlide(offsetWidth);
      this.revisePercent(false);
    },
    barDown(e) {
      this.move.status = true;
      this.move.startX = e.clientX;
      this.move.left = this.$refs.progressInner.clientWidth;
    },
    barMove(e) {
      if (!this.move.status) {
        return false;
      }
      //  e.stopPropagation()
      //   e.preventDefault();
      let endX = e.clientX;
      let dist = endX - this.move.startX;
      let offsetWidth = Math.min(
        this.$refs.progress.clientWidth - dotWidth,
        this.move.left + dist
      );

      this.moveSlide(offsetWidth);
      this.revisePercent(true);
    },
    barUp(e) {
      if (this.move.status) {
        this.move.status = false;
        this.revisePercent(false);
      }
    },
    moveSlide(offsetWidth) {
      this.$refs.progressInner.style.width = offsetWidth + "px";
    },
    revisePercent(isEnd = true) {
      let percent =
        this.$refs.progressInner.clientWidth /
        (this.$refs.progress.clientWidth - dotWidth);
      this.$emit(isEnd ? "progressChange" : "progressChangeEnd", percent);
    },
  },
};
</script>

<style lang="less">
.progress {
  position: relative;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  .progress-bar {
    height: 2px;
    width: 100%;
    background: @bar_color;
  }
  .progress-outer {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: rgba(255, 255, 255, 0.2);
  }
  .progress-inner {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: @line_color;
    .progress-dot {
      position: absolute;
      top: 50%;
      right: -5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: @dot_color;
      transform: translateY(-50%);
    }
  }
}
</style>
