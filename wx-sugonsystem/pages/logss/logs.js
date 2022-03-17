// pages/logss/logs.js
//logs.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
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
            content:res.data.msg,
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

    const that = this
    that.goTop()
    that.data.mycurrentPage = 1,
    that.data.allcurrentPage = 1,
    that.data.CILGPage = 1,
    that.data.QARGPage = 1,
    that.data.RPGPage = 1,
    that.data.TRIPage = 1,
    that.data.EAGPage = 1,
    

    that.searchGroupTrain(params)
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
          pageSize: 4
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

    //解决onReachBottom滚动问题
    Lordmore:function(){
      this.onReachBottom()
    },
  
    //滚动条回到顶部
    goTop: function (e) {  // 一键回到顶部
      this.setData({
        topNum:0
      });
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
    // const app = getApp()
    // let eindex = app.globalData.eindex
    // let eitem = app.globalData.eitem
    // console.log(eindex,eitem)
    
    console.log("触底函数")
    var that = this
    console.log(that.data.ability_text)
    console.log(that.data.mycurrentPage,that.data.allcurrentPage)
    console.log(that.data.CILGPage,that.data.QARGPage,that.data.RPGPage,that.data.TRIPage,that.data.EAGPage)
    //将每次page值+1并作为参数传给请求函数
    // var mycurrentPage = that.data.mycurrentPage + 1
    // var allcurrentPage = that.data.allcurrentPage + 1
    // var groupcurrentPage = that.data.groupcurrentPage + 1
    // that.setData({mycurrentPage:mycurrentPage})
    // that.setData({allcurrentPage:allcurrentPage})
    // that.setData({groupcurrentPage:groupcurrentPage})
    // console.log(this.data.currentPage)
    //请求下一页的数据，注意是否有返回数据的判断,还有就是对选择框里状态进行判断
    //下面的请求是只有在“全部”状态下的下拉请求
    /////////////////////////////////////////////////////全部分支
    if(that.data.ability_text=='全部'){
      var allcurrentPage = that.data.allcurrentPage + 1
      that.setData({allcurrentPage:allcurrentPage})
      //获取sessionid
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    wx.request({
      // https://oa.hubusugon.cn/hss/weekly/select_all_weekly
      url: 'https://oa.hubusugon.cn/hss/training/all_train',
      method: 'POST',
      // data: ({}),增加参数currentPage,pageSize
      data:({
        currentPage:allcurrentPage,
        pageSize:2
        }),
      header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res){
          console.log(res)
          console.log(allcurrentPage)
          console.log(that.data.weekList)    
          if (res.data.msg == '操作成功') {
            console.log(res.data.data)
            //数据渲染
            if (res.data.data == '') {
              wx - wx.showToast({
                title:'数据已经全部加载',
                icon: 'none',
               mask: true,
               duration: 1000
              })
            } else {
              res.data.data.forEach((e) => {
                e.time = e.time.substring(0, 19)
                e.time = e.time.replace(/-/g, "/")
                e.time = e.time.replace(/T/, " ")
              })
              that.dataList = that.data.dataList.concat(res.data.data)
              console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
            }
          }
          //添加返回信息
          else if(res.data.code == 400){
            wx.showModal({
              title: '注意',
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                }
              }
            })
          }
          //抛出异常，没有返回数据，并且确定问题接口
          else {}
        }
      }
      )
    }
    
    /////////////////////////////////////////////////////////项目组分支
    else if (that.data.ability_text == 'CILG'){
  // cookie获取id
  let cookie = wx.getStorageSync('cookieKey')
  console.log(cookie)
  let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
  let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
  let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
  console.log(cookie)
  console.log(phone)
  wx.setStorageSync("phone", phone)
  wx.setStorageSync("id", id)
  var that = this
  var CILGPage = that.data.CILGPage + 1
  that.setData({CILGPage:CILGPage})

  console.log(this.data.ability_text)
  let params = {
    // mine: {
    //   id: id
    // },
    ability_text:that.data.ability_text,
    currentPage:CILGPage,
    pageSize:4
  }
  console.log(params)
  wx.request({
    // https://oa.hubusugon.cn/hss/weekly/select_by_group
    url: 'https://oa.hubusugon.cn/hss/training/train_group',
    data: params,
    method: 'POST',
    header: {
      'content-type': 'application/json',
      'SessionId': phone
    },
    success: function (res) {
      console.log(res)
      if (res.data.msg == '操作成功') {
        //数据渲染
        if (res.data.data == '') {
          wx - wx.showToast({
            title:'数据已经全部加载',
            icon: 'none',
           mask: true,
           duration: 1000
          })
        } else {
          res.data.data.forEach((e) => {
            e.time = e.time.substring(0, 19)
            e.time = e.time.replace(/-/g, "/")
            e.time = e.time.replace(/T/, " ")
          })
          that.dataList = that.data.dataList.concat(res.data.data)
              console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
        }
      }
      //添加返回信息
      else if(res.data.code == 400){
        wx.showModal({
          title: '注意',
          content: res.data.msg,
          success: function(res) {
            if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../NotLanded/NotLanded'
            })
            } else if (res.cancel) {
            console.log('用户点击取消')
            wx.navigateTo({
              url: '../NotLanded/NotLanded'
            })
            }
          }
        })
      }
      //没有获取到数据的异常报错，接口问题
      else {}
    }})
  }else if (that.data.ability_text == 'QARG'){
    // cookie获取id
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.indexOf(";"))
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    console.log(cookie)
    console.log(phone)
    wx.setStorageSync("phone", phone)
    wx.setStorageSync("id", id)
    var that = this
    var QARGPage = that.data.QARGPage + 1
    that.setData({QARGPage:QARGPage})
    console.log(that.data.ability_text)
    let params = {
      // mine: {
      //   id: id
      // },
      ability_text:that.data.ability_text,
      currentPage:QARGPage,
      pageSize:4
    }
    console.log(params)
    wx.request({
      // https://oa.hubusugon.cn/hss/weekly/select_by_group
      url: 'https://oa.hubusugon.cn/hss/training/train_group',
      data:params,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'SessionId':phone
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg == '操作成功') {
          //数据渲染
          if (res.data.data == '') {
            wx - wx.showToast({
              title:'数据已经全部加载',
              icon: 'none',
             mask: true,
             duration: 1000
            })
          } else {
            res.data.data.forEach((e) => {
              e.time = e.time.substring(0, 19)
              e.time = e.time.replace(/-/g, "/")
              e.time = e.time.replace(/T/, " ")
            })
            that.dataList = that.data.dataList.concat(res.data.data)
              console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
          }
        }
        //添加返回信息
        else if(res.data.code == 400){
          wx.showModal({
            title: '注意',
            content: res.data.msg,
            success: function(res) {
              if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: '../NotLanded/NotLanded'
              })
              } else if (res.cancel) {
              console.log('用户点击取消')
              wx.navigateTo({
                url: '../NotLanded/NotLanded'
              })
              }
            }
          })
        }
        //没有获取到数据的异常报错，接口问题
        else {}
      }})
    }else if (that.data.ability_text == 'RPG'){
      // cookie获取id
      let cookie = wx.getStorageSync('cookieKey')
      console.log(cookie)
      let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      console.log(cookie)
      console.log(phone)
      wx.setStorageSync("phone", phone)
      wx.setStorageSync("id", id)
      var that = this
      var RPGPage = that.data.RPGPage + 1
      that.setData({RPGPage:RPGPage})
      let params = {
        // mine: {
        //   id: id
        // },
        ability_text:that.data.ability_text,
        currentPage:RPGPage,
        pageSize:10
      }
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/select_by_group
        url: 'https://oa.hubusugon.cn/hss/training/train_group',
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId': phone
        },
        success: function (res) {
          console.log(res)
          if (res.data.msg == '操作成功') {
            //数据渲染
            if (res.data.data == '') {
              wx - wx.showToast({
                title:'数据已经全部加载',
                icon: 'none',
               mask: true,
               duration: 1000
              })
            } else {
              res.data.data.forEach((e) => {
                e.time = e.time.substring(0, 19)
                e.time = e.time.replace(/-/g, "/")
                e.time = e.time.replace(/T/, " ")
              })
              that.dataList = that.data.dataList.concat(res.data.data)
              console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
            }
          }
          //添加返回信息
          else if(res.data.code == 400){
            wx.showModal({
              title: '注意',
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                }
              }
            })
          }
          //没有获取到数据的异常报错，接口问题
          else {}
        }})
      }else if (that.data.ability_text == 'TRI'){
        // cookie获取id
        let cookie = wx.getStorageSync('cookieKey')
        console.log(cookie)
        let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
        let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.indexOf(";"))
        let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
        console.log(cookie)
        console.log(phone)
        wx.setStorageSync("phone", phone)
        wx.setStorageSync("id", id)
        var that = this
        var TRIPage = that.data.TRIPage + 1
        that.setData({TRIPage:TRIPage})
        let params = {
          // mine: {
          //   id: id
          // },
          ability_text:that.data.ability_text,
          currentPage:TRIPage,
          pageSize:10
        }
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/training/train_group',
          data: params,
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function (res) {
            console.log(res)
            if (res.data.msg == '操作成功') {
              //数据渲染
              if (res.data.data == '') {
                wx - wx.showToast({
                  title:'数据已经全部加载',
                  icon: 'none',
                 mask: true,
                 duration: 1000
                })
              } else {
                res.data.data.forEach((e) => {
                  e.time = e.time.substring(0, 19)
                  e.time = e.time.replace(/-/g, "/")
                  e.time = e.time.replace(/T/, " ")
                })
                that.dataList = that.data.dataList.concat(res.data.data)
                console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
              }
            }
            //添加返回信息
            else if(res.data.code == 400){
              wx.showModal({
                title: '注意',
                content: res.data.msg,
                success: function(res) {
                  if (res.confirm) {
                  console.log('用户点击确定')
                  wx.navigateTo({
                    url: '../NotLanded/NotLanded'
                  })
                  } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.navigateTo({
                    url: '../NotLanded/NotLanded'
                  })
                  }
                }
              })
            }
            //没有获取到数据的异常报错，接口问题
            else {}
          }})
        }else if(that.data.ability_text == 'EAG'){
      // cookie获取id
      let cookie = wx.getStorageSync('cookieKey')
      console.log(cookie)
      let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.indexOf(";"))
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      console.log(cookie)
      console.log(phone)
      wx.setStorageSync("phone", phone)
      wx.setStorageSync("id", id)
      var that = this
      var EAGPage = that.data.EAGPage + 1
        that.setData({EAGPage:EAGPage})
      let params = {
        // mine: {
        //   id: id
        // },
        ability_text:that.data.ability_text,
        currentPage:EAGPage,
        pageSize:10
      }
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/training/train_group',
        data: params,
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          console.log(res)
          if (res.data.msg == '操作成功') {
            //数据渲染
            if (res.data.data == '') {
              wx - wx.showToast({
                title:'数据已经全部加载',
                icon: 'none',
               mask: true,
               duration: 1000
              })
            } else {
              res.data.data.forEach((e) => {
                e.time = e.time.substring(0, 19)
                e.time = e.time.replace(/-/g, "/")
                e.time = e.time.replace(/T/, " ")
              })
              that.dataList = that.data.dataList.concat(res.data.data)
              console.log(that.dataList)
                that.setData({
                  dataList: that.dataList,
                  tips: ''
                })
            }
          }
          //添加返回信息
          else if(res.data.code == 400){
            wx.showModal({
              title: '注意',
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                } else if (res.cancel) {
                console.log('用户点击取消')
                wx.navigateTo({
                  url: '../NotLanded/NotLanded'
                })
                }
              }
            })
          }
          else {}
        },
        fail: function (res) { },
        complete: function (res) { },
      })
  }
  //其它情况做空操作
  else{}

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})