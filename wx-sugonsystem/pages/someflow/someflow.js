// pages/someflow/someflow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    // 存储传过来的id
    id: "",

    // 存储流程的标题
    title: "",

    // 存储接收者id
    receiver: "",

    // 存储接收者姓名
    receiver_name: "",

    // 存储接收者的流程状态
    status: "",

    // 存储截至时间
    end_time: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  根据id查找姓名
    findNameById(){
      let that = this
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if(that.receiver !== 0){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/findNameById?uid=' + that.receiver,
          data: ({}),
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function(res) {
            console.log(res)    //  name = res.data.data
            if(res.data.code == 0){
            that.setData({
              receiver_name: res.data.data
            })
            }else{
              wx.showToast({
                title: '未找到对应的姓名',
                icon: 'none',
                duration: 2000    //持续的时间
              })
            }
          }
        })
      }
    },

    // 初始化函数，接收传过来的流程id，并发送请求
    onLoad: function (options) {
      var that = this;
      var cid = options.cid;
      var status = options.state
      var receiver = options.receiverId
      // 将传过来的字符串id转换为整型
      that.id = parseInt(cid);
      that.status = parseInt(status)
      that.receiver = parseInt(receiver)
      console.log(cid, typeof cid);
      console.log(status, typeof status)
      let cookie = wx.getStorageSync("cookieKey");
      let sessionid = cookie.substring(
        cookie.indexOf("=") + 1,
        cookie.indexOf(";")
      );
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      // 发送获取详情请求，来的到需要的参数
      if (that.id !== "") {
        // 通过用户id获取到用户的姓名，并渲染
        that.findNameById()
        wx.request({
          url:
            "https://oa.hubusugon.cn/hss/weekly/watch_the_task?id=" + that.id,
          data: {},
          method: "POST",
          header: {
            "content-type": "application/json",
            SessionId: phone,
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 0) {
              console.log("获取信息成功");

              // 根据返回的state值来赋值对应的状态
              if (res.data.data.state == 1) {
                that.setData({
                  title: res.data.data.title,
                  end_time: res.data.data.end_time,
                  receiver: that.data.receiver_name,
                  status: "未领取",
                });
              } else if (res.data.data.state == 2) {
                that.setData({
                  title: res.data.data.title,
                  end_time: res.data.data.end_time,
                  receiver: that.data.receiver_name,
                  status: "待办",
                });
              } else if (res.data.data.state == 3) {
                that.setData({
                  title: res.data.data.title,
                  end_time: res.data.data.end_time,
                  receiver: that.data.receiver_name,
                  status: "已完成",
                });
              } else if (res.data.data.state == 4) {
                that.setData({
                  title: res.data.data.title,
                  end_time: res.data.data.end_time,
                  receiver: that.data.receiver_name,
                  status: "逾期",
                });
              } else {
                console.log("出现错误");
              }
            } else if (res.data.code == 400) {
              wx.showModal({
                title: "注意",
                content: res.data.msg,
                success: function (res) {
                  if (res.confirm) {
                    console.log("用户点击确定");
                    wx.navigateTo({
                      url: "../NotLanded/NotLanded",
                    });
                  } else if (res.cancel) {
                    console.log("用户点击取消");
                    wx.navigateTo({
                      url: "../NotLanded/NotLanded",
                    });
                  }
                },
              });
            } else {
              console.log("获取信息失败");
            }
          },
          fail: function (res) {},
          complete: function (res) {},
        });
      } else {
      }
    },

    // 点击按钮跳转页面，对流程进行删改或者删除操作
    goToProcessHandle() {
      // 需要把流程id传过去----上面的id就是流程id
      wx.navigateTo({
        url: "../processhandle/processhandle?id=" + this.id + '&status=' + this.status + '&receiverId=' + this.receiver,
      });
    },
  },
});


