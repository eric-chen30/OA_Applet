//contest.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    searchdata: [],
    // 模糊搜索的竞赛名
    value: "",
    // 具体竞赛的id
    cid: null,
    // 横向滑动框列表
    smallList:[],
    //竞赛内容列表
    dataList: [],
    // 上面高度
    upperHeight: '',
    //头部上
    upperHeightTop: '',
    //头部下
    upperHeightBot: '',
    // 左右滑动框高度
    scrollHeight: '',
    // 内容高度
    contentHeight: '',
    // 底部高度
    bottomHeight: '',
    // 默认图片url地址
    pic:'',
    // 提示信息
    tips: ''
  },
  // 获取用户信息
  onLoad: function(option) {
    this.setData({
      upperHeight: (wx.getSystemInfoSync().windowHeight * 0.21) + 'px',
      upperHeightTop: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.52) + 'px',
      upperHeightBot: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.36) + 'px',
      scrollHeight: (wx.getSystemInfoSync().windowHeight * 0.20) + 'px',
      contentHeight: (wx.getSystemInfoSync().windowHeight * 0.59) + 'px',
    }) 
     // 请求默认信息
    this.getPicture()
    // 获取所有竞赛信息
    this.get_allcompetition()
    // 获取可参加竞赛
    this.get_avaliablecompetition()
  
  },
  onShow: function(option) {
    this.get_allcompetition()
  },
  // 获取可参加竞赛
  get_avaliablecompetition:function(e){
    var that = this
    let phone = wx.getStorageSync('phone') || []
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/competition/get_pic_and_word',
      data: ({
      }),
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        that.setData({
          smallList: res.data.data
        })
        console.log(`"可参加竞赛"`,that.data.smallList)
        if(res.data.code == 400){
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
      }
    })
  },
  // 获取个人所有竞赛信息
  get_allcompetition: function(e) {
    var that = this
    let id = wx.getStorageSync('id') || []
    let phone = wx.getStorageSync('phone') || []
    console.log(`用户id`, id);
    wx.request({
        url: 'https://oa.hubusugon.cn/hss/competition/get_own_all_competition',
        data: ({
          // 测试页面时暂时写为固定id
          uid: id,
        }),
        method: 'GET',
        header: {
          'content-type': 'application/json',
          'SessionId': phone
        },
        success: function(res) {
          // 请求接口成功的操作--将竞赛信息赋值给dataList
          console.log("请求成功")
          console.log(res)
          console.log(res.data.data.length)
          if(res.data.code == 0){
            if(res.data.data.length == 0){
              that.setData({
                tips: "啊哦~暂无获奖记录"
              })
            }else{
              //  判断并且添加默认图片
            if (res.data.data) {
              res.data.data.forEach((e) => {
                if(e.picture == null){
                  e.picture = that.data.pic
                }   
                })
              }
              that.setData({
                dataList: res.data.data,
                tips: ''
              })
              console.log(`竞赛列表`, that.data.dataList)
            }
          }else{
            that.setData({
              tips: ''
            })
            wx - wx.showToast({
              title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/competition/get_own_all_competition",
              icon: 'none',
              mask: true,
              duration: 5000
            })
          }
        },
        fail: function(res) {
          console.log("请求失败")
        },
        complete: function(res) {},
      })
      // 请求默认图片      
  },
// 请求默认图片
getPicture:function(e){
  var that = this
  let phone = wx.getStorageSync('phone') || []
  wx.request({
    url: 'https://oa.hubusugon.cn/hss/competition/get_default_url',
    method: 'POST',
    data: ({}),
    header: {
      'content-type': 'application/json',
      'SessionId': phone
    },
    success: function (res) {
      console.log("请求默认图片成功")
      console.log(`返回信息`,res.data.msg)
      that.setData({
        pic: res.data.msg,
        tips: ''
      })
      console.log(that.data.pic)
    },
    fail: function (res) { },
    complete: function (res) { },
  })
},


  //删除信息
  deletecompetition: function(e) {
    let id = wx.getStorageSync('id') || []
    console.log(e);
    var cid = e.currentTarget.dataset.cid
    var that = this
    let phone = wx.getStorageSync('phone') || []
    wx - wx.showModal({
      title: '提示',
      content: '是否删除',
      confirmText: '删除',
      cancelText: '取消',
      showCancel: true,
      success: function(res) {
        if (res.confirm) {
          console.log("用户选择删除");
          console.log(cid);
          wx.request({
            url: 'https://oa.hubusugon.cn/hss/competition/delete_competition',
            method: 'GET',
            header: {
              'content-type': 'application/json',
              'SessionId': phone
            },
            data: ({
              id: cid
            }),
            success: function(res) {
              console.log(res)
              that.onLoad()
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //竞赛详情
  goToDetail: function(e) {
    var cid = e.currentTarget.dataset.detailid
    console.log(`竞赛id`, cid)
    wx.navigateTo({
      url: '../awardDetail/awardDetail?cid=' + cid,
    })
  },
  // 搜索功能
  searchInput: function(e) {
    console.log(e);
    var that = this
    let phone = wx.getStorageSync('phone') || []
    that.setData({
      value: e.detail.value
    })
    var value = that.data.value
    if (!value) {
      wx - wx.showToast({
        title: '请输入查询信息！',
        icon: 'none',
        mask: true,
      })
      this.get_allcompetition()
      return;
    }
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/competition/get_game_by_gname',
      method: 'POST',
      data: ({
        name: that.data.value
      }),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function(res) {
        // 请求接口成功的操作--将竞赛信息赋值给dataList
        console.log("请求成功")
        // 过滤时间

        if (res.data.data.length > 0) {
          res.data.data.forEach((e) => {
            e.time = e.time.substring(0, 10)
            e.time = e.time.replace(/-/g, "/")
            e.time = e.time.replace(/T/, " ")
          })
        }
        that.setData({
          dataList: res.data.data,
          tips: ''
        })
        console.log(`新竞赛列表`, that.data.dataList)

      },
      fail: function(res) {
        console.log("搜索竞赛名称获取失败")
        console.log(res)
      },
      complete: function(res) {}
    })
  },
  // goTosearch: function() {
  //   console.log("hi")
  //   var value = this.data.value
  //   if (!value) {
  //     wx - wx.showToast({
  //       title: '请输入查询信息！',
  //       icon: 'none',
  //       mask: true,
  //     })
  //     return;
  //   }
  //   wx.navigateTo({
  //     url: '../search/search?value=' + value
  //   })
  // },

  //添加竞赛
  goToaddto: function() {
    wx.navigateTo({
      url: '../addto/addto'
    })
  },
})