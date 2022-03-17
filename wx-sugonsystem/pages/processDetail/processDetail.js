// pages/processDetail/processDetail.js

const citys = {
  工坊: ['全体成员'],
  CILG: ['张三', '李四', '王五'],
  RPG: ['小明', '李四', '王五'],
  QARG: ['小红', '李四', '王五'],
  
};

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
      // begin_time: '',
      end_time: '',
      receiver: '',
      article: '',

      plan:'',

      // 接收者id
      receiverId: '',

      //plan修改
      isDisabled:true,

      // 存储流程id
      id: '',
      // 存储流程的状态
      state: ''
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
      if(that.receiverId !== 0){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/findNameById?uid=' + that.receiverId,
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

    // 获取路由传过来的流程id，并发送请求，获取流程详情
    onLoad: function(options) {
      var that = this
      var pid = options.id
      var status = options.state
      var receiverId = options.receiverId
      // var int = 1
      // console.log(int, typeof int)
      that.id = parseInt(pid)
      that.state = parseInt(status)
      that.receiverId = parseInt(receiverId)
      // 类型为string
      console.log(pid, status, typeof pid, typeof status)
      // 类型为number
      console.log(that.id, that.state, typeof that.id, typeof that.state)
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if (that.id !== ''){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/watch_the_task?id=' + that.id,
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
              // 通过receiverId获取到姓名
              that.findNameById()

              if(res.data.data.state == 2){
                console.log('可修改')
                that.setData({
                  title: res.data.data.title,
                  begin_time: res.data.data.beginTime,
                  end_time: res.data.data.endTime,
                  receiver: that.data.receiver,      //  接收者的姓名
                  article: res.data.data.article,
                  isDisabled:false
                })

              }
              else{
                console.log(res.data.data)
                console.log(res.data.data.title)
                console.log(res.data.data.beginTime)
                console.log(res.data.data.endTime)
                console.log(that.data.receiver)

                that.setData({
                  title: res.data.data.title,
                  begin_time: res.data.data.beginTime,
                  end_time: res.data.data.endTime,
                  receiver: that.data.receiver,      //  接收者的姓名
                  article: res.data.data.article,
                  plan:res.data.data.plan
                })

              }
              
              // 对开始时间进行处理--------只能对数组进行处理
              // if(res.data.data.begin_time !== null){
              // res.data.data.begin_time = res.data.data.begin_time.substring(0,4)
              // res.data.data.begin_time = res.data.data.begin_time.replace(/-/g, "/")
              // res.data.data.begin_time = res.data.data.begin_time.replace(/T/, " ")
              

              // }else{}

              // res.data.data.forEach((e) =>{
              //   if(e.begin_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //   }
              // })
                
              
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

    // 根据状态来进行判断进行什么样的操作
    getProcess() {
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      
      if(that.state == 1){
        
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/receive_task?id=' + that.id,
          method: 'POST',
          data: ({}),
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function (res) {
            if(res.data.code == 0){
              console.log('操作成功')

              // //plan显示
              // that.setData({
              //   isDisabled:false
              // })

              wx - wx.showToast({
                title:'任务领取成功',
                icon: 'success',
                mask: true,
                duration: 1000
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
      }else if(that.state == 2){
        console.log(that.data.plan)
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/done_task?id=' + that.id + '&plan=' + that.data.plan,
          method: 'POST',
          data: ({}),
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function (res) {
            
            if(res.data.code == 0){
              console.log('操作成功')
              
              wx - wx.showToast({
                title:'完成任务',
                icon: 'success',
                mask: true,
                duration: 1000
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
      }else if(that.state == 3){
        wx - wx.showToast({
          title:'该任务已完成',
          icon: 'none',
          mask: true,
          duration: 1000
        })
        // 延时调用返回上个页面函数
        setTimeout(that.getbackPage,1000)
      }else if(that.state == 4){
        wx - wx.showToast({
          title:'该任务已逾期',
          icon: 'none',
          mask: true,
          duration: 1000
        })
        // 延时调用返回上个页面函数
        setTimeout(that.getbackPage,1000)
      }else {}

    },

    // 聚焦输入plan
    changePlan(e){
      console.log(e.detail.detail.value)
      this.setData({
        plan: e.detail.detail.value   // e.detail.article没有定义
      })
    },

    // plan失去焦点
    getPlan(){},

  }
})
