//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    shows: false,
    selectDatas: ['全部', 'CILG', 'QARG', 'RPG', 'TRI', 'EAG'],
    indexs: 0,
    logs: [],
    id: '',
    // 详情id
    detailId: '',
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
    status: '全部',
    //项目群名字
    ability_text:'全部',

    //分页加载的当前页和页面容量
    mycurrentPage:1,
    allcurrentPage:1, 
    // groupcurrentPage:1,
    CILGPage:1,
    QARGPage:1,
    RPGPage:1,
    TRIPage:1,
    EAGPage:1,
    pageSize:4,
    //滚动条距离顶部的距离
    topNum: 0

  },

  // 获取用户id
  getUserId() {
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

    // 获取全部培训的数据
    this.getTrainData()

  },


  // 获取全部培训的数据
  getTrainData() {
   
    
   
    var that = this

    //
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    //
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/all_train',
      data:({
        currentPage: 1,
        pageSize: 4
      }),
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'SessionId': phone
        
      },
      success: function (res) {
        // 过滤时间
        console.log(res)
        if(res.data.code == 0){
          // 提示信息
          if(res.data.data.length == 0){
            that.setData({
              tips: "还没有培训内容哦U•ェ•*U "
            })
          }
          else{
              res.data.data.forEach((e) => {
                e.time = e.time.substring(0, 19)
                e.time = e.time.replace(/-/g, "/")
                e.time = e.time.replace(/T/, " ")
              })
            }
            that.setData({
              dataList: res.data.data,
              tips: ''
            })
            // console.log(that.data.dataList)
        }
        else if(res.data.code == 400){
          wx.showModal({
            title:'注意',
            content:res.data.codePointAtmsg,
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
          wx - wx.showToast({
            title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/training/all_train",
            icon: 'none',
            mask: true,
            duration: 5000
          })
        }
      },
      fail: function (res) {},
      complete: function (res) { },
    })
  },

  //输入框输入聚焦
  bindKeyInput(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },

//输入框失去焦点
bindKeyBlur(e){
  let that = this

  if(this.data.inputContent == ''){

    let paramsOne = {
      ability_text: ''
    };
    paramsOne.ability_text = this.data.ability_text
    this.searchGroupTrain(paramsOne)
  }

  else {

    if(this.data.ability_text == '全部'){

      let params = {
        name: this.data.inputContent,
      }
      this.searchAll(params)    
    }
  
  
    if(this.data.ability_text == 'CILG' || this.data.ability_text == 'QARG' || this.data.ability_text == 'RPG' || this.data.ability_text == 'TRI' || this.data.ability_text == 'EAG'){
      let params = {
        name: this.data.inputContent,
        status: that.data.ability_text,
      }
      this.searchGro(params)
    }
  }


},



  //模糊搜索群培训
  searchGro(params) {
    let that = this
    //
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    //
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/fuzzy_search_group',
      method: 'POST',
      
      data:params ,
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        if (res.data.msg == '操作成功') {
          if (res.data.data.length > 0) {
            res.data.data.forEach((e) => {
              e.time = e.time.substring(0, 19)
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
  searchAll(params) {
    let that = this
    //
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    //
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/fuzzy_search_all_all',
      method: 'POST',
      
      data: params ,
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        if (res.data.msg == '操作成功') {
          if (res.data.data.length > 0) {
            res.data.data.forEach((e) => {
              e.time = e.time.substring(0, 19)
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

  // 选择状态
  selectTaps() {
    this.setData({
      shows: !this.data.shows,
    });
  },

  // 根据项目群搜索
  optionTaps(e) {
    // let Indexs = e.currrentTarget.dataset.index;
    console.log(e)
    let Indexs = e.target.dataset.index;
    // console.log(Indexs)
    let params = {
      ability_text: '',
    };
    params.ability_text = this.data.selectDatas[Indexs]

    this.setData({
      indexs: Indexs,
      ability_text: params.ability_text,
      shows: !this.data.shows,
    });

    this.searchGroupTrain(params)
  },

  //获取详情id
  getDetailId(e) {

    this.setData({
      detailId: e.currentTarget.dataset.detailid
    })
    wx.setStorageSync('detailId', this.data.detailId)
  },


  // 根据群搜索培训
  searchGroupTrain(params) {
    var that = this
     //
     let cookie = wx.getStorageSync('cookieKey')
     let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
     let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
     //
    if (params.ability_text == '全部') {
      this.getTrainData()
    }

    if (params.ability_text == 'CILG' || params.ability_text == 'QARG' || params.ability_text == 'RPG' || params.ability_text == 'TRI'|| params.ability_text == 'EAG') {
      console.log(params)
      // params.ability_text = '质量分析与可靠性项目群'
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/training/train_group',
        method: 'POST',
        //
        data:({
          ability_text: params.ability_text,
          currentPage: 1,
          pageSize: 12
        }),
        header: {
          'content-type': 'application/x-www-form-urlencoded',
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
              if (res.data.data.length > 0) {
                res.data.data.forEach((e) => {
                  e.time = e.time.substring(0, 19)
                  e.time = e.time.replace(/-/g, "/")
                  e.time = e.time.replace(/T/, " ")
                })
              }
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

