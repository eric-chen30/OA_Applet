// pages/weekDetail/weekDetail.js
Page({
  data: {
    name: "",
    weekly: []
  },
  
  onLoad: function(options) {
    var that = this
    // let id = wx.getStorageSync('id') || []
    var wid = options.cid;
    // 获取sessionid
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    if (wid !== ''){
      wx.request({
        // https://oa.hubusugon.cn/hss/weekly/get_weekly_details
        url: 'https://oa.hubusugon.cn/hss/weekly/get_weekly_details',
        data: ({
          id: wid
        }),
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId': phone
        },
        success: function(res) {
          console.log(res)
          // 周报名切分
          // var name = []
          // var bedata = res.data.data[0]
          // name = bedata.name.split(' ')
          // name[1] = name[1].substring(5, 10)
          // bedata.name = name.join(" ")
          that.setData({
            weekly: res.data.data,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }

  },
})