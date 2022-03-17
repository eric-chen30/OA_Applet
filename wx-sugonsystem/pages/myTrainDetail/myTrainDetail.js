// pages/faqi/faqi.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //页面高度
    pageHeight: '',
    //页面上
    pageUpp: '',
    //页面中
    pageCon: '',
    //页面下
    pageBot: '',
    //页面数据
    detailData:
      {
        describe: '',
        id: '',
        img: '',
        inform: '',
        location: '',
        mine: {
          abilityText: null,
          avatar: null,
          honorNum: 0,
          id: '',
          name: 'hbt',
          phone: null,
          post: null,
          titleRule: null,
          trainNum:0
        },
        name: '',
        simple_status: '',
        status: '',
        time: ""
      }
    ,

    id: "",

   //详情id
   detailId:'',
  },
  onLoad: function (options) {

    //设置页面高度
    this.setData({
      pageHeight: wx.getSystemInfoSync().windowHeight + 'px',
      pageUpp: wx.getSystemInfoSync().windowHeight * 0.22 + 'px',
      pageCon: wx.getSystemInfoSync().windowHeight * 0.28 + 'px',
      pageBot: wx.getSystemInfoSync().windowHeight * 0.50+ 'px',
    })

    //保存详情id
    this.setData({
      detailId: wx.getStorageSync('detailId')
    });

    // 获取详情数据
    this.getDetailData()

      },


  //获取详情数据
  getDetailData(){
    var that = this
    //
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    console.log(sessionid)
    //
    wx.request({
      url: 'https://oa.hubusugon.cn/hss/training/detail',
      data: ({
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
            detailData: data,
            id: data.mine.id,
          })
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

  //编辑培训详情
  editSubmit(){
    let detailId = this.data.detailId
    wx.navigateTo({
      url: '../adjustTraining/adjustTraining?detailId=' + detailId
    })
  },

  //inform输入
  inputInform(e){
    this.setData({
      "detailData.inform": e.detail.value
    })
  },

  //发布实时通知
  sendTimeInform(){

    let that = this
    //
    let cookie = wx.getStorageSync('cookieKey')
    console.log(cookie)
    let sessionid = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";"))
    let phone = cookie.substring(cookie.indexOf("-") + 1, cookie.lastIndexOf(";"))
    console.log(sessionid)
    //

    wx.showModal({
      title: '提示',
      content: '即将发布实时通知',
      success (res) {
        if (res.confirm) {
            wx.request({
              url: 'https://oa.hubusugon.cn/hss/training/change_inform',
              data: ({
                mine: {
                  id: that.data.id
                },
                id: that.data.detailId,
                inform: that.data.inform,
              }),
              method: 'POST',
              header: {
                'content-type': 'application/json',
                'SessionId': phone
              },
              success: function(res) {
        
                if(res.data.msg == '操作成功'){
                  wx.showToast({
                    title: '操作成功',
                    icon: 'none',
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

                else if(res.data.msg == '对不起，你不是培训的所有者，无权修改实时通知。'){
                  wx.showToast({
                    title: '对不起，你不是培训的所有者，无权修改实时通知。',
                    icon: 'none',
                    duration: 2000
                  })
                }

                else if(res.data.msg == '培训不处于报备状态，不能进行修改'){
                  wx.showToast({
                    title: '培训不处于报备状态，不能进行修改',
                    icon: 'none',
                    duration: 2000
                  })
                }

                else if(res.data.msg == '发生错误'){
                  wx.showToast({
                    title: '发生错误',
                    icon: 'none',
                    duration: 2000
                  })
                }
            }, 
            fail: function (res) { },
            complete: function (res) { },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });

  },
})