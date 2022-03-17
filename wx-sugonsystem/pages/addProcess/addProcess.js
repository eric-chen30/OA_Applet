// pages/AddProcess/AddProcess.js

// const citys = {
//   工坊: ['全体成员'],
//   CILG: ['张三', '李四', '王五'],
//   RPG: ['小明', '李四', '王五'],
//   QARG: ['小红', '李四', '王五'],
  
// };

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
    // 表单内容
    title: '',        //流程标题
    date: '',     // 流程截至时间
    receiver: '',     // 接收者姓名
    article: '',       // 详细内容
    sender: '',       // 用户id

    // 控制日历的显示与隐藏
    show: false,

    // 根据姓名查找id
    name: '',

    // 根据姓名返回的id
    receiver_id: ''
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
        sender: id,
      })
      // 访问数据的格式
      console.log(this.data.sender)
    },

    // 根据姓名查找id
    getNameById() {
      console.log('根据姓名查找id')
      let that =this
      let cookie = wx.getStorageSync('cookieKey')
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/findIdByName?name=' + that.data.receiver,
        method: 'POST',
        data: ({}),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          if(res.data.code == 0){
            console.log('请求成功')
            console.log(res)
            that.setData({
              receiver_id: res.data.data
            })
            console.log(that.data.receiver_id)
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

    // 页面初始加载函数
    onLoad: function() {
      this.getUserId()
    },


     // 获取主页面的数据(用于返回上一页时刷新数据)
  getdataList() {
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    if(this.data.selectDatas[this.data.Findexs] == '全部'){
    let that = this
    console.log('获取主页面数据')
    console.log(that.data.selectDatas[that.data.Findexs])
    console.log(that.data.statusDatas[that.data.Lindexs])
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/weekly/watch_all_task',
      method: 'POST',
      data: ({}),
      header: {
        'content-type': 'application/json',
        'SessionId':phone
      },
      success: function (res) {
        if(res.data.code == 0){
          console.log('获取信息成功')
          console.log(res)
          if(res.data.data == ''){
            // 提醒暂无数据
            wx.showToast({
              title: '暂无数据',
              icon: 'none',
              duration: 2000    //持续的时间
            })
          }else{
            for(let i = 0; i < res.data.data.length; i++){
              // 对于内容为空的无法进行切分
              if(res.data.data[i].article !== null){
              let article_ = res.data.data[i].article.slice(0, 7)
              res.data.data[i].article = article_+'...'
              }else{}
            }
            that.setData({
              dataList: res.data.data,
            })
          }
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
  }
},

    // 返回上个页面
    getbackPage(){
      //刷新数据
      var pages = getCurrentPages();
      var beforePage = pages[pages.length - 2];
      beforePage.getdataList();

      wx.navigateBack({
        delta: 1
      })
    },

    // 发布一个流程
    publishProcess() {
      console.log('点击按钮，发送请求，添加流程')
      let that = this
      let cookie = wx.getStorageSync('cookieKey')
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if(that.data.receiver_id !== ''){
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/release_task?title=' + that.data.title + '&endTime=' + that.data.date + '&receiver=' + that.data.receiver_id + '&article=' + that.data.article + '&sender=' + that.data.sender,
        method: 'POST',
        data: ({}),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          console.log('请求成功')
          console.log(res)
          console.log(that.data.title,that.data.date,that.data.receiver_id,that.data.article)
          if(res.data.code == 0){
            // 赋值----为了能够渲染在页面上
            // that.setData({
            // })
            wx.showToast({
              title: '发布成功',
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
    }else if(that.data.receiver_id == ''){
      // 请检查姓名是否输入正确
      wx.showToast({
        title: '请检查接收者姓名是否正确',
        icon: 'none',
        duration: 2000    //持续的时间
      })
    }else{
      console.log('出现错误')
    }
    },

    // 日历组件
    onDisplay() {
      this.setData({ show: true });
    },
    onClose() {
      this.setData({ show: false });
    },
    formatDate(date) {
      date = new Date(date);
      return `2020-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(event) {
      this.setData({
        show: false,
        date: this.formatDate(event.detail),
      });
    },


    // 聚焦输入流程名
    changeTitle(e){
      this.setData({
        title: e.detail.detail.value   // e.detail.value没有定义
      })
    },

    // 流程名失去焦点
    getTitle(){},

    // 聚焦输入接收者     ----输入姓名，请求得到接收者的id，在吧id进行赋值
    changeReceiver(e){
      this.setData({
        receiver: e.detail.detail.value   // e.detail.receiver没有定义
      })
      // 调用接口,得到接收者id
      this.getNameById()
    },

    // 接收者失去焦点
    getReceiver(){},

    // 聚焦输入具体内容
    changeArticle(e){
      this.setData({
        article: e.detail.detail.value   // e.detail.article没有定义
      })
    },

    // 具体内容失去焦点
    getArticle(){},


  }
})
