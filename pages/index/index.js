// pages/hpage/hpage.js
//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //用户信息
    hasUserInfo: false, //是否授权
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loop();

  },
  //loop获取用户信息
  loop: function () {
    var info = app.globalData.userInfo,
      tok = app.globalData.token;
    if (info && !this.data.hasUserInfo) {
      this.setData({
        userInfo: info,
        hasUserInfo: true
      })
    }
    //防止网络中断没获取到token，不能继续操作，前端确认token已获取
    if (!tok) {
      setTimeout(this.loop);
      console.log('request tok');
    } else {
      console.log(tok);
      this.setData({
        token: tok
      })
      var postUrl = app.setConfig.url + '/klhb_cmf5/public/index.php/user/consumer/userinfo',
        postData = {
          token: tok     //根据token在服务器获取session
        };
      console.log(postData);
      app.postLogin(postUrl, postData);
    }



  },

  initial: function () {

  }

})