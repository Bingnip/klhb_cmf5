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
    initials:{
      yjpt:'',  //佣金比例(*%)
      yjgg:'',   //广告佣金比例(*%)
      minfc:'',   //最小发出金额
      minlq:'',  //最小领取金额
      balance:''  //账户余额
    },
    imgsTP:[],   //平台广告
    advert:false, //发布广告开关
    piazza:false, //分享到广场开关
    controller:true  //提交按钮控制器
  },

  onShow: function(){
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
      app.postLogin(postUrl, postData, this.initial);
    }
  },

  initial: function (res) {
      if(res.data.code == 20000){
        var data = res.data.data,
            initials = {
              yjpt : data.commision,
              yjgg : data.commision_adv,
              minfc: data.amount_min,
              minlq: data.receive_amount_min
        };
        this.setData({
          balance : data.amount,
          initials: initials,
          imgsTP  : data.adv_list
        })
      } else {
        console.log('userifo 请求出错');
      }
  },

  //发布广告按钮
  switchAd:function (e) {
    var value = e.detail.value;
    this.setData({
      advert : value
    })
  },

  //分享到广场按钮
  switchPz: function (e) {
    var value = e.detail.value;
    this.setData({
      piazza: value
    })
  },

  //表单提交
  formSubmit: function(e){
    var value = e.detail.value;

    //登录信息验证   生成口令一次就跳转，防止页面不跳转，重复发包
    var tok = app.globalData.token;
    if(!tok || !this.data.controller){
      return false;
    }
    this.setData({
      controller : false   
    })

    var datas = {};
    datas.amount = value.sj;
    datas.num = value.sl;
    datas.is_adv = value.ad ? 1 : 0;
    datas.form_id = e.detail.formId;
    datas.token = tok;
    //if(advert){}
    datas.share2square = value.pz ? 1 : 0;
    datas.quest = value.kl;
    //口令提交信息
    var postUrl = app.setConfig.url + '/klhb_cmf5/public/index.php/user/Enve/saveEnve';
    app.postLogin(postUrl, datas);
  } 
})