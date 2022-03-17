// pages/addto/addto.js
Page({
  /**
 * 页面的初始数据
 */
  data: {
    name: "",
    level: "",
    // 竞赛等级
    level_array: ["国一","国二","国三","省一","省二","省三","市一","市二","市三"],
    team_name: "",
    project_name: "",
    time: "" ,
      // 调用接口获取竞赛名称
    array: ["全国大学生英语竞赛","全国大学生数学竞赛"],
    // 数组下标
    index:null,
    // 按钮状态--一开始可以点击
    buttonstatus: false

  },
  // 页面加载
  onLoad: function (options) {
    let sessionid = wx.getStorageSync('sessionid') || []
    var that = this;
    // 获取用户id
    // this.getUserId()
    // 调用接口获取所有竞赛名称
    this.getAllCompetitionName()

  },
  onShow: function (options) {
    let sessionid = wx.getStorageSync('sessionid') || []
    this.setData({
      buttonstatus : !buttonstatus
    })
  },
  // 获取用户id
  getUserId() {
    let id = wx.getStorageSync('id') || []
    this.setData({
      id: id,
    })
  },
  // 调用接口获取所有竞赛名称后添加“手动输入”
  getAllCompetitionName(){
    var that = this
    let phone = wx.getStorageSync('phone') || []
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/competition/get_competition_name',
      method: 'POST',
      data: ({}),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        console.log("接口调用成功")
        console.log(res)
        that.setData({
          array : res.data.data,
        })
        that.data.array.push("手动输入")
        that.setData({
          array: res.data.data,
        })
        console.log(`竞赛名称`,that.data.array)
      },
      fail: function (res) {
        console.log("竞赛名称获取失败")
        console.log(res)
        wx - wx.showToast({
          title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/competition/get_competition_name",
          icon: 'none',
          mask: true,
        })
      },
      complete: function (res) { 
      }
    })
  },
  /**
   * 日期
   */
  bindDateChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },
  // 选择竞赛等级
  bindlevelChange:function(e){
    var that = this
    var levelindex = e.detail.value;
    that.setData({
      level: this.data.level_array[levelindex]
    })

  },
// 选择器竞赛名称修改
  bindnameChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // this.index = e.detail.value;
    // var name = this.data.name
    var that = this
    var index = e.detail.value;
    that.setData({
      name : this.data.array[index]
    })
    // pickerchange的值 确定是否替换为输入框
    that.pickerChange(that.data.array[index], index);
    console.log(that.data.array[index])
    
    // name: this.array[index]
  },
  pickerChange:function(name,index){
    console.log(`name`,name)
    if (name == "手动输入") {//手动输入
      this.setData({
        start_reply: true,
      })
    } else {//选择竞赛名称
      this.setData({
        start_reply: false,
      })
    }
    this.setData({
      index: index,
      name: name
    })
  },
    // 输入竞赛名称
  inputUpdatename: function (e) {
    this.setData({
      name: e.detail.value
    })
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
  },
  // 
  // 提交事件
  setSubmit: function (e) {
    var data = this.data
    var that = this
    console.log(`1`, data.name)
    let id = wx.getStorageSync('id') || []
    let phone = wx.getStorageSync('phone') || []
    console.log(id)
    // 不合法输入
    if (!data.name || !data.project_name || !data.team_name || !data.time || !data.level) {
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
      return;
    }
    console.log("输入成功");
    console.log(data.name, data.project_name, data.team_name, data.time, data.level)
    wx - wx.request({
      url: 'https://oa.hubusugon.cn/hss/competition/submit_competition', //api接口的路径
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      data: ({
        name: data.name,
        level: data.level,
        team_name: data.team_name,
        project_name: data.project_name,
        time: data.time,
        mine: { id: id }// id固定
      }),
      success: function (res) {
        console.log("提交成功")
        if (res.data.code == 0) {
          wx.showToast({
            title: "提交成功",
            icon: 'none',
            mask: true,
          })
          that.setData({
            buttonstatus: true
          })
          console.log(`提交时间`,data.time)
          wx.switchTab({
            url: '../contest/contest',
            success: function (res) {
              // success
              console.log("跳转成功");
            },
            fail: function (res) {
              // fail
              console.log("跳转失败");
            },
            complete: function (res) {
              // complete
            }
          })
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
        else{
          wx - wx.showToast({
            title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/competition/submit_competition",
            icon: 'none',
            mask: true,
            duration: 5000
          })
        }
      },
      fail: function (res) {
        console.log("提交失败")
      },
      complete: function (res) { },
    })
  },  
})