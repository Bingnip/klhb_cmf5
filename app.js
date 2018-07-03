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
    //获取code
    wx.login({ 
      success: res =>{
        if(res.code) {    
          codes = res.code;
          loginInfo.code = res.code;
           //获取用户信息
          wx.getSetting({
            success: res => {
              //用户已授权
              if (res.authSetting['scope.userInfo']) {  
                wx.getUserInfo({
                  success: res => {
                    var userInfo = '';
                    this.globalData.userInfo = userInfo = res.userInfo;
                    var url = this.setConfig.url + '/klhb_cmf5/public/index.php/user/login/dologin';
                    var data = {
                      user_name: userInfo.nickName,
                      nick_name: userInfo.nickName,
                      avatar_url: userInfo.avatarUrl,
                      sex: userInfo.gender,
                      country: userInfo.country,
                      province: userInfo.province,
                      city: userInfo.city,
                      code: codes
                    };
                 
                    this.postLogin(url, data);
                   
                  }
                })
              } else {   //用户未授权
                console.log('用户未授权');
                wx.authorize({
                  scope: 'scope.userInfo',
                  complete: res => {

                  }
                })
              }
            }
          })
        } else { 
          this.userLogin();   //code获取出错后，需要重新调用userlogin获取code，直到成功
          return;
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
      success: function(res) {
        console.log(res);
      }
    })
  }
})