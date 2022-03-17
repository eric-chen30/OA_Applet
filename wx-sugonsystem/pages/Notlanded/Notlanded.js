// pages/Notlanded/Notlanded.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: "", 
    isShow1: true,
    inputType1: "password"
  },

  // 手机号部分
  inputPhoneNum: function (e) {
    var phone
    this.setData({
      phone: e.detail.value
    })
  },

  // 密码部分
  inputPassword: function (e) {
    var password
    this.setData({
      password: e.detail.value
    })
  },

  //点击小眼睛图标
  showNewPsd1: function () {
    if (this.data.isShow1) {   //如果this.data.isShow为true,则表示为密码小黑点
      this.setData({
        isShow1: false,
        inputType1: "password"
      })
    } else {
      this.setData({
        isShow1: true,
        inputType1: "text"
      })
    }
  },

  //登录事件
  login: function (e) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'https://oa.hubusugon.cn/hss/login/login', //api接口的路径
            method: 'POST',
            data: JSON.stringify({
              phone: this.data.phone,
              password: this.data.password
            }),
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              // msg: "登录成功";
              // code: 0,
              //把openid保存到缓存里面
              console.log(res)
              // wx.setStorageSync("openid", res.openid);
              // wx.setStorageSync("session_key", res.session_key);
              if (res && res.header && res.header['Set-Cookie']) {
                wx.setStorageSync('cookieKey', res.header['Set-Cookie']);   //保存Cookie到Storage
              }

              if (res.data.code == 0) {
                wx.showToast({
                  title: '登陆成功',
                })
                wx.switchTab({
                  url: '/pages/Landed/Landed',
                })
              } else if(res.data.code == 500){
                wx.showModal({
                  title: '注意',
                  content: res.data.msg,
                  success: function(res) {
                    if (res.confirm) {
                    console.log('用户点击确定')
                    } else if (res.cancel) {
                    console.log('用户点击取消')
                    }
                  }
                })            
              }
              else {
                wx.showModal({
                  title: '提示',
                  content: '手机号或密码错误',
                })
              }
            }
          })
        } else {
          // msg: "手机号或密码错误";
          // code: 500,
          console.log(res)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    let cookie = wx.getStorageSync('cookieKey')
    // console.log(cookie)
    let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
    if(id){
      wx.switchTab({
        url: '/pages/Landed/Landed',
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})