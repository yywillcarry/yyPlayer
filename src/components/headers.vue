<template>
  <div class="yy-header">
    <h1 class="header">
      <a href="https://github.com/maomao1996/Vue-mmPlayer" target="_blank">
        yyPlayer 在线音乐播放器
      </a>
    </h1>
    <div class="user">
      <template v-if="user.userId">
        <div class="user-info">
          <img class="avatar" :src="`${user.avatarUrl}?param=50y50`" alt="" />
          <span>{{ user.nickname }}</span>
        </div>
        <span class="user-btn" @click="openDialog(2)">退出</span>
      </template>
      <span v-else class="user-btn" @click="openDialog(0)">登录</span>
    </div>

    <!-- <dialogs
      ref="logindialog"
      head-text="登录"
      confirm-btn-text="登录"
      cancel-btn-text="关闭"
      @confirm="login"
    >
      <input
        slot="text"
        class="dialog-input"
        type="number"
        autofocus
        placeholder="请输入您的网易云Id"
        v-model="uidValue"
        @keyup.enter="login"
      />
      <div slot="btn" @click="openDialog(1)">帮助</div>
    </dialogs> -->
    <dialogs
      ref="logindialog"
      head-text="登录"
      @cancel="cancel"
      @confirm="login"
    >
      <canvas slot="text" id="canvas" ref="canvas"></canvas>
      <div slot="btn" @click="openDialog(1)">帮助</div>
    </dialogs>
    <!-- <dialogs
      head-text="登录帮助"
      confirm-btn-text="去登录"
      cancel-btn-text="关闭"
      ref="helpdialog"
      @confirm="openDialog(0)"
    >
      <ul slot="text">
        <li>
          1、<a href="https://music.163.com" target="_blank">
            点我(https://music.163.com)
          </a>
          打开网易云音乐官网
        </li>
        <li>2、点击页面右上角的“登录”</li>
        <li>3、点击您的头像，进入我的主页</li>
        <li>4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</li>
      </ul>
    </dialogs> -->
        <dialogs
      head-text="登录帮助"
      confirm-btn-text="去登录"
      cancel-btn-text="关闭"
      ref="helpdialog"
      @confirm="openDialog(0)"
    >
      <ul slot="text">
        <li>
          1、打开网易云音乐app
        </li>
        <li>2、找到扫一扫</li>
        <li>3、点击授权登录</li>
      </ul>
    </dialogs>
    <dialogs ref="outdialog" @confirm="out">
      <p slot="text">确定退出当前用户吗？</p>
    </dialogs>
  </div>
</template>

<script>
let timer = null;
import QRCode from "qrcode";
import dialogs from "components/dialogs";
import {
  getUesrPlayList,
  getQRcodeKey,
  getQRcode,
  getQRcodeState,
  getLoginState,
} from "api/index.js";
import { mapActions, mapState } from "vuex";

export default {
  name: "Header",
  components: {
    dialogs,
  },
  data() {
    return {
      user: {
        userId: this.yyid,
        nickname: "",
        avatarUrl: "",
      },
      // uidValue: "",
      url: "",
      key: "",
      state: 801,
      message: "",
      // cookie: "",
    };
  },
  created() {
    getQRcodeKey().then((res) => {
      this.key = res.data.unikey;
      getQRcode(this.key).then((res) => {
        this.url = res.data.qrurl;
      });
    });
    this.yycookie && this.getInfo(this.yycookie);
    // this.yyid&&this.getUesrInfo(this.yyid)
  },
  methods: {
    openDialog(val) {
      switch (val) {
        case 0:
          this.showQRCode();
          this.$refs.helpdialog.hide();
          this.$refs.logindialog.show();
          break;
        case 1:
          this.$refs.logindialog.hide();
          this.$refs.helpdialog.show();
          break;
        case 2:
          this.$refs.outdialog.show();
          break;
        case 3:
          this.$refs.logindialog.hide();
      }
    },
    cancel() {
      clearInterval(timer);
      timer = null;
    },
    showQRCode() {
      QRCode.toCanvas(canvas, this.url, {
        width: 100,
        height: 100,
      });

      timer = setInterval(() => {
        this.getState();
        if (this.state == 800) {
          clearInterval(timer);
          timer = null;
          alert(this.message);
          this.$refs.logindialog.hide();
        } else if (this.state == 803) {
          clearInterval(timer);
          timer = null;
          this.setCookie(this.cookie);
          this.getInfo(this.cookie);
          alert(this.message);
          this.$refs.logindialog.hide();
        }
      }, 2000);
    },
    login() {
      // if(this.uidValue===""){
      //   alert('不能为空')
      //   this.openDialog(0)
      //   return
      // // }
      // this.getUesrInfo(this.uidValue)
      this.getState();
      if (this.state == 800) {
        clearInterval(timer);
        timer = null;
        alert(this.message);
        this.$refs.logindialog.hide();
      } else if (this.state == 803) {
        clearInterval(timer);
        timer = null;
        this.setCookie(this.cookie);
        this.getInfo(this.cookie);
        alert(this.message);
        this.$refs.logindialog.hide();
      } else {
        alert("请扫码");
      }
    },
    async getState() {
      let res = await getQRcodeState(this.key);
      if (this.state == 803) {
        return;
      }
      this.state = res.code;
      this.message = res.message;
      this.cookie = res.cookie || null;
    },
    async getInfo(cookie) {
      let result = await getLoginState(cookie);
      this.user.userId = result.data.profile.userId;
      this.user.nickname = result.data.profile.nickname;
      this.user.avatarUrl = result.data.profile.avatarUrl;
      this.setId(result.data.profile.userId);
    },
    // async getUesrInfo(uid){
    //     let result=await getUesrPlayList(uid)
    //     this.uidValue=""
    //     if(!result.playlist.length){
    //       alert("该id不存在")
    //       return
    //     }
    //     this.setId(uid)
    //    this.user=result.playlist[0].creator
    // },
    out() {
      (this.user = {
        userId: null,
        nickname: "",
        avatarUrl: "",
      }),
        (this.cookie = null);
      this.setId(null);
      this.setCookie(null);
    },
    ...mapActions(["setId", "setCookie"]),
  },
  computed: {
    ...mapState(["yyid", "yycookie"]),
  },
};
</script>


<style lang="less">
.yy-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  .header {
    text-align: center;
    line-height: 60px;
    color: @text_color_active;
    font-size: @font_size_large;
  }
  .user {
    position: absolute;
    top: 50%;
    right: 15px;
    line-height: 30px;
    text-align: right;
    transform: translateY(-50%);
    &-info {
      float: left;
      margin-right: 15px;
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 90px;
        vertical-align: middle;
      }
      span {
        margin-left: 10px;
        color: @text_color_active;
      }
    }
    &-btn {
      float: left;
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
    }
  }
}
.dialog-text {
  text-align: left;
  .dialog-input {
    width: 100%;
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
  a:hover {
    color: #d43c33;
  }
}
</style>
