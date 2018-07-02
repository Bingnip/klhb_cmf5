//app.js
var loginInfo = {};
App({
  setConfig: { url: 'https://www.challs.top' },
  globalData:{
    userInfo: null,

  },
  onLaunch: function () {
    this.userLogin();
  },
  userLogin: function() {
    var codes;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {  //用户已授权
          wx.getUserInfo({
            success: res=> {
              var userInfo = '';
              this.globalData.userInfo = userInfo = res.userInfo;
              var url = this.setConfig.url + '/klhb_cmf5/public/index.php/user/login/dologin';
              var data = {
                  user_name : userInfo.nickName,
                  nick_name : userInfo.nickNmae,
                  avatar_url : userInfo.avataUrl,
                  sex : userInfo.gender,
                  country : userInfo.country,
                  province : userInfo.province,
                  city : userInfo.city
              };
              this.userLogin(url, data);
            },
          })
        } else {   //用户未授权
          wx.authorize({
            scope: 'scope.userInfo',
            complete: res => {

            }
          })
        }
      }
    })
  },
  //提交
  postLogin: function(url, data, callback) {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      complete: function(res) {
        console.log(res);
 
      }
    })
  }
})