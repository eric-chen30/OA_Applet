//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    shows: false,
    selectDatas: ['我的培训', '待审', '已报备','未通过', '已结束'],
    indexs: 0,
    logs: [],
    id: '',
    // 详情id
    detailId:'',
    //培训的数据
    dataList: [],
    // 上面高度
    uppHeight: '',
    //头部上
    uppHeightTop: '',
    //头部下
    uppHeightBot: '',
    // 内容高度
    conHeight: '',

    // 输入框输入内容
    inputContent: '',
    //状态
    status: '我的培训',
  },

// 获取用户id
getUserId(){
  let id = wx.getStorageSync('id') || []
  this.setData({
    id: id,
  })
},

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {

  this.setData({
    uppHeight: (wx.getSystemInfoSync().windowHeight * 0.21) + 'px',
    uppHeightTop: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.52) + 'px',
    uppHeightBot: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.36) + 'px',
    conBlack: (wx.getSystemInfoSync().windowHeight * 0.02) + 'px',
    conHeight: (wx.getSystemInfoSync().windowHeight * 0.77) + 'px',
  })
  // 获取用户id
  this.getUserId()

  // 获取培训的数据
  this.getTrainData()

},


// 获取当前用户所有培训的数据
getTrainData(){
    var that = this
    //
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    console.log(sessionid)
    //
  wx.request({
    url: 'https://oa.hubusugon.cn/hss/training/person_train',
    //
    data:  ({
      uid: this.data.id,
    }),
    method: 'GET',
    header: {
      'content-type': 'application/json',
      //
      'SessionId': phone
    },
    success: function (res) {
      // 提示信息
      if(res.data.data.length == 0){
        that.setData({
          tips: "还没有培训内容哦U•ェ•*U ",
          dataList: res.data.data
        })
      }else if(res.code == 400){
        wx.showModal({
          title:'注意',
          content:res.msg,
          success:function(res){
            if(res.confirm){
              console.log('用户点击确定')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }else if(res.cancel){
              console.log('用户点击取消')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }
          }
        })
      }
      else{
        // 过滤时间
        res.data.data.forEach((e) =>{
          e.time = e.time.substring(0,19)
          e.time = e.time.replace(/-/g, "/")
          e.time = e.time.replace(/T/, " ")
        })
        that.setData({
          dataList: res.data.data,
          tips: ''
        })
      }
    },
    fail: function (res) { },
    complete: function (res) { },
  })
},

//输入框输入聚焦
bindKeyInput(e){
  this.setData({
    inputContent: e.detail.value
  })
},

//输入框失去焦点
bindKeyBlur(e){
  let that = this

  let paramsOne = {
    mine:{
      id:''
    },
    status: ''
  };
  paramsOne.mine.id = this.data.id
  paramsOne.status = this.data.status
  //////////////////////////////////修改1，判断输入框状态////////////////////
  if(this.data.inputContent == ''){
    this.searchPersonTrain(paramsOne)
  }


  if(this.data.status == '我的培训'){

    let params = {
      name: this.data.inputContent,
      mine: {'id': this.data.id}
    }
    this.searchAll(params)    
  }

  if(this.data.status == '未通过'){

    this.data.status = '申请失败'

    let params = {
      name: this.data.inputContent,
      mine: {'id': this.data.id},
      status: that.data.status,
    }
    this.searchPer(params)
  }

  if(this.data.status == '待审' || this.data.status == '已报备' || this.data.status == '已结束'){
    let params = {
      name: this.data.inputContent,
      mine: {'id': this.data.id},
      status: that.data.status,
    }
    this.searchPer(params)
  }

},


//模糊搜索个人培训
searchPer(params){
  let that = this
  //
  let cookie = wx.getStorageSync('cookieKey')
  let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
  console.log(cookie)
  // let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
  let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
  console.log(sessionid)
  //
  wx.request({
    url: 'https://oa.hubusugon.cn/hss/training/train_name',
    method: 'POST',
    //
    data: params ,
    header: {
      'content-type': 'application/json',
      //
      'SessionId': phone
    },
    success: function (res) {
      if (res.data.msg == '操作成功') {
        if(res.data.data.length > 0){
          res.data.data.forEach((e) =>{
            e.time = e.time.substring(0,19)
            e.time = e.time.replace(/-/g, "/")
            e.time = e.time.replace(/T/, " ")
          })
        }
        that.setData({
          dataList: res.data.data,
          tips: ''
        })
      }else if(res.code == 400){
        wx.showModal({
          title:'注意',
          content:res.msg,
          success:function(res){
            if(res.confirm){
              console.log('用户点击确定')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }else if(res.cancel){
              console.log('用户点击取消')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }
          }
        })
      }
      else {
        console.log("获取信息失败！")
      }
    }
  })
},

