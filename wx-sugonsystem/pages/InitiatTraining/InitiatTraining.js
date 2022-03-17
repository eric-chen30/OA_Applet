// pages/faqi/faqi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 培训数据
    trainData:{
      name:"",
      mine: {id:""},
      time:"",
      inform:"",
      location:"",
      describe:"",
      img:'',
    },
    //培训日期
    date:'',
    //培训时间
    time:'',
  },
     /**
   * 提交事件
   */
  setSubmit: function (e) {
    var data = this.data
    // console.log(data);
    // 不合法输入
    if (!data.name || !data.location || !data.team_name || !data.time || !data.describe){
      wx-wx.showToast({
        title: '请输入完整信息后提交',
        icon: 'none',
        mask: true,
      })
      return;
    }
    console.log("输入成功");
    //
    
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    console.log(sessionid)
    //
    wx - wx.request({
      url: 'https://oa.hubusugon.cn/domain/hss/training/save', //api接口的路径
      method: 'POST',
      data: JSON.stringify({
        id: "",
        name:"",
        mine:
        {id:""},
        time:"",
        inform:"",
        location:"",
        describe:"",
        img:''
      }),
      //
      header: { 'content-type': 'application/json', 'SessionId': sessionid },
      //
      success: function (res) {
        console.log("提交成功")
        wx.navigateTo({
          url: '../logs/logs'
        })
        //
        if(res.code == 400){
          wx.showModal({
            title:'注意',
            content:res.msg,
            success:function(res){
              if(res.confirm){
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '../Notlanded/Notlanded',
                  
                });
              }else if(res.cancel){
                console.log('用户点击取消')
                wx.redirectTo({
                  url: '../Notlanded/Notlanded',
                  
                });
              }
            }
          })
        }
        //
      },
      fail: function (res) {
        console.log("提交失败")
      },
      complete: function (res) { },
    })
  }, 
  //培训主题
  inputUpdatename: function (e) {
    this.setData({
      "trainData.name": e.detail.value
    });
  },

//培训日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },

  //培训时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    });
  },

  //培训地点
  inputUpdatelocation: function (e) {
    this.setData({
      "trainData.location": e.detail.value
    })
  },

  //培训通知
  inputUpdateinform: function (e) {
    this.setData({
      "trainData.inform": e.detail.value
    })
  },

  //培训描述
  inputUpdatedescribe: function (e) {
    this.setData({
      "trainData.describe": e.detail.value
    })
  },


  // 点击加号上传图片
  gotoShow: function () {
    var _this = this
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // success
        // console.log(res)
        // _this.setData({
        //   "trainData.img": res.tempFiles[0].path
        // })
        // console.log(_this.data.trainData.img)
        const tempFilePaths = res.tempFilePaths

        //
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    console.log(sessionid)
    //
        
        wx.uploadFile({
          url: 'https://oa.hubusugon.cn/hss/image',
          filePath: tempFilePaths[0],
          name: 'file',
          //
          formData:JSON.stringify( {
            'user': 'test'
          }),
          //
          header: {
            'content-type': 'application/json',
            'SessionId': phone
          },
          success (res){
            //
            if(res.code == 400){
              wx.showModal({
                title:'注意',
                content:res.msg,
                success:function(res){
                  if(res.confirm){
                    console.log('用户点击确定')
                    wx.redirectTo({
                      url: '../Notlanded/Notlanded',
                      
                    });
                  }else if(res.cancel){
                    console.log('用户点击取消')
                    wx.redirectTo({
                      url: '../Notlanded/Notlanded',
                      
                    });
                  }
                }
              })
            }
            //
            
            // console.log(JSON.parse(res.data))
            let url = JSON.parse(res.data).data.url
            _this.setData({
              "trainData.img": url
            })
          },
          fail: function () {
            // fail
          },
        complete: function () {
          // complete
        }
      })
    }
  })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var imgList = [this.data.trainData.img]
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imgList // 需要预览的图片http链接列表  
    })
  },
  //提交按钮
  setSubmit(){
    //
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    console.log(sessionid)
    //

    if (this.data.date == '' || this.data.time == '' || this.data.trainData.name == '' || this.data.trainData.inform == '' || this.data.trainData.location == '' || this.data.trainData.describe == '' || this.data.trainData.img == ''){
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
      return
    }
    let id =wx.getStorageSync('id');
    let time = this.data.date + 'T'+ this.data.time +':00.000+0000'
    this.setData({
      "trainData.time": time,
      "trainData.mine.id": id
    })

    let params = this.data.trainData
    console.log(params)

    

    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/save',
      method: 'POST',
      //
      data:JSON.stringify(params) ,
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function (res) {
  
        if (res.data.msg == '操作成功') {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 2000
          })
          wx.redirectTo({
            url: '../Mylists/Mylists',
          });
        }else if(res.code == 400){
          wx.showModal({
            title:'注意',
            content:res.msg,
            success:function(res){
              if(res.confirm){
                console.log('用户点击确定')
                wx.redirectTo({
                  url: '../Notlanded/Notlanded',
                  
                });
              }else if(res.cancel){
                console.log('用户点击取消')
                wx.redirectTo({
                  url: '../Notlanded/Notlanded',
                  
                });
              }
            }
          })
        }
        else {
          wx.showToast({
            title: '操作失败',
            icon: 'fail',
            duration: 1000
          })
        }
      }
    })
  },
})
