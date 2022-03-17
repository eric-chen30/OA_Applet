// pages/createWeek/createWeek.js
Page({
  data: {
    time: "",
    this_content: "",
    details: "",
    next_content: "",
    problem: ""
  },
  setSubmit: function (e) {
    if (this.data.this_content == '' || this.data.details == '' || this.data.next_content == '' || this.data.problem == ''){
      wx.showModal({
        title: '提示',
        content: '填写内容不完整，请检查',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
    } else {
      var data = this.data
      var that = this
      let id = wx.getStorageSync('id') || []
      // 获取sessionid
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      wx - wx.showLoading({
        title: '正在提交中',
        mask: true,
      })
      wx - wx.request({
        // https://oa.hubusugon.cn/hss/weekly/submit_Weekly
        url: 'https://oa.hubusugon.cn/hss/weekly/submit_Weekly', //api接口的路径
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        data: ({
          mine: {
            id: id
          },
          this_content: data.this_content,
          details: data.details,
          next_content: data.next_content,
          problem: data.problem
        }),
        success: function (res) {
          console.log("提交成功");
          console.log(res)
          wx - wx.hideLoading();
          let pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            let prePage = pages[pages.length - 2];
            //刷新
            prePage.onLoad()
          }
          wx.switchTab({
            url: '../week/week'
          })
        },
        fail: function (res) {
          console.log("提交失败")
        },
      })
    }
  },
  bindDateChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  inputthiscontent: function (e) {
    this.setData({
      this_content: e.detail.value
    })
  },
  inputdetails: function (e) {
    this.setData({
      details: e.detail.value
    })
  },
  inputnextcontent: function (e) {
    this.setData({
      next_content: e.detail.value
    })
  },
  inputproblem: function (e) {
    this.setData({
      problem: e.detail.value
    })
  }

})