<template>
  <!--对话框-->
  <transition name="dialog-fade">
    <div v-show="isShow" class="dialog-box">
      <div class="dialog-wrapper">
        <div class="dialog-content">
          <div class="dialog-head" v-text="headText"></div>

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="dialog-text">
            <slot name="text"> </slot>
          </div>
          <!-- v-if="dialogType !== 'alert'" -->
          <div class="dialog-btns">
            <div
              class="btn-cancel"
              @click="cancel"
              v-text="cancelBtnText"
            ></div>
            <slot name="btn"></slot>
            <div
              class="btn-confirm"
              @click="confirm"
              v-text="confirmBtnText"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "dialogs",
  data() {
    return {
      isShow: false,
    };
  },
  props: {
    //标题
    headText: {
      type: String,
      default: "提示",
    },
    //文本内容
    bodyText: {
      type: String,
      default: "",
    },
    //取消按钮
    cancelBtnText: {
      type: String,
      default: "取消",
    },
    //确定按钮
    confirmBtnText: {
      type: String,
      default: "确定",
    },
  },
  methods: {
    hide() {
      this.isShow = false;
    },
    show() {
      this.isShow = true;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="less">
@dialog-prefix-cls: dialog;

.@{dialog-prefix-cls}-box {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1996;
  background-color: @dialog_bg_color;
  user-select: none;
  &.@{dialog-prefix-cls}-fade-enter-active {
    animation: dialog-fadein 0.3s;
    .@{dialog-prefix-cls}-content {
      animation: dialog-zoom 0.3s;
    }
  }
  .@{dialog-prefix-cls}-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1996;
    .@{dialog-prefix-cls}-content {
      width: 420px;
      border-radius: 5px;
      background: @dialog_content_bg_color;
      @media (max-width: 767px) {
        width: 270px;
        border-radius: 10px;
        text-align: center;
      }
      .@{dialog-prefix-cls}-head {
        padding: 15px;
        padding-bottom: 0;
        font-size: @font_size_large;
        color: @text_color_active;
      }
      .@{dialog-prefix-cls}-text {
        padding: 20px 15px;
        line-height: 22px;
        font-size: @font_size_medium;
        color: @dialog_text_color;
      }
      .@{dialog-prefix-cls}-btns {
        display: flex;
        align-items: center;
        padding: 0 15px 10px;
        text-align: center;
        color: @dialog_text_color;
        @media (min-width: 768px) {
          justify-content: flex-end;
          div {
            display: block;
            padding: 8px 15px;
            border-radius: 3px;
            border: 1px solid @btn_color;
            font-size: @font_size_medium;
            cursor: pointer;
            &:not(:nth-of-type(1)) {
              margin-left: 10px;
            }
            &.btn-confirm {
              border-style: @btn_color_active;
            }
            &:hover {
              color: @text_color_active;
              border: 1px solid @btn_color_active;
            }
          }
        }
        @media (max-width: 767px) {
          & {
            padding: 0;
            justify-content: center;
            div {
              flex: 1;
              line-height: 22px;
              padding: 10px 0;
              border-top: 1px solid @dialog_line_color;
              font-size: @font_size_large;
              &:not(:nth-of-type(1)) {
                border-left: 1px solid @dialog_line_color;
              }
            }
          }
        }
      }
    }
  }
}

@keyframes dialog-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes dialog-zoom {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
