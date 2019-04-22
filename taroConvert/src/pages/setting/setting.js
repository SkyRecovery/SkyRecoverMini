import { Block, View, Switch, Image, Text, Slider } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './setting.scss'
let utils = require('../../utils/utils.js')

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    setting: {},
    show: false,
    screenBrightness: '获取中',
    keepscreenon: false,
    SDKVersion: '',
    enableUpdate: true,
    indexPage: {}
  }
  switchChange = e => {
    let dataset = e.currentTarget.dataset
    let switchparam = dataset.switchparam
    let setting = this.data.setting
    if (switchparam === 'forceUpdate') {
      if (this.data.enableUpdate) {
        setting[switchparam] = (e.detail || {}).value
      } else {
        setting[switchparam] = false
        Taro.showToast({
          title: '基础库版本较低，无法使用该功能',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (switchparam === 'keepscreenon') {
      this.setKeepScreenOn(!this.data.keepscreenon)
      Taro.getApp().globalData.keepscreenon = !this.data.keepscreenon
    } else {
      setting[switchparam] = !(e.detail || {}).value
    }
    this.setData({
      setting
    })
    Taro.setStorage({
      key: 'setting',
      data: setting,
      success: () => {
        this.data.indexPage.reloadInitSetting()
      }
    })
  }
  hide = () => {
    this.setData({
      show: false
    })
  }
  updateInstruc = () => {
    this.setData({
      show: true
    })
  }

  componentDidShow() {
    let pages = Taro.getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    // 不能初始化到 data 里面！！！！
    this.setData({
      keepscreenon: Taro.getApp().globalData.keepscreenon,
      indexPage
    })
    this.ifDisableUpdate()
    this.getScreenBrightness()
    Taro.getStorage({
      key: 'setting',
      success: res => {
        let setting = res.data
        this.setData({
          setting
        })
      },
      fail: res => {
        this.setData({
          setting: {}
        })
      }
    })
  }

  ifDisableUpdate = () => {
    let systeminfo = Taro.getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '1.9.90')
    if (version >= 0) {
      this.setData({
        SDKVersion,
        enableUpdate: true
      })
    } else {
      this.setData({
        SDKVersion,
        enableUpdate: false
      })
    }
  }
  getHCEState = () => {
    Taro.showLoading({
      title: '检测中...'
    })
    Taro.getHCEState({
      success: function(res) {
        Taro.hideLoading()
        Taro.showModal({
          title: '检测结果',
          content: '该设备支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#40a7e7'
        })
      },
      fail: function(res) {
        Taro.hideLoading()
        Taro.showModal({
          title: '检测结果',
          content: '该设备不支持NFC功能',
          showCancel: false,
          confirmText: '朕知道了',
          confirmColor: '#40a7e7'
        })
      }
    })
  }
  getScreenBrightness = () => {
    Taro.getScreenBrightness({
      success: res => {
        this.setData({
          screenBrightness: Number(res.value * 100).toFixed(0)
        })
      },
      fail: res => {
        this.setData({
          screenBrightness: '获取失败'
        })
      }
    })
  }
  screenBrightnessChanging = e => {
    this.setScreenBrightness(e.detail.value)
  }
  setScreenBrightness = val => {
    Taro.setScreenBrightness({
      value: val / 100,
      success: res => {
        this.setData({
          screenBrightness: val
        })
      }
    })
  }
  setKeepScreenOn = b => {
    Taro.setKeepScreenOn({
      keepScreenOn: b,
      success: () => {
        this.setData({
          keepscreenon: b
        })
      }
    })
  }
  getsysteminfo = () => {
    Taro.navigateTo({
      url: '/pages/systeminfo/systeminfo'
    })
  }
  removeStorage = e => {
    let that = this
    let datatype = e.currentTarget.dataset.type
    if (datatype === 'setting') {
      Taro.showModal({
        title: '提示',
        content: '确认要初始化设置',
        cancelText: '容朕想想',
        confirmColor: '#40a7e7',
        success: res => {
          if (res.confirm) {
            Taro.removeStorage({
              key: 'setting',
              success: function(res) {
                Taro.showToast({
                  title: '设置已初始化'
                })
                that.setData({
                  setting: {}
                })
                that.data.indexPage.reloadInitSetting()
              }
            })
          }
        }
      })
    } else if (datatype === 'all') {
      Taro.showModal({
        title: '提示',
        content: '确认要删除',
        cancelText: '容朕想想',
        confirmColor: '#40a7e7',
        success(res) {
          if (res.confirm) {
            Taro.clearStorage({
              success: res => {
                Taro.showToast({
                  title: '数据已清除'
                })
                that.setData({
                  setting: {},
                  pos: {}
                })
                that.data.indexPage.reloadInitSetting()
              }
            })
          }
        }
      })
    }
  }
  config = {
    navigationBarTitleText: '设置'
  }

  render() {
    const {
      setting: setting,
      enableUpdate: enableUpdate,
      SDKVersion: SDKVersion,
      screenBrightness: screenBrightness,
      keepscreenon: keepscreenon,
      show: show
    } = this.state
    return (
      <View className="setting">
        {/*  自定义  */}
        <View className="s">
          <View className="t">
            <View className="title">
              <View>自定义</View>
            </View>
            <View className="content">
              {/*  <view class='item' catchtap='customBcg'  catchlongpress='defaultBcg'>
                                                                                                                                                                              <view catchtap='customBcg'>
                                                                                                                                                                                <view>自定义首页背景</view>
                                                                                                                                                                                <view class='tip'>长按恢复默认背景</view>
                                                                                                                                                                              </view>
                                                                                                                                                                              <image catchtap='customBcg' class='more' src='/img/arrow.png'></image>
                                                                                                                                                                            </view>  */}
              <View className="item">
                <View>打开顶部城市天气快捷搜索</View>
                <Switch
                  color="#40a7e7"
                  checked={!setting.hiddenSearch}
                  onChange={this.switchChange}
                  data-switchparam="hiddenSearch"
                />
              </View>
              <View className="item">
                <View>显示生活指数信息</View>
                <Switch
                  color="#40a7e7"
                  checked={!setting.hiddenIndex}
                  onChange={this.switchChange}
                  data-switchparam="hiddenIndex"
                />
              </View>
            </View>
          </View>
          {/*  检查更新  */}
          <View className="t">
            <View className="title">
              <View>检查更新</View>
            </View>
            <View className="content">
              <View className="item">
                <View>
                  <View>打开首页更新提醒</View>
                  <View className="tip" onClick={this.updateInstruc}>
                    <Image src={require('../../img/question.png')} />
                    {enableUpdate && (
                      <Text>在首页检测到新版本，会提示更新</Text>
                    )}
                    {!enableUpdate && (
                      <Text style="flex:1;">
                        {'基础库版本需高于 1.9.90，当前基础库版本为 ' +
                          SDKVersion}
                      </Text>
                    )}
                  </View>
                </View>
                <Switch
                  color="#40a7e7"
                  checked={setting.forceUpdate}
                  onChange={this.switchChange}
                  data-switchParam="forceUpdate"
                />
              </View>
            </View>
          </View>
          {/*  小工具  */}
          <View className="t">
            <View className="title">
              <View>小工具</View>
            </View>
            <View className="content sub">
              <View className="subtitle">NFC</View>
              <View className="item" onClick={this.getHCEState}>
                <View>检测是否支持NFC</View>
                <Image className="more" src={require('../../img/arrow.png')} />
              </View>
            </View>
            <View className="content sub">
              <View className="subtitle">屏幕亮度</View>
              <View className="item">
                <View>
                  <View>当前屏幕亮度</View>
                  <View className="tip">范围0~100，0 最暗，100 最亮</View>
                </View>
                <View>{screenBrightness}</View>
              </View>
              <View className="item" onClick={this.setScreenBrightness}>
                <View style="width:100%">
                  <View>设置屏幕亮度</View>
                  <Slider
                    value={screenBrightness}
                    min="0"
                    max="100"
                    step="1"
                    blockSize="12"
                    blockColor="#40a7e7"
                    activeColor="#40a7e7"
                    showValue="true"
                    onChange={this.screenBrightnessChanging}
                    onChanging={this.screenBrightnessChanging}
                  />
                </View>
                {/*  <view>设置屏幕亮度</view>  */}
              </View>
              <View className="item">
                <View>
                  <View>保持常亮</View>
                  <View className="tip">
                    仅在当前小程序、当次生效，离开小程序后设置失效
                  </View>
                </View>
                <Switch
                  color="#40a7e7"
                  onChange={this.switchChange}
                  data-switchparam="keepscreenon"
                  checked={keepscreenon}
                />
              </View>
            </View>
            <View className="content sub">
              <View className="subtitle">系统信息</View>
              <View className="item'catchtap='getsysteminfo">
                <View>
                  <View>查看系统信息</View>
                </View>
                <Image className="more" src={require('../../img/arrow.png')} />
              </View>
            </View>
          </View>
          {/*  清除数据  */}
          <View className="t">
            <View className="title">
              <View>清除数据</View>
            </View>
            <View className="content">
              {/*  <view class='item'  catchtap='removeStorage' data-type='menu'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <view>首页悬浮球复位</view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              <view class='tip'>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                <text>首页悬浮球将复位到右下角</text>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </view>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            <image class='more' src='/img/arrow.png'></image>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          </view>  */}
              <View
                className="item"
                onClick={this.removeStorage}
                data-type="setting"
              >
                <View>
                  <View>恢复初始化设置</View>
                  <View className="tip">
                    <Image src={require('../../img/danger.png')} />
                    <Text>所有设置信息都将被清除</Text>
                  </View>
                </View>
                <Image className="more" src={require('../../img/arrow.png')} />
              </View>
              <View
                className="item"
                onClick={this.removeStorage}
                data-type="all"
              >
                <View>
                  <View>清除所有本地数据</View>
                  <View className="tip">
                    <Image src={require('../../img/danger.png')} />
                    <Text>所有本地数据都将被清除</Text>
                  </View>
                </View>
                <Image className="more" src={require('../../img/arrow.png')} />
              </View>
            </View>
          </View>
        </View>
        {/*  toast  */}
        {show && (
          <View className="toast">
            <View className="mask" onClick={this.hide} />
            <View className="wrapper">
              <View className="box">
                <View className="t">兼容性</View>
                <View className="content">
                  由于小程序基础库从 1.9.90 开始支持 wx.getUpdateManager
                  API，故基础库低于该版本的会忽略该设置。
                </View>
                <View className="t">启动机制</View>
                <View className="content">
                  小程序启动会有两种情况，一种是「冷启动」，一种是「热启动」。
                  假如用户已经打开过某小程序，然后在一定时间内再次打开该小程序，此时无需重新启动，只需将后台的小程序切换到前台，这个过程就是热启动；冷启动指的是用户首次打开或小程序被微信主动销毁后再次打开的情况，此时小程序需要重新加载启动。
                </View>
                <View className="t">更新机制</View>
                <View className="content">
                  小程序冷启动时如果发现有新版本，将会异步下载新版本的代码包，并同时用客户端本地的包进行启动，即新版本的小程序需要等下一次冷启动才会应用上。
                </View>
                <View className="t">运行机制</View>
                <View className="content">
                  <Text>1、小程序没有重启的概念；</Text>
                  <Text>
                    2、当小程序进入后台，客户端会维持一段时间的运行状态，超过一定时间后（目前是5分钟）会被微信主动销毁；
                  </Text>
                  <Text>
                    3、当短时间内（5s）连续收到两次以上系统内存告警，会进行小程序的销毁。
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    )
  }
}

export default _C
