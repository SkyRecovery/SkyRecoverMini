// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin: true,
    userData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let loginData = wx.getStorageSync('UserInfo');
    console.log(loginData)
    loginData?.openid ? this.setData({
      islogin: false,
      userData: loginData
    }) : this.setData({
      islogin: true,
    });

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

  },
  handleUserInfo() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        if (res.errMsg === 'getUserProfile:ok') {
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
              name: 'userInfo',
              data: {
                method: 'POST',
                param: {
                  ...res,
                }

              },
            })
            .then(res => {
              wx.hideLoading()
              console.log(res)
              const data = {
                role: res.result.role,
                openid: res.result.openid,
                ...res.result.userInfo
              }
              this.setData({
                islogin: false,
                userData: data
              });
              wx.setStorageSync('UserInfo', data)
            })
        } else {
          this.setData({
            islogin: true
          });
        }
      }
    })
  },
  // handleUserInfo(e) {
  //   let msg = e.detail.errMsg;
  //   console.log(e.detail)
  //   if (msg === 'getUserInfo:ok') {
  //     wx.cloud.callFunction({
  //         name: 'userInfo',
  //         data: {
  //           method: 'POST',
  //           param: {
  //             ...e.detail,
  //           }

  //         },
  //       })
  //       .then(res => {
  //         console.log(res)
  //         const data = {
  //           role: res.result.role,
  //           openid: res.result.openid,
  //           ...res.result.userInfo
  //         }
  //         this.setData({
  //           islogin: false,
  //           userData: data
  //         });
  //         wx.setStorageSync('UserInfo', data)
  //       })
  //   } else {
  //     this.setData({
  //       islogin: true
  //     });
  //   }
  // },
  handleOrderInfo() {
    if (this.data.userData.openid) {
      wx.navigateTo({
        url: '/pages/orderInfo/index',
      })
    } else {
      wx.showModal({
        title: '请先点击授权哦～ ',
        showCancel: false,
        success: (res) => {

        }
      })
    }

  },
  handleAllOrderInfo() {
    wx.navigateTo({
      url: '/pages/allOrderInfo/index',
    })
  }
})