import { Block, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './heartbeat.scss'
let utils = require('../../utils/utils.js')

@withWeapp('Component')
class _C extends Taro.Component {
  static defaultProps = {
    show: true
  }
  state = {
    windowWidth: 0,
    windowHeight: 0,
    arr: [],
    // 动画最长持续时间
    duration: 5000,
    animations: [],
    lefts: [],
    tops: [],
    widths: []
  }
  _observeProps = []
  ready = () => {
    let systeminfo = Taro.getApp().globalData.systeminfo
    if (utils.isEmptyObject(systeminfo)) {
      Taro.getSystemInfo({
        success: res => {
          this.setData({
            windowWidth: res.windowWidth || res.screenWidth,
            windowHeight: res.windowHeight || res.screenHeight
          })
        }
      })
    } else {
      this.setData({
        windowWidth: systeminfo.windowWidth || systeminfo.screenWidth,
        windowHeight: systeminfo.windowHeight || systeminfo.screenHeight
      })
    }
    let num = parseInt(Math.random() * 100) + 10
    let arr = Array.apply(null, { length: num }).map(function(value, index) {
      return index + 1
    })
    this.setData({
      arr
    })
  }
  dance = callback => {
    let windowWidth = this.data.windowWidth
    let windowHeight = this.data.windowHeight
    let duration = this.data.duration
    let animations = []
    let lefts = []
    let tops = []
    let widths = []
    let obj = {}
    for (let i = 0; i < this.data.arr.length; i++) {
      lefts.push(Math.random() * windowWidth)
      tops.push(-140)
      widths.push(Math.random() * 50 + 40)
      let animation = Taro.createAnimation({
        duration: Math.random() * (duration - 1000) + 1000
      })
      animation
        .top(windowHeight)
        .left(Math.random() * windowWidth)
        .rotate(Math.random() * 960)
        .step()
      animations.push(animation.export())
    }
    this.setData({
      lefts,
      tops,
      widths
    })
    let timer = setTimeout(() => {
      this.setData({
        animations
      })
      clearTimeout(timer)
    }, 200)
    let end = setTimeout(() => {
      callback && callback()
      clearTimeout(end)
    }, duration)
  }
  config = {
    component: true
  }

  render() {
    const { show: show } = this.props
    const {
      arr: arr,
      animations: animations,
      lefts: lefts,
      tops: tops,
      widths: widths
    } = this.state
    return arr.map((item, index) => {
      return (
        <Image
          key={index+''}
          animation={animations[index]}
          className="heart"
          style={
            'left:' +
            lefts[index] +
            'px;top:' +
            tops[index] +
            'px;width:' +
            widths[index] +
            'rpx;height:' +
            widths[index] +
            'rpx;'
          }
          src={require('../../img/heartbeat.png')}
        />
      )
    })
  }
}

export default _C
