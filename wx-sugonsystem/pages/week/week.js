// pages/week/week.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showsOne: false,
    showsTwo: false,

    //获取项目群数组
    allGroups:[],
    //获取时间数组
    allTime:[],
    //获取职位数组
    allPosition:[],

    //选择状态
    selectStatus:'全部',

    //获取的全部数据
    allGetData:[],

    //分类
    selectCates:['我的','全部','CILG','QARG','RPG','TRI','EAG'],

    //下拉列表的数据
    indexsOne: 0,//选择的下拉列 表下标,
    indexsTwo: 0,//选择的下拉列 表下标,
    
    //提示
    tips: '',

    logs: [],
    id: 2,
    name: '',
    phone: '',
    //周报id
    weekId:'',
    //头部高度
    uppHeight: '',
    // 内容高度
    conHeight: '',
     // 下面高度
    botHeight: '',
    //周报数组
    weekList:[],
    //无权限
    noList:[
      {
        details: "",
        id: '',
        mine:{
          abilityText: null,
          avatar: null,
          honorNum: 0,
          id: '',
          name: null,
          phone: null,
          post: null,
          titleRule: null,
          trainNum: 0,
        },
        name: "",
        next_content: "",
        problem: "",
        this_content: "",
        date: "",
      },
    ],  
    // 提示信息
    tips: '',

    //分页加载的当前页和页面容量
    mycurrentPage:1,
    allcurrentPage:1, 
    // groupcurrentPage:1,
    CILGPage:1,
    QARGPage:1,
    RPGPage:1,
    TRIPage:1,
    EAGPage:1,
    pageSize:10,
    //滚动条距离顶部的距离
    topNum: 0
  },

    ////////////////////////////////////////////////////////////////获取我的周报数组
    getWeekData(){
      // cookie获取id
      let cookie = wx.getStorageSync('cookieKey')
      console.log(cookie)
      let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      console.log(id)
      console.log(phone)
      wx.setStorageSync("phone", phone)
      wx.setStorageSync("id", id)
      //检查初始页面的下拉菜单对象状态是空还是null
      const app = getApp()
      let eindex = app.globalData.eindex
      let eitem = app.globalData.eitem
      console.log(eindex,eitem)
  
      var that = this
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/get_my_weekly
        url: 'https://oa.hubusugon.cn/hss/weekly/get_my_weekly',
        method: 'POST',
        data: ({
          mine:{
            id: id
          },
          currentPage:1,
          pageSize:10
        }),
        header: {
          'content-type': 'application/json',
          'SessionId': phone
        },
        success: function (res) {
          console.log(res)
          if (res.data.code == 0) {
            console.log("获取信息成功！")
            console.log(res)
            if(res.data.data == ''){
              that.setData({
                weekList: " ",
                tips: "暂无周报信息"
              })
            }else{
              for(let i = 0; i < res.data.data.length; i++){
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_+'...'
              }
              that.setData({
                weekList: res.data.data,
                allGetData: res.data.data,
                tips: ''
              })
            }
          } else if(res.data.code == 400){
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
          else {
            console.log("获取信息失败！")
            console.log(res)
            wx - wx.showToast({
              title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/weekly/get_my_weekly",
              icon: 'none',
              mask: true,
              duration: 5000
            })
          }
        }
      })
    }, 

    
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      uppHeightTop: (wx.getSystemInfoSync().windowHeight * 0.1092 ) + 'px',
      conHeight: (wx.getSystemInfoSync().windowHeight * 0.8908 ) + 'px',
      id: wx.getStorageSync("id")
    })

  // 获取周报数组
    this.getWeekData()
  },

 


  /**************************************************下拉显示框与菜单**************************************************** */
  // 点击下拉显示框 
  selectTapsOne() {
    this.setData({
      showsOne: !this.data.showsOne,
    });
  },

  // 点击下拉显示框 
  selectTapsTwo() {
    this.setData({
      showsTwo: !this.data.showsTwo,
    });
  },
  
  // 点击下拉列表 根据项目群筛选周报
  optionTapsOne(e) {
    const app = getApp()
    //获取sessionid
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    let index = e.target.dataset.index;
    let item = e.target.dataset.item;
    app.globalData.eindex = index;
    app.globalData.eitem = item;
    //打印，看是否将两个参数存到了全局变量
    console.log(app.globalData.eindex,app.globalData.eitem)
    console.log(e.target.dataset.index)
    console.log(e.target.dataset.item)
    console.log(e)
    if (e.target.dataset.item == '全部'){
      const that = this
      that.goTop()
      that.data.allcurrentPage = 1
      //滑动条回到顶部
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/select_all_weekly
        url: 'https://oa.hubusugon.cn/hss/weekly/select_all_weekly',
        method: 'POST',
        // data: ({}),增加参数currentPage,pageSize
        data:({
          currentPage:1,
          pageSize:10
        }),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          if (res.data.code == 0) {
            console.log("获取信息成功！")
            console.log(res)
            if(res.data.data == ''){
              that.setData({
                weekList: "",
                tips: "暂无周报信息"
              })
            }else{
              for (let i = 0; i < res.data.data.length; i++) {
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_ + '...'
              }
              that.setData({
                weekList: res.data.data,
                allGetData: res.data.data,
                tips: ''
              })
            }
          }
          // 添加返回信息
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
          else {
            console.log("获取信息失败！")
            console.log(res)
          }
        }
      })
    } else if (e.target.dataset.item == '我的') {
      var that = this
      that.goTop()
      that.data.mycurrentPage = 1
      this.getWeekData()
    } else {
      // cookie获取id
      let cookie = wx.getStorageSync('cookieKey')
      console.log(cookie)
      let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      console.log(cookie)
      console.log(phone)
      wx.setStorageSync("phone", phone)
      wx.setStorageSync("id", id)
      var that = this
      that.goTop()
      that.data.CILGPage = 1
      that.data.QARGPage = 1
      that.data.RPGPage = 1
      that.data.TRIPage = 1
      that.data.EAGPage = 1
      let params = {
        mine: {
          id: id
        },
        name: e.target.dataset.item,
        currentPage:1,
        pageSize:10
      }
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/select_by_group
        url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
              that.setData({
                weekList: " ",
                tips: "暂无周报信息"
              })
            } else {
              for (let i = 0; i < res.data.data.length; i++) {
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_ + '...'
              }
              that.setData({
                weekList: res.data.data,
                tips: ''
              })
            }
          }
          else {
            that.setData({
              weekList: that.data.noList
            })
            wx - wx.showToast({
              title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/weekly/select_by_group",
              icon: 'none',
              mask: true,
              duration: 5000
            })
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    
    this.setData({
      indexsOne:index,
      showsOne: !this.data.showsOne
    });
  },

  goToweekDetail: function(e) {
    var cid = e.currentTarget.dataset.cid

    wx.navigateTo({
      url: '../weekDetail/weekDetail?cid=' + cid
    })
  },
  

  goToCreate: function () {
    wx.navigateTo({
      url: '../weekCreate/weekCreate'
    })
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
   * 页面上拉触底事件的处理函数，目前的状况是获取不到下拉菜单的对象状态，如何进行判断，然后再请求参数
   * 现在是无论下拉菜单对象怎样，只要下拉都是请求全部周报内容并拼接
   */
  onReachBottom: function () {
    const app = getApp()
    let eindex = app.globalData.eindex
    let eitem = app.globalData.eitem
    console.log(eindex,eitem)
    console.log("触底函数")
    var that = this
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
    if(eitem=='全部'){
      var allcurrentPage = that.data.allcurrentPage + 1
      that.setData({allcurrentPage:allcurrentPage})
      //获取sessionid
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    wx.request({
      // https://oa.hubusugon.cn/hss/weekly/select_all_weekly
      url: 'https://oa.hubusugon.cn/hss/weekly/select_all_weekly',
      method: 'POST',
      // data: ({}),增加参数currentPage,pageSize
      data:({
        currentPage:allcurrentPage,
        pageSize:10
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
              for (let i = 0; i < res.data.data.length; i++) {
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_ + '...'
              }
              that.weekList = that.data.weekList.concat(res.data.data)
              console.log(that.weekList)
              that.setData({
                weekList: that.weekList,
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
    /////////////////////////////////////////////////////////我的分支
    else if (eitem == '我的') {
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.indexOf(";"))
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    console.log(id)
    console.log(phone)
    wx.setStorageSync("phone", phone)
    wx.setStorageSync("id", id)
    var that = this
    var mycurrentPage = that.data.mycurrentPage + 1
    that.setData({mycurrentPage:mycurrentPage})
    wx.request({
      // https://oa.hubusugon.cn/hss/weekly/get_my_weekly
      url: 'https://oa.hubusugon.cn/hss/weekly/get_my_weekly',
      method: 'POST',
      data: ({
        mine:{
          id: id
        },
        currentPage:mycurrentPage,
        pageSize:10
      }),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          console.log("获取信息成功！")
          console.log(res)
          if(res.data.data == ''){
            wx - wx.showToast({
              title:'数据已经全部加载',
              icon: 'none',
             mask: true,
             duration: 1000
            })
          }else{
            for(let i = 0; i < res.data.data.length; i++){
              let details_ = res.data.data[i].details.slice(0, 7)
              res.data.data[i].details = details_+'...'
            }
            that.weekList = that.data.weekList.concat(res.data.data)
            console.log(that.weekList)
            that.setData({
              weekList: that.weekList,
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
      }
    })
    }
    /////////////////////////////////////////////////////////项目组分支
    else if (eitem == 'CILG'){
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
  let params = {
    mine: {
      id: id
    },
    name: eitem,
    currentPage:CILGPage,
    pageSize:10
  }
  wx.request({
    // https://oa.hubusugon.cn/hss/weekly/select_by_group
    url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
          for (let i = 0; i < res.data.data.length; i++) {
            let details_ = res.data.data[i].details.slice(0, 7)
            res.data.data[i].details = details_ + '...'
          }
          that.weekList = that.data.weekList.concat(res.data.data)
          console.log(that.weekList)
          that.setData({
            weekList: that.weekList,
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
  }else if (eitem == 'QARG'){
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
    var QARGPage = that.data.QARGPage + 1
    that.setData({QARGPage:QARGPage})
    let params = {
      mine: {
        id: id
      },
      name: eitem,
      currentPage:QARGPage,
      pageSize:10
    }
    wx.request({
      // https://oa.hubusugon.cn/hss/weekly/select_by_group
      url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
            for (let i = 0; i < res.data.data.length; i++) {
              let details_ = res.data.data[i].details.slice(0, 7)
              res.data.data[i].details = details_ + '...'
            }
            that.weekList = that.data.weekList.concat(res.data.data)
            console.log(that.weekList)
            that.setData({
              weekList: that.weekList,
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
    }else if (eitem == 'RPG'){
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
        mine: {
          id: id
        },
        name: eitem,
        currentPage:RPGPage,
        pageSize:10
      }
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/select_by_group
        url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
              for (let i = 0; i < res.data.data.length; i++) {
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_ + '...'
              }
              that.weekList = that.data.weekList.concat(res.data.data)
              console.log(that.weekList)
              that.setData({
                weekList: that.weekList,
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
      }else if (eitem == 'TRI'){
        // cookie获取id
        let cookie = wx.getStorageSync('cookieKey')
        console.log(cookie)
        let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
        let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
        let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
        console.log(cookie)
        console.log(phone)
        wx.setStorageSync("phone", phone)
        wx.setStorageSync("id", id)
        var that = this
        var TRIPage = that.data.TRIPage + 1
        that.setData({TRIPage:TRIPage})
        let params = {
          mine: {
            id: id
          },
          name: eitem,
          currentPage:TRIPage,
          pageSize:10
        }
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
                for (let i = 0; i < res.data.data.length; i++) {
                  let details_ = res.data.data[i].details.slice(0, 7)
                  res.data.data[i].details = details_ + '...'
                }
                that.weekList = that.data.weekList.concat(res.data.data)
                console.log(that.weekList)
                that.setData({
                  weekList: that.weekList,
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
        }else if(eitem == 'EAG'){
      // cookie获取id
      let cookie = wx.getStorageSync('cookieKey')
      console.log(cookie)
      let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      console.log(cookie)
      console.log(phone)
      wx.setStorageSync("phone", phone)
      wx.setStorageSync("id", id)
      var that = this
      var EAGPage = that.data.EAGPage + 1
        that.setData({EAGPage:EAGPage})
      let params = {
        mine: {
          id: id
        },
        name: eitem,
        currentPage:EAGPage,
        pageSize:10
      }
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/select_by_group',
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
              for (let i = 0; i < res.data.data.length; i++) {
                let details_ = res.data.data[i].details.slice(0, 7)
                res.data.data[i].details = details_ + '...'
              }
              that.weekList = that.data.weekList.concat(res.data.data)
              console.log(that.weekList)
              that.setData({
                weekList: that.weekList,
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