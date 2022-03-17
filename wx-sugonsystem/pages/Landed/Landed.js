//Landed.js
//获取应用实例
const app = getApp()

Page({
  data: {
    id: "",
    avatar: '',
    name: "",
    post: "",
    train_num: "",
    honor_num: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  // 获取用户信息
  onLoad: function () {
    // this.getTime()

    var self = this
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let id = cookie.substring(cookie.indexOf("o=")+2, cookie.indexOf("-"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    console.log(sessionid)
    console.log(id)
    console.log(phone)
    wx.setStorageSync("phone", phone)
    wx.setStorageSync("id", id)
    if(id){
    wx.request({
      // https://oa.hubusugon.cn/hss/get_train_game
      url: 'https://oa.hubusugon.cn/hss/get_train_game',
      method: 'POST',
      data: JSON.stringify({
        phone: phone
      }),
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == 0) {
          console.log("获取信息成功！")
          if(res.data.data.avatar == null || res.data.data.avatar == ''){
            self.setData({
              id: res.data.data.id,
              avater: 'http://qiniu.weibeicc.com/336ca640c9cc43d197393c5da27118fe.jpg',
              name: res.data.data.name,
              train_num: res.data.data.trainNum,
              honor_num: res.data.data.honorNum
            })
          } else {
            self.setData({
              id: res.data.data.id,
              avater: res.data.data.avatar,
              name: res.data.data.name,
              train_num: res.data.data.trainNum,
              honor_num: res.data.data.honorNum
            })
          }
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
    }),
      wx.request({
        // https://oa.hubusugon.cn/hss/temp_info
        url: 'https://oa.hubusugon.cn/hss/temp_info',
        method: 'POST',
        data: JSON.stringify({
          id: id
        }),
        header: {
          'content-type': 'application/json',
          'SessionId':phone
        },
        success: function (res) {
          console.log(res.data)
          self.setData({
            post: res.data.msg
          })
          if (res.data.code == 0) {
            console.log("获取信息成功！")
          }
          else {
            console.log("获取信息失败！")
          }
        }
      })}else{
        wx.showModal({
          title: '提示',
          content: '未登录，请先登录',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              // console.log('用户点击确定')
              wx.navigateTo({
                url: '../NotLanded/NotLanded'
              })
            } else if (res.cancel) {
              // console.log('用户点击取消')
              wx.navigateTo({
                url: '../NotLanded/NotLanded'
              })
            }
          }
        })
      }
  },



  //事件处理函数
  goToLanded: function () {
    wx.navigateTo({
      url: '../Landed/Landed'
    })
  },

  goTologs: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  goTocontest: function () {
    wx.navigateTo({
      url: '../contest/contest'
    })
  },

  goToWeek: function () {
    wx.navigateTo({
      url: '../week/week',
    })
  },

  gotoChange: function () {
    wx.showModal({
      title: '提示',
      content: '是否想要修改密码？',
      success(res) {
        if (res.confirm) {
          console.log('用户确定修改密码')
          wx.navigateTo({
            url: '../changePasswd/changePasswd'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  updateAvter: function () {
    const _this = this;
    let id = wx.getStorageSync('id') || []
    let personImage
    let filePath
    //定义sessionid
    let cookie = wx.getStorageSync('cookieKey')
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    wx.showModal({
      title: '提示',
      content: '是否想要修改头像？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // 选择图片
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var filePath = res.tempFilePaths[0]
              console.log(res.tempFilePaths[0]);
              // 上传服务器
              wx.uploadFile({
                // https://oa.hubusugon.cn/hss/image
                url: 'https://oa.hubusugon.cn/hss/image', //图片上传至开发服务器接口
                filePath: res.tempFilePaths[0],
                name: 'file',
                formData: { file: filePath }, // HTTP 请求中其他额外的 form data
                success: function (res) {
                  const data = res.data;
                  console.log(JSON.parse(data));
                  console.log("上传图片");
                  _this.setData({
                    avatar: JSON.parse(data).data.url  //得到服务器中图片的位置
                  })
                  console.log("修改头像")
                  // 修改头像
                  wx.request({
                    // https://oa.hubusugon.cn/hss/update_avatar
                    url: 'https://oa.hubusugon.cn/hss/update_avatar', //修改当前用户接口
                    method: 'POST',
                    data: JSON.stringify({
                      id: id,
                      avatar: _this.data.avatar
                    }),
                    header: {
                      'content-type': 'application/json',
                      'SessionId':phone
                    },
                    success: function (res) {
                      console.log("头像：", res.data.data.avatar)
                      _this.setData({
                        avatar: res.data.data.avatar
                      })
                      _this.onLoad()
                      if (res.data.code == 0) {
                        console.log("获取信息成功！")
                      }
                      //添加返回信息
                      else if(res.data.code == 400){
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
                      }
                    }
                  })
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 获取当前时间
  // getTime: function () {

  //   // var nowTime = Date.parse(new Date());

  //   var date = new Date();
  //   //年  
  //   var Y = date.getFullYear();
  //   //月  
  //   var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  //   //日  
  //   var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  //   //时  
  //   var h = date.getHours();
  //   //分  
  //   var m = date.getMinutes();
  //   //秒  
  //   var s = date.getSeconds();

  //   // 获取星期几
  //   var day = date.getDay();
  //   let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');

  //   // 今天日期 2020-05-07 15
  //   var todayTime = Y + '-' + M + '-' + D + ' ' + h;


  //   // 判断是不是周六12点之后
  //   if (show_day[day] == "周六") {

  //     let hours = parseInt(h);

  //     if (hours >= 12) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '记得写好周报哟',
  //         showCancel: false,
  //         success(res) {
  //           if (res.confirm) {
  //             // console.log('用户点击确定')
  //           } else if (res.cancel) {
  //             // console.log('用户点击取消')
  //           }
  //         }
  //       });
  //     };

  //   };

  //   if (show_day[day] == '周日') {
  //     wx.showModal({
  //       title: '提示',
  //       content: '记得写好周报哟',
  //       showCancel: false,
  //       success(res) {
  //         if (res.confirm) {
  //           // console.log('用户点击确定')
  //         } else if (res.cancel) {
  //           // console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   };

  // },



})