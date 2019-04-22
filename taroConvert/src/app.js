import { Block } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './app.scss'

class App extends Taro.Component {
  componentWillMount() {
    this.$app.globalData = this.globalData

    wx.cloud.init({
      env: 'dev-bbdba2',
      traceUser: true
    })
    Taro.getSystemInfo({
      success: res => {
        this.globalData.systeminfo = res
        this.globalData.isIPhoneX = /iphonex/gi.test(
          res.model.replace(/\s+/, '')
        )
      }
    })
  }

  globalData = {
    // 是否保持常亮，离开小程序失效
    keepscreenon: false,
    systeminfo: {},
    isIPhoneX: false,
    key: '993bbb5910a8440bbc7d433c622ecdd5',
    weatherIconUrl: 'https://cdn.heweather.com/cond_icon/',
    requestUrl: {
      weather: 'https://free-api.heweather.com/s6/weather',
      hourly: 'https://free-api.heweather.com/s6/weather/hourly'
    }
  }
  config = {
    pages: [
      'pages/index/index',
      'pages/about/about',
      'pages/citychoose/citychoose',
      'pages/setting/setting',
      'pages/systeminfo/systeminfo'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: 'black',
      navigationBarTitleText: 'Quiet Weather',
      navigationBarTextStyle: 'black'
    },
    permission: {
      'scope.userLocation': {
        desc: '定位以获取当前位置天气信息'
      }
    },
    cloud: true,
    sitemapLocation: 'sitemap.json'
  }

  render() {
    return null
  }
}

export default App
Taro.render(<App />, document.getElementById('app'))
