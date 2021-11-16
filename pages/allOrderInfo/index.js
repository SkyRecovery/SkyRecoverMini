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
    orderList: []
  },

  onLoad() {

    this.getOrderInfo();

  },
  getOrderInfo(status = "PENDING") {
    console.log(status)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'allOrderInfo',
      data: {
        method: 'GET',
        param: {
          orderStatus: status
        }
      },
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      const arr = res.result.data.map(item => {
        item.create = utils.formatDate(new Date(item.create), "yyyy-MM-dd hh:mm")
        return item
      })

      this.setData({
        orderList: arr
      })
    })
  },

  onTabClick(e) {
    const index = e.detail.index
    // this.getOrderInfo(this.data.tabs[index].status)
    this.setData({
      activeTab: index
    })

  },

  onChange(e) {
    const index = e.detail.index
    this.setData({
      activeTab: index,
      orderList: []
    })
    this.getOrderInfo(this.data.tabs[index].status)
  },
  handleClick(e) {
    // wx.navigateTo({
    //   url: './webview',
    // })
  },
  handleButton(e) {
    console.log(e)
    let status = e.currentTarget.dataset.orderStatus
    let orderId = e.currentTarget.dataset.id
    wx.cloud.callFunction({
      name: 'allOrderInfo',
      data: {
        method: 'POST',
        param: {
          _id: orderId,
          orderStatus: status === 'PENDING' ? 'COMING' : 'DONE'
        }
      },
    }).then(res => {
      console.log(res)
      this.getOrderInfo(this.data.tabs[this.data.activeTab].status)
    })

  }
})