//模糊搜索全部培训
searchAll(params){
  let that = this
  //
  let cookie = wx.getStorageSync('cookieKey')
  console.log(cookie)
  // let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
  let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
  let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
  console.log(sessionid)
  //
  wx.request({
    url: 'https://oa.hubusugon.cn/hss/training/fuzzy_search_all',
    method: 'POST',
    //
    data: params ,
    header: {
      'content-type': 'application/json',
      //
      'SessionId': phone
    },
    success: function (res) {

      console.log(res)
      if (res.data.msg == '操作成功') {
        if(res.data.data.length > 0){
          res.data.data.forEach((e) =>{
            e.time = e.time.substring(0,19)
            e.time = e.time.replace(/-/g, "/")
            e.time = e.time.replace(/T/, " ")
          })
        }
        that.setData({
          dataList: res.data.data,
          tips: ''
        })

      }else if(res.code == 400){
        wx.showModal({
          title:'注意',
          content:res.msg,
          success:function(res){
            if(res.confirm){
              console.log('用户点击确定')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }else if(res.cancel){
              console.log('用户点击取消')
              wx.redirectTo({
                url: '../Notlanded/Notlanded',
                
              });
            }
          }
        })
      }
      else {
        console.log("获取信息失败！")
      }
    }
  })
},


  goToInitiatTraining: function () {
    wx.navigateTo({
      url: '../InitiatTraining/InitiatTraining'
    })
  },
  //事件处理函数
  // goToMylists: function () {
  //   wx.navigateTo({
  //     url: '../Mylists/Mylists'
  //   })
  // },

  // goTologs: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },

  // goToWeek: function () {
  //   wx.navigateTo({
  //     url: '../week/week',
  //   })
  // },
  
  // goTocontest: function () {
  //   wx.navigateTo({
  //     url: '../contest/contest'
  //   })
  // },

  // goToLanded: function () {
  //   wx.navigateTo({
  //     url: '../Landed/Landed'
  //   })
  // },

  // goTodetail: function () {
  //   wx.navigateTo({
  //     url: '../detail/detail'
  //   })
  // },

  // 选择状态
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },

  // 根据状态出发搜索
  optionTaps(e) {

    // let Indexs = e.currrentTarget.dataset.index;
    let Indexs = e.target.dataset.index;
    // console.log(Indexs)
    let params = {
      mine:{
        id:''
      },
      status: ''
    };

    params.status = this.data.selectDatas[Indexs]
    params.mine.id = this.data.id

    this.setData({
      indexs: Indexs,
      status: params.status,
      shows: !this.data.shows,
    });

    this.searchPersonTrain(params)


  },

//获取详情id
getDetailId(e){

  this.setData({
    detailId: e.currentTarget.dataset.detailid
  })
  wx.setStorageSync('detailId',this.data.detailId)
},


// 根据状态搜索个人培训
searchPersonTrain(params){
  var that = this
  //
  let cookie = wx.getStorageSync('cookieKey')
  console.log(cookie)
  let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
  let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
  console.log(sessionid)
  //
  if(params.status == '我的培训'){
    this.getTrainData()
  }

  if(params.status == '未通过'){
      params.status = '申请失败'
  }

  if(params.status == '待审' || params.status == '已报备' || params.status == '申请失败' || params.status == '已结束'){


    params = JSON.stringify(params)

    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/train_status',
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json',
        //
        'SessionId': phone
      },
      success: function (res) {

        if (res.data.msg == '操作成功') {
          if(res.data.data.length == 0){
            that.setData({
              tips: "还没有培训内容哦U•ェ•*U ",
              dataList: res.data.data
            })
          }else if(res.code == 400){
            wx.showModal({
              title:'注意',
              content:res.msg,
              success:function(res){
                if(res.confirm){
                  console.log('用户点击确定')
                  wx.redirectTo({
                    url: '../Notlanded/Notlanded',
                    
                  });
                }else if(res.cancel){
                  console.log('用户点击取消')
                  wx.redirectTo({
                    url: '../Notlanded/Notlanded',
                    
                  });
                }
              }
            })
          }
          else{
            res.data.data.forEach((e) =>{
              e.time = e.time.substring(0,19)
              e.time = e.time.replace(/-/g, "/")
              e.time = e.time.replace(/T/, " ")
            })
            that.setData({
              dataList: res.data.data,
              tips: ''
            })
          }

        }
        else {
          console.log("获取信息失败！")
        }
      }
    })
  }

  else return

},

})

