// pages/detail/index.js
import moment from 'moment';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemList: [{
        name: '四季衣物',
        icon: '/img/new/yiwu.png'
      },
      {
        name: '各种鞋子',
        icon: '/img/new/xiezi.png'
      }, {
        name: '二手包包',
        icon: '/img/new/baobao.png'
      }, {
        name: '毛绒玩具',
        icon: '/img/new/wanjuxiong.png'
      }, {
        name: '床单被罩',
        icon: '/img/new/beizi.png'
      }
    ],
    addressData: {},
    address: '',
    itemIndex: 0,
    items: [{
        name: '10',
        value: '5-10kg'
      },
      {
        name: '20',
        value: '10-20kg',
      },
      {
        name: '30',
        value: '20-30kg'
      },
      {
        name: '40',
        value: '30kg以上'
      },
    ],
    itemsTimeIndex: 0,
    itemsTimeInner: 0,
    itemsTime: [
      [],
      ['8:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    ],
    rules: [{
      name: 'address',
      rules: {
        required: true,
        message: '地址信息必填'
      },
      // name: 'time',
      // rules: {
      //   required: true,
      //   message: '上门时间必填'
      // },
      // name: 'weight',
      // rules: {
      //   required: true,
      //   message: '预估重量必填'
      // },
    }],
    formData: {

    },
    userInfo: {},
    // [{
    //     name: '10',
    //     value: '5-10kg'
    //   },
    //   {
    //     name: '20',
    //     value: '10-20kg',
    //   },
    //   {
    //     name: '30',
    //     value: '20-30kg'
    //   },
    //   {
    //     name: '40',
    //     value: '30kg以上'
    //   },
    // ],
    roleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = this.data.itemsTime
    for (let index = 0; index < 6; index++) {
      // this.setData({
      arr[0].push(moment().add(index, 'days').format('MM-DD'))
      // })
    }
    const data = this.data.items
    this.setData({
      itemsTime: arr,
      ['formData.time']: `${arr[0][0]}-${arr[1][1]}`,
      ['formData.weight']: data[0].value,
      userInfo: wx.getStorageSync('UserInfo'),
    })

    // wx.cloud.callFunction({
    //   name: 'roleInfo',
    //   data: {
    //     method: 'GET',
    //   },
    // }).then((res) => {
    //   this.setData({
    //     roleList: res.result.data
    //   })
    // })

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
  chooseAddress: function () {
    if (this.data.userInfo.openid) {

      wx.chooseAddress({
        success: (res) => {
          console.log(res)
          if (res.errMsg.indexOf('ok') !== -1) {
            delete res.errMsg
            console.log(Object.values(res).join('-'))
            this.setData({
              address: `${res.userName}${res.telNumber}、${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}。`,
              addressData: {
                ...res
              },
              ['formData.address']: `${res.userName}${res.telNumber}、${res.provinceName}${res.cityName}${res.countyName}${res.detailInfo}。`,
            })
          }
        },
        fail: (err) => {
          wx.showToast({
            title: '请选取地址',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showModal({
        title: '请先到我的里面点击授权哦～ ',
        showCancel: false,
        success: (res) => {
          wx.switchTab({
            url: '/pages/user/index',
          })
        }
      })
    }
  },
  bindWeightChange: function (e) {
    const data = this.data.items

    this.setData({
      itemIndex: e.detail.value,
      ['formData.weight']: data[e.detail.value].value,
    })
  },
  bindTimeChange: function (e) {

    const data = this.data.itemsTime
    this.setData({
      itemsTimeIndex: e.detail.value[0],
      itemsTimeInner: e.detail.value[1],
      ['formData.time']: `${data[0][e.detail.value[0]]}-${data[1][e.detail.value[1]]}`,
    })
  },
  callPushApi(id) {
    wx.cloud.callFunction({
        name: 'pushMsg',
        data: {
          openid: id,
          thing10: this.data.addressData.userName,
          thing4: `上门时间${this.data.formData.time.slice(0,5)}、预估重量${this.data.formData.weight}`,
        },
      })
      .then(res => {
        console.log(res)
      })
  },
  callOrderApi(param) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
        name: 'orderInfo',
        data: {
          method: 'POST',
          param: {
            ...param,
            openid: this.data.userInfo.openid,
            orderStatus: "PENDING"
          }
        },
      })
      .then(res => {
        wx.hideLoading()
        wx.showModal({
          title: '预约成功请耐心等待～  ',
          showCancel: false,
          success: (res) => {
            wx.navigateBack({
              delta: 0,
            })
          }
        })
      })
  },
  sendMsg(param) {
    wx.requestSubscribeMessage({
      tmplIds: ['W5ZVx4ZJTcnEp_jLmxSDmaSoE1FeZdYYTYGKnF7JwzQ'],
      success: () => {
        this.callPushApi(this.data.userInfo.openid)
        // this.data.roleList.map(item => {
        //   this.callPushApi(item.openid)
        // })
        this.callOrderApi(param)
      },
      fail: () => {
        this.callOrderApi(param)
      }
    })
  },
  submitForm() {

    if (this.data.userInfo.openid) {
      console.log('valid', this.selectComponent('#form'))
      this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
          const firstError = Object.keys(errors)
          if (firstError.length) {
            this.setData({
              error: errors[firstError[0]].message
            })
          }
        } else {
          const param = this.data.formData
          this.sendMsg(param)
        }
      })
    } else {
      wx.showModal({
        title: '请先到我的里面点击授权哦～ ',
        showCancel: false,
        success: (res) => {
          wx.switchTab({
            url: '/pages/user/index',
          })
        }
      })
    }
  }
})