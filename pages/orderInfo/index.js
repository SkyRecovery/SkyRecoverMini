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
      perNum: 10, // 每页多少条纪录数量
      totalCount: 0, // 总共的纪录条数
      maxPage: 0, // 最大页码
      page: 1, // 客户端请求的当前页码
    }
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
          orderStatus: status
        },
        pageData
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
  onPullDownRefresh() {
    console.log(2222)
  },
  //   handleLower() {
  //     const pageData = this.data.pageData;
  //     const status = this.data.status;

  //     pageData.page++
  //     console.log(pageData)
  //     this.setData({
  //       pageData
  //     })
  //     this.getOrderInfo(status)
  //   }
  handleClickButton() {
    wx.navigateTo({
      url: '/pages/detail/index',
    })
  }
})