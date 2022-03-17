// pages/addto/addto.js

Page({
  data: {
    // 竞赛信息
    basedata: [],
    // 竞赛id
    cid:null,
    name: "",
    level: "",
    team_name: "",
    project_name: "",
    time: ""  
  },
  /**
   * 提交事件
   */
  onLoad: function (options) {
    // 
    this.setData({
      cid: options.cid,
      what: options.what
    })
    this.getDetail()
  },

  // 根据id获取竞赛详情
  getDetail:function(e){
    var that = this
    let cid = that.data.cid
    let phone = wx.getStorageSync('phone') || []
    console.log(`cid`,cid)
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/competition/get_competition_detail',
      method: 'GET',
      data:({
        id : Number(cid)
      }),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        console.log("获取成功")
        console.log(cid)
        // 过滤时间

        if (res.data.data.length > 0) {
          res.data.data.forEach((e) => {
            e.time = e.time.substring(0, 10)
            e.time = e.time.replace(/-/g, "-")
            e.time = e.time.replace(/T/, " ")
          })
        }        
        that.setData({basedata : res.data.data[0]})
        console.log(`basedata`,that.data.basedata)
      },
      fail: function (res) {
        console.log("提交失败")
      },
      complete: function (res) { },
    })
  },
 
  /**
   * 日期输入
   */
  bindDateChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  datachange:function(){

  },

  inputUpdatename: function (e) {
    console.log(e);
    this.setData({
      name: e.detail.value
    })
    console.log(this.data.name);
  },
  inputUpdatelevel: function (e) {
    this.setData({
      level: e.detail.value
    })
  },
  inputUpdateteam_name: function (e) {
    this.setData({
      team_name: e.detail.value
    })
  },
  inputUpdateproject_name: function (e) {
    this.setData({
      project_name: e.detail.value
    })
  }
})