let utils = require('../../utils/utils')

Page({
  onShareAppMessage() {
    return {
      title: 'tabs',
      path: 'page/weui/example/tabs/tabs'
    }
  },
  data: {
    tabs: [{
        title: '待取件',
        status: 'PENDING',

      },
      {
        title: '上门中',
        status: 'COMING',

      },
      {
        title: '已完成',
        status: 'DONE',
      },
    ],
    activeTab: 0,
    orderList: [],
    pageData: {
      page: 0,
      size: 20
    },
    onBottom: false,
  },

  onLoad() {

    this.getOrderInfo();

  },
  getOrderInfo(status = "PENDING") {
    const pageData = this.data.pageData
    console.log(status, pageData)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'orderInfo',
      data: {
        method: 'GET',
        param: {
          orderStatus: status,
          ...pageData
        },
      },
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      const arr = this.data.orderList.concat(
        res.result.data
      ).map(item => {
        item.create = utils.formatDate(new Date(item.create), "yyyy-MM-dd hh:mm")
        return item
      })

      this.setData({
        orderList: arr,
        onBottom: res.result.data.length === 0 || false
      })
    })
  },

  // onTabClick(e) {
  //   const index = e.detail.index
  //   // this.getOrderInfo(this.data.tabs[index].status)
  //   this.setData({
  //     activeTab: index
  //   })

  // },

  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index,
      orderList: [],
      onBottom: false,
      pageData: {
        page: 0,
        size: 20
      },
    })
    this.getOrderInfo(this.data.tabs[index].status)
  },
  handleClick(e) {
    // wx.navigateTo({
    //   url: './webview',
    // })
  },
  handleLower() {
    const pageData = this.data.pageData;
    pageData.page++
    console.log(pageData)
    this.setData({
      pageData
    })
    if (!this.data.onBottom) {
      this.getOrderInfo(this.data.tabs[this.data.activeTab].status)
    }
  },
  handleClickButton() {
    wx.navigateTo({
      url: '/pages/detail/index',
    })
  }
})