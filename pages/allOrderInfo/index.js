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
    pageParam: {
      page: 0,
      size: 20
    },
    onBottom: false,

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
          orderStatus: status,
          ...this.data.pageParam
        }
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
      pageParam: {
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

  },
  handleLower() {
    const pageParam = this.data.pageParam;
    pageParam.page++
    console.log(pageParam)
    this.setData({
      pageParam
    })
    this.getOrderInfo(this.data.tabs[this.data.activeTab].status)
  },
})