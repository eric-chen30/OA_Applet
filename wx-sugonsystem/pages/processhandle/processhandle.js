// pages/processhandle/processhandle.js

import Toast from '../../static/vant/toast/toast';

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  
  /**
   * 组件的初始数据
   */
  data: {
        // 表单数据---流程详情
        title: '',
        begin_time: '',
        end_time: '',
        receiver: '',
        article: '',
        plan:'',

        // 接收者的id
        receiverId: '',
  
        // 存储流程id
        id: '',
        // 存储流程的状态
        state: '',

        // 用户id----发送者id
        // senderId: 7,

        // 更新表单
        updateTitle: '',
        // 结束时间
        updateEndTime: '',
        // 接收者id
        newReceiverID:'',
        // 更新的具体内容
        updateArticle: ''

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
      if(that.data.receiverId !== 0){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/findNameById?uid=' + that.data.receiverId,
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
              receiver: res.data.data
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

    // 接收someflow页面传来的id
    onLoad: function(options){
      let that = this
      var pid = options.id
      var id = parseInt(pid)
      var state = options.status
      var status = parseInt(state)
      var receiverId = options.receiverId
      var receiver = parseInt(receiverId)

      // pid为string    that.id为number
      console.log(pid, typeof pid, id, typeof id)
      console.log(status, typeof status)
      console.log(receiver, typeof receiver)
      that.setData({
        id: id,
        state: status,
        receiverId: receiver
      })

      //  一旦使用了setdata进行赋值，在获取参数时，要用下面的后者获取
      console.log(that.id)          // 输出为空
      console.log(this.id)          // 输出为空
      console.log(that.data.id)     // 10
      console.log(this.data.id)     // 10

      // 发送查看详情的请求
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if (that.data.id !== ''){
        // 通过用户id获取到用户的姓名，并渲染
        // that.findNameById()
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/watch_the_task?id=' + that.data.id,
          data: ({}),
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function(res) {
            console.log(res)
            if(res.data.code == 0){
              console.log('获取信息成功')
              // 通过用户id获取到用户的姓名，并渲染
              that.findNameById()
              // 对开始时间进行处理--------只能对数组进行处理
              // if(res.data.data.begin_time !== null){
              //   res.data.data.begin_time = res.data.data.begin_time.substring(0,19)
              //   res.data.data.begin_time = res.data.data.begin_time.replace(/-/g, "/")
              //   res.data.data.begin_time = res.data.data.begin_time.replace(/T/, " ")
              //   }else{}

              that.setData({
                title: res.data.data.title,
                begin_time: res.data.data.beginTime,
                end_time: res.data.data.endTime,
                receiver: that.data.receiver,
                article: res.data.data.article,
                state: res.data.data.state,
                plan:res.data.data.plan
              })
            }else if(res.data.code == 400){
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
            }else{
              console.log('获取信息失败')
            }

          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }else{}

    },

    // 返回上上个页面
    getbackPage(){
      wx.navigateBack({
        delta: 2
      })
    },

    

    // 删除流程
    deleteProcess(){
      console.log(this.data.id)
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/delete_task?id=' + that.data.id,
        method: 'POST',
        data: ({}),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          if(res.data.code == 0){
            console.log('请求成功')
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000    //持续的时间
            })
            // 延时调用返回上个页面函数
            setTimeout(that.getbackPage,1000)
          }else if(res.data.code == 400){
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
          }else{
            console.log('获取信息失败')
          }

        }
      })

    },

    // 修改按钮跳转页面
    goTochangeflow() {
      wx.navigateTo({
        url: '../changeflow/changeflow?id=' + this.data.id + '&status=' + this.data.state
      })
    },
  }
})

