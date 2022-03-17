// pages/changePasswd/changePasswd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    newPassword: "",
    makesure: "",
    isShow1: true,
    inputType1: "password"
  },

  // 输入手机号
  inputPhone: function (e) {
    let phone
    this.setData({
      phone: e.detail.value
    })
  },
  //输入新密码
  newPass: function (e) {
    let newPassword
    this.setData({
      newPassword: e.detail.value
    })
  },
  // 确认密码
  sure: function (e) {
    let makesure
    this.setData({
      makesure: e.detail.value
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

  // 确认修改密码
  changePasswd: function (e) {
    let phone = wx.getStorageSync('phone') || []
    let sessionid = wx.getStorageSync('sessionid') || []
    if (this.data.makesure == '' || this.data.newPassword == ''){
      wx - wx.showToast({
        title: "请输入密码",
        icon: 'none',
        mask: true,
      })
    } else {
      if (this.data.makesure == this.data.newPassword) {
        console.log(phone)
        console.log(this.data.newPassword)
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/login/update_password', //api接口的路径
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'SessionId': phone
          },
          data: JSON.stringify({
            phone: phone,
            password: this.data.newPassword
          }),
          success: function (res) {
            // msg: "修改成功";
            // code: 0,
            console.log(res)
            if (res.data.code == 0) {
              wx.showToast({
                title: "修改成功",
                duration: 2000
              });
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/Landed/Landed',
                })
              }, 2000)
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
              wx.showModal({
                title: '提示',
                content: '修改失败',
              })
            }
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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