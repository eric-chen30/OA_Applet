// pages/someoneflow/someoneflow.js
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
    // 存储路由传递过来的姓名
    name: '',

    // 返回的列表数据
    detailData: []

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取路由传过来的姓名name，并发送请求，获取人员的流程状态
    onLoad: function(options) {
      var that = this
      // 将传过来的参数赋给变量
      var name = options.name
      // that.name = options.name-------这样无法使js中的那么显示在wxml中
      // 将变量赋给data中的name
      that.setData({
        name: name
      })
      console.log(that.name, typeof that.name)
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      if (that.name !== ''){
        wx.request({
          url: 'https://oa.hubusugon.cn/hss/weekly/watch_oned_task?standby=' + that.data.name,
          //  在这种格式里，如果没有使用setData,则参数可以写为that.name,但是如果使用setData，参数就要写为that.data.name,否则就是undefined
          data: ({}),
          method: 'POST',
          header: {
            'content-type': 'application/json',
            'SessionId':phone
          },
          success: function(res) {
            if(res.data.code == 0){
              console.log('获取信息成功')
              console.log(res)
              if(res.data.data == ''){
                // 提示用户没有数据
                wx - wx.showToast({
                  title:'暂时没有流程',
                  icon: 'none',
                  mask: true,
                  duration: 1000
                })
              }

              // 将状态的数字转换成文字
              res.data.data.forEach((e) =>{
                if(e.state == 1){
                  e.state = '未领取'
                }else if(e.state == 2){
                  e.state = '待办'
                }else if(e.state == 3){
                  e.state = '已完成'
                }else if(e.state == 4){
                  e.state = '逾期'
                }
              })

              that.setData({
                detailData: res.data.data
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

          }
        })

      }

    }


  }
})


