// pages/changeflow/changeflow.js

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
    // 流程id
    id: '',
    // 流程名
    title: '',
    // 流程截至时间
    end_time: '',
    // 接收者id
    receiver_id: '',
    // 输入框输入姓名
    receiver: '',
    // 具体内容
    article: '',
    // 发送者id，即用户id
    senderId: '',
    // 流程的状态
    state: ''
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    //获取用户id
    getUserId() {
      let id = wx.getStorageSync('id') || []
      console.log(id)
      this.setData({
        senderId: id,
      })
      // 访问数据的格式
      console.log(this.data.senderId)
    },

    // 页面初始加载函数
    // onLoad: function() {
    //   this.getUserId()
    // },


    //  根据id查找姓名
    findIdByName(){
      let that = this
      let cookie = wx.getStorageSync('cookieKey')
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if(that.data.receiver !== 0){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/findIdByName?name=' + that.data.receiver,
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
              receiver_id: res.data.data
            })
            }else{
              // wx.showToast({
              //   title: '未找到对应的id',
              //   icon: 'none',
              //   duration: 2000    //持续的时间
              // })
            }
          }
        })
      }
    },


    // 接受传过来的流程id
    onLoad: function(options){
      let that =this
      var pid = options.id
      var state = options.status
      var status = parseInt(state)
      var id = parseInt(pid)
      console.log(pid, typeof pid, id, typeof id)
      console.log(status, typeof status)
      that.setData({
        id: id,
        state: status
      })
      console.log(that.data.id, that.data.state)
      that.getUserId()

    },

    // 跳转到首页
    getbackPage(){
      wx.navigateBack({
        delta: 3
      })
    },


    // 修改流程      -----------需要用户id  即发送者id   senderId
    updateProcess(){
      let cookie = wx.getStorageSync('cookieKey')
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      // 标题和具体内容为空   因为没有赋值
      console.log(that.data.id,that.data.title,that.data.end_time,that.data.senderId,that.data.receiver,that.data.article)
      if(that.data.receiver_id !== ''){
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/update_task?id=' + that.data.id + '&title=' + that.data.title + '&article=' + that.data.article + '&end_time=' + that.data.end_time + '&sender=' + that.data.senderId + '&receiver=' + that.data.receiver_id + '&state=' + that.data.state,
        method: 'POST',
        data: ({}),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          console.log('请求成功')
          if(res.data.code == 0){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
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
     }else{
      wx.showToast({
      title: '请检查接收者姓名是否正确',
      icon: 'none',
      duration: 2000    //持续的时间
      })
     }

    },

     // 日历组件
     onDisplay() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    },
    formatDate(end_time) {
      end_time = new Date(end_time);
      return `2020-${end_time.getMonth() + 1}-${end_time.getDate()}`;
    },
    onConfirm(event) {
      this.setData({
        show: false,
        end_time: this.formatDate(event.detail),
      });
    },

    // input框绑定值

    // 聚焦输入流程名
    updateTitle(e){
      this.setData({
        title: e.detail.detail.value   // e.detail.value没有定义
      })
    },

    // 流程名失去焦点
    getTitle(){},

    // 聚焦输入接收者
    updateReceiver(e){
      this.setData({
        receiver: e.detail.detail.value   // e.detail.receiver没有定义
      })
      this.findIdByName()
    },

    // 接收者失去焦点
    getReceiver(){},

    // 聚焦输入具体内容
    updateArticle(e){
      this.setData({
        article: e.detail.detail.value   // e.detail.article没有定义
      })
    },

    // 具体内容失去焦点
    getArticle(){},


  }

})
