const app = getApp()

Page({
  data: {
    userInfo:{},
    hasUserInfo: false,
    ownerName: '',
    wenan:{
      describe: '想你发出了一个口令红包'
    },
    doneQrcode: '',  //合成图
    advImg:'', //广告图
  },

  onLoad: function (e) {  // e代表上个页面get过来的参数
    var info = app.globalData.userInfo,
        tok = app.globalData.token;
    this.setData({
      userInfo: info,
      token: tok,
      hasUserInfo: true,
      pid: e.pid,
      ownerName: info.nickName,
      ownerImg: info.avatarUrl
    })
    wx.showLoading({
      title: '二维码生成中',
      mask: true
    })

    //二维码生成
    var postUrl = app.setConfig.url + '/klhb_cmf5/public/index.php/user/tocode/get_code',
        postData = {
          token: tok,
          pid: e.pid,
          title: this.data.ownerName,
          content: this.data.wenan.describe,
          page: 'pages/recordDetails/recordDetails'
        };
    app.postLogin(postUrl, postData, this.setCode);
  },

  setCode: function(res){
    if(res.data.code == 20000){
      var datas = res.data;
      var path = datas.data.substring(12);
      this.setData({
        advImg : datas.adv,
        doneQrcode: app.setConfig.url + path 
      })
      wx.showToast({
        title: '生成成功',
        icon: 'success',
        duration: 1200
      })
    }
  },

  //生成朋友圈分享图
  sheng: function(){
    var shareImg = this.data.doneQrcode;
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [shareImg] // 需要预览的图片http链接列表
    })
  },
 
  //转发到群聊
  onShareAppMessage: function(res){
    var id = this.data.pid,
        title = this.data.ownerName + ' ' + this.data.wenan.describe;
    if(res.from == 'button'){
      console.log(res);
    }
    return {
      title: title,
      path: '/pages/recordDetails/recordDetails?pid=' + id,
      success: function (res) {
        // 转发成功
        console.log(res);
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})