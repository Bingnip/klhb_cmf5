const app = getApp();

Page({

  data: {
    userInfo: {},
    token:'',
    allredPacket: '全部红包',
    rank: '综合排序',
    selectArea1: false,  //红包类别筛选下拉框
    selectArea2: false,  //排序选择下拉框
    hiddenDarkBg: true,  //遮罩层 true为隐藏
    redPacketType: ['口令红包', '祝福红包', '问答红包'],
    packetType:0,  //红包类型
    orderType:0, //排序类型
    page:1,
    selection_enve:[-1, 0, 1, 2],
    selection_order: ["", "show_amount_desc", "show_amount_asc", "add_time_desc", "add_time_asc"],
    redPacketList: [],
    lower: true
  },

  onLoad: function (options) {
    
  },

  //触底加载事件
  onReachBottom: function (e) {
    if (this.data.lower) {
      this.setData({
        lower: false
      })
      this.dataLoad();
    }
  },

  //下拉刷新
  onPullDownRefresh: function(e) {

  },

  //点击选择红包类型
  clickredPacket: function () {
    var selectArea1 = this.data.selectArea1;
    if (!selectArea1) {
      this.setData({
        selectArea1: true,
        selectArea2: false,
        hideedarkbg: false,
      })
    } else {
      this.setData({
        selectArea1: false,
        hideedarkbg: true,
      })
    }
  },
  //点击选择综合排序
  clickrank: function () {
    var selectArea2 = this.data.selectArea2;
    if (!selectArea2) {
      this.setData({
        selectArea2: true,
        selectArea1: false,
        hideedarkbg: false,
      })
    } else {
      this.setData({
        selectArea2: false,
        hideedarkbg: true,
      })
    }
  },
  
  onLoad: function(){
    wx.showLoading({
      title: '加载中···',
      mask: true
    })
    this.loop();
  },

  //获取全局变量
  loop: function(){
    var that = this;
    if (!app.globalData.token){
      setTimeout(function () { that.loop(); } , 100)
    } else {      
      var userInfo = app.globalData.userInfo,
          token = app.globalData.token;
      if(!userInfo){
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            token: token 
          })
        }
      } else {    
        this.setData({
          userInfo : userInfo,
          token : token
        })
      }
      this.dataLoad();
    }
  },
  //数据加载
  dataLoad:function() {
    // console.log('页码' + this.data.page);
      wx.showLoading({
        title: '加载中中中',
      })
      var tok = this.data.token,
          pages = this.data.page,
          enve_type = this.data.packetType,
          order_type = this.data.orderType;
      var postUrl = app.setConfig.url + '/klhb_cmf5/public/index.php/user/Enve/enve2SquareList',
          postData = {
            page: pages,
            token: tok,
            enve_type: this.data.selection_enve[enve_type],
            orderby: this.data.selection_order[order_type]
          };
      app.postLogin(postUrl, postData, this.initial);
  },

  //接收数据
  initial:function(res) {
    // console.log(this.data.redPacketList);
    if(res.data.code == 20000){
      var datas = res.data;
      if(datas.data.length == 0){
        this.setData({
          page: -1    //为什么必须是-1？
        })
        return false;
      }
      var vos = datas.data,
          page = this.data.page + 1,   //下次请求直接翻页
          voices = page == 1 ? [] : this.data.redPacketList;  //前端的红包数组 !!!!很重要
      for (var i = 0; i< vos.length; i++){
        var adimgsrc = vos[i].is_adv == 1 ? '有广告' : '/images/Noads.png';
        var voice = {
          id: vos[i].id,
          adimgsrc: adimgsrc,
          ownerImg: vos[i].avatar_url,
          ownerName: vos[i].user_name,
          amount: vos[i].amount,
          num: vos[i].num,
          receiveNum: vos[i].receive_num,
          senderDate: vos[i].add_time
        };
        //遍历完再放入一个数组
        voices = voices.concat(voice);
      }
      wx.hideLoading();

      if(page == 1){    //首页滚动置顶
        wx.pageScrollTo({
          scrollTop: 0,
        })
      }

      this.setData({
        redPacketList: voices,  //更重要！！！！ 将新的数据加入数组
        page: page,
        advpt: datas.adv,
        lower: true
      })
    }
  }

})