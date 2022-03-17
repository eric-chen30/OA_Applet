// pages/process/process.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 上面高度
     uppHeight: '',
     //头部上
     uppHeightTop: '',
     //头部下
     uppHeightBot: '',
     // 内容高度
     conHeight: '', 

    // 输入框输入内容
    inputContent: '',

    // 用户id
    uid: '' ,

    // 用户姓名
    name: '',

    //详情id
    // detailId: '',

    // 下拉菜单 1
    selectDatas: ['全部', '人员','流程'],
    shows1: false,
    Findexs: 0,
    status: '我的',
    // firstSelect_text: '全部',

    // 下拉菜单2
    statusDatas: [ '我的','发布', '领取', '待办', '完成', '逾期' ],
    shows2: false,
    Lindexs: 0,
    // secondSelect_text: '我的',

    // 存储我的数据的列表
    dataList: [],

    // 存储人员数据的列表
    peopleList: [],

    // 存储流程数据的列表
    processList: []
  },

  // 获取用户id
  getUserId() {
    let id = wx.getStorageSync('id') || []
    console.log(id)
    this.setData({
      uid: id,
    })
    console.log(this.data.uid)
  },

  // 获取主页面的数据
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

  // 根据id获取用户的姓名
  getUserNameById() {
    console.log('触发函数')
    let cookie = wx.getStorageSync('cookieKey')
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let that = this
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/weekly/findNameById?uid=' + that.data.uid,
      method: 'POST',
      data: ({}),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        console.log(res)
        if(res.data.code == 0){
          that.setData({
            name: res.data.data
          })
          console.log(that.data.name)
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
        }
        else {
          console.log("获取信息失败！")
          console.log(res)
          wx - wx.showToast({
            title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/get_train_game",
            icon: 'none',
            mask: true,
            duration: 5000
          })
        }
      }

    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uppHeight: (wx.getSystemInfoSync().windowHeight * 0.21) + 'px',
      uppHeightTop: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.52) + 'px',
      uppHeightBot: (wx.getSystemInfoSync().windowHeight * 0.21 * 0.36) + 'px',
      conBlack: (wx.getSystemInfoSync().windowHeight * 0.02) + 'px',
      conHeight: (wx.getSystemInfoSync().windowHeight * 0.77) + 'px',
    })

    // 获取用户id
    this.getUserId()

    // 获取到用户的姓名
    this.getUserNameById()

    // 加载初始页面数据
    this.getdataList()
  },

  // 选择状态-----下拉菜单1
  FselectTaps() {
    this.setData({
      shows1: !this.data.shows1,
    });

  },

  // 选择状态-----下拉菜单2
  LselectTaps() {
    if(this.data.selectDatas[this.data.Findexs] == '全部'){
      this.setData({
      shows2: !this.data.shows2,
      });
    }else{
      this.setData({
        shows2: false,
        });
      wx - wx.showToast({
        title:'请切换到全部状态',
        icon: 'none',
        mask: true,
        duration: 1000
      })
    }
    },


  //  选择选项1---并将其渲染到选择框上
  FoptionTaps(e) {
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    let FIndexs = e.target.dataset.index;
    // 点击获取索引，并隐藏下拉菜单
    this.setData({
      Findexs: FIndexs,
      shows1: !this.data.shows1,
    });
    console.log(e,FIndexs)

    // 发送请求
    if(this.data.selectDatas[this.data.Findexs] == '人员'){
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/getallpeople',
        data:({}),
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success:function(res){
          if(res.data.code == 0){
            console.log('请求成功')
            if(res.data.data.length == ''){
              // 提醒暂无数据
              wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000    //持续的时间
              })
            }else{
              // 返回列表数据
              that.setData({
                peopleList: res.data.data,
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
            wx - wx.showToast({
              title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/weekly/getallpeople",
              icon: 'none',
              mask: true,
              duration: 5000
            })
          }
        }
      })

    }else if(this.data.selectDatas[this.data.Findexs] == '流程'){
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/watch_all_task',
        data:({}),
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success:function(res){
          if(res.data.code == 0){
            console.log('请求成功')
            console.log(res)
            if(res.data.data.length == ''){
              // 提醒暂无数据
              wx.showToast({
                title: '暂无数据',
                icon: 'none',
                duration: 2000    //持续的时间
              })
            }else{
              // 对数据详情做处理
              for(let i = 0; i < res.data.data.length; i++){
                // 对于内容为空的无法进行切分
              if(res.data.data[i].article !== null){
                let article_ = res.data.data[i].article.slice(0, 7)
                res.data.data[i].article = article_+'...'
                }else{}               
              }

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

              // 返回列表数据
              that.setData({
                processList: res.data.data,
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
            wx - wx.showToast({
              title: "_(:з」∠)_服务器炸了，凶手是：oa.hubusugon.cn/hss/weekly/watch_all_task",
              icon: 'none',
              mask: true,
              duration: 5000
            })
          }
        }
      })
    }else if(this.data.selectDatas[this.data.Findexs] == '全部'){
      this.getdataList()
    }else{}

  },

  //  选择选项2---并将其渲染到选择框上
  LoptionTaps(e) {
    console.log(e)
    let LIndexs = e.target.dataset.index;
    console.log(LIndexs)
    // let params = {
    //   secondSelect_text: '',
    // };
    // params.secondSelect_text = this.data.selectDatas[LIndexs]
    // console.log(params.secondSelect_text)
    
    this.setData({
      Lindexs: LIndexs,
      // secondSelect_text: params.secondSelect_text,
      shows2: !this.data.shows2,
    });

    // 根据状态查看自己的流程  --------    需要获取的参数uid  和  通过uid获取的姓名
    let index = e.target.dataset.index;
    let item = e.target.dataset.item;
    console.log(index,item)
    // 点击全部状态
    if(e.target.dataset.item == '我的'){
      // 获取我的全部数据
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      console.log('我的全部数据')
      console.log(that.data.selectDatas[that.data.Findexs])
      console.log(that.data.statusDatas[that.data.Lindexs])
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/watch_oned_task?standby=' + that.data.name,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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
      
    }else if(e.target.dataset.item == '发布'){
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/getmyrequests?uid=' + that.data.uid,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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

    }else if(e.target.dataset.item == '领取'){
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/what_will_do?uid=' + that.data.uid,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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
      
    }else if(e.target.dataset.item == '待办'){
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/what_to_do?uid=' + that.data.uid,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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

    }else if(e.target.dataset.item == '完成'){
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/whats_have_done?uid=' + that.data.uid,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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

    }else if(e.target.dataset.item == '逾期'){
      let cookie = wx.getStorageSync('cookieKey')
      let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
      let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
      let that = this
      wx.request({
        url: 'https://oa.hubusugon.cn/hss/weekly/what_not_done?uid=' + that.data.uid,
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

              // 对时间进行处理
              // res.data.data.forEach((e) =>{
              //   if(e.begin_time == null && e.end_time !== null){
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time !== null && e.end_time !== null){
              //     e.begin_time = e.begin_time.substring(0,19)
              //     e.begin_time = e.begin_time.replace(/-/g, "/")
              //     e.begin_time = e.begin_time.replace(/T/, " ")
              //     e.end_time = e.end_time.substring(0,19)
              //     e.end_time = e.end_time.replace(/-/g, "/")
              //     e.end_time = e.end_time.replace(/T/, " ")
              //   }else if(e.begin_time == null && e.end_time == null){}
              //   else{
                  
              //   }
              // })

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

    }else{

    }

  },

  // 输入框输入聚焦
  bindKeyInput(e) {
    this.setData({
      inputContent: e.detail.value
    })
  },

  // 输入框失去焦点
  bindKeyBlur(e){},

  // 跳转到添加详情页面
  goToAddProcess: function () {
    wx.navigateTo({
      url: '../addProcess/addProcess'
    })
  },

  // 跳转到xx人员的所有流程-------------------需要把姓名通过路由传到someoneflow页面
  getUserName(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    console.log(name, typeof name)
    // 路由跳转并传参
    wx.navigateTo({
      url: '../someoneflow/someoneflow?name=' + name
    })
  },

  // 跳转到xx流程人员的完成情况-------------------需要把流程id通过路由传到someflow页面
  goToprocessDetail(e) {
    console.log(e)
    var cid = e.currentTarget.dataset.cid
    var state = e.currentTarget.dataset.status
    var receiverId = e.currentTarget.dataset.receiver
    console.log(cid,typeof cid, state, typeof state, receiverId, typeof receiverId)
    // 路由跳转并传参  传过去的参数为cid
    wx.navigateTo({
      url: '../someflow/someflow?cid=' + cid + '&state=' + state +'&receiverId=' + receiverId
    })
  },

  // 获取详情id
  getDetailId(e) {
    console.log(e)
    var id = e.currentTarget.dataset.detailid
    var state = e.currentTarget.dataset.status
    var receiverId = e.currentTarget.dataset.receiverid
    //  类型为number
    console.log(id, state, typeof id, typeof state)
    console.log(receiverId, typeof receiverId)
    wx.navigateTo({
      url: '../processDetail/processDetail?id=' + id + '&state=' + state + '&receiverId=' + receiverId 
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})