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
    if(info && !this.data.hasUserInfo) {
      this.setData({
          userInfo : info,
          hasUserInfo: true
      })
    }
    //防止网络中断没获取到token，不能继续操作，前端确认token已获取
    if(!tok) {
      setTimeout(this.loop);
      console.log('get tok');
    } else {
      this.setData({
        token: tok
      })
      console.log('tok success');
    }
    
    

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})