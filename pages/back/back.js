let interstitialAd = null
let utils = require('../../utils/utils')
Page({
  data: {
    projectAddress: 'https://github.com/myvin/quietweather',
    github: 'https://github.com/myvin',
    email: '851399101@qq.com',
    qq: '851399101',
    // swiperHeight: 'auto',
    bannerImgList: [
      1, 2, 3
    ],
    itemList: [{
        name: '旧衣回收',
        icon: '/img/new/yifu.png'
      },
      {
        name: '手机回收',
        icon: '/img/new/shouji.png'
      }, {
        name: '书籍回收',
        icon: '/img/new/books.png'
      }
    ],
    stepList: [{
        name: '在线预约',
        icon: '/img/new/yuyue.png'
      },
      {
        name: '免费上门',
        icon: '/img/new/shangmen.png'
      }, {
        name: '当场结算',
        icon: '/img/new/jiesuan.png'
      }
    ],
  },
  onLoad() {
    this.initSwiper()
    // 在页面中定义插屏广告

    // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-9b9f29035375b260'
    //   })
    //   interstitialAd.onLoad(() => {})
    //   interstitialAd.onError((err) => {})
    //   interstitialAd.onClose(() => {})
    // }

    // // 在适合的场景显示插屏广告
    // if (interstitialAd) {
    //   interstitialAd.show().catch((err) => {
    //     console.error(err)
    //   })
    // }
  },
  previewImages(e) {
    let index = e.currentTarget.dataset.index || 0
    let urls = this.data.bannerImgList
    let arr = []
    let imgs = urls.forEach(item => {
      arr.push(item.src)
    })
    wx.previewImage({
      current: arr[index],
      urls: arr,
      success: function(res) {},
      fail: function(res) {
        console.error('previewImage fail: ', res)
      }
    })
  },
  initSwiper() {
    let systeminfo = getApp().globalData.systeminfo
    if (utils.isEmptyObject(systeminfo)) {
      wx.getSystemInfo({
        success: (res) => {
          this.setSwiperHeight(res)
        },
      })
    } else {
      this.setSwiperHeight(systeminfo)
    }
  },
  setSwiperHeight(res) {
    this.setData({
      swiperHeight: `${(res.windowWidth || res.screenWidth) / 375 * 200}px`
    })
  },
  copy(e) {
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title || ''
    let content = dataset.content || ''
    wx.setClipboardData({
      data: content,
      success() {
        wx.showToast({
          title: `已复制${title}`,
          duration: 2000,
        })
      },
    })
  },
  handleDetail() {
    wx.navigateTo({
      url: '/pages/detail/index',
    })
  }
})