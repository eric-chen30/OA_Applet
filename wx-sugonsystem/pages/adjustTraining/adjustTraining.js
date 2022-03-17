
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 培训数据
    trainData:{
      name:"hbt",
      mine: {id:""},
      time:"2020/09/21 09:00:00",
      inform:"通知",
      location:"实训大楼418",
      describe:"ks8",
      img:'http://qiniu.weibeicc.com/e54e07513e6b43509be8e86a68c61155.jpg',
      id: '',
    },
    //培训日期
    date:'',
    //培训时间
    time:'',
    //详情id
    detailId: '',
    //我的id
    id:'',
  },

  onLoad: function (options) {

    this.setData({
      detailId: options.detailId
    })

    //设置页面高度
    // this.setData({
    //   pageHeight: wx.getSystemInfoSync().windowHeight + 'px',
    //   pageUpp: wx.getSystemInfoSync().windowHeight * 0.22 + 'px',
    //   pageCon: wx.getSystemInfoSync().windowHeight * 0.28 + 'px',
    //   pageBot: wx.getSystemInfoSync().windowHeight * 0.50+ 'px',
    // })

    //保存详情id
    // this.setData({
    //   detailId: wx.getStorageSync('detailId')
    // });

    // 获取详情数据
    this.getDetailData()

      },


  //获取详情数据
  getDetailData(){
    // cookie获取id
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let id = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf("-"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.indexOf(";"))
    let sessionid = wx.getStorageSync('sessionid') || []
    console.log(cookie)
    console.log(phone)
    wx.setStorageSync("phone", phone)
    wx.setStorageSync("id", id)
    var that = this
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/detail',
      data:JSON.stringify ({
        id: this.data.detailId
      }),
      method: 'get',
      header: {
        'content-type': 'application/json',
        'SessionId': phone
      },
      success: function(res) {

        if (res.data.data.length > 0){
          let data = res.data.data[0]

          data.time = data.time.substring(0,19)
          data.time = data.time.replace(/-/g, "/")
          data.time = data.time.replace(/T/, " ")

          that.setData({
 
            id: id,
            "trainData.mine.id": id,
            "trainData.name": data.name,
            "trainData.time": '',
            "trainData.inform": data.inform,
            "trainData.location": data.location,
            "trainData.describe": data.describe,
            "trainData.img": '',
          })
          console.log(that.data.trainData)
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
    }, 
    fail: function (res) { },
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
    let sessionid = wx.getStorageSync('sessionid') || []
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
        wx.uploadFile({
          url: 'https://oa.hubusugon.cn/hss/image',
          header: {
            'content-type': 'application/json',
            'SessionId': sessionid
          },
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success (res){
            
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
    let that = this
    let time = this.data.date + 'T'+ this.data.time +':00.000+0000'
    let phone = wx.getStorageSync('phone') || []
    this.setData({
      "trainData.time": time,
      "trainData.id": that.data.detailId,
    })

    let params = this.data.trainData

    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/change_details_to_pass',
      method: 'POST',
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
