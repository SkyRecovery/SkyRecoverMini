import { Block, View, Image, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './systeminfo.scss'

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    systeminfoObj: {},
    systeminfoArr: [
      {
        key: 'brand',
        name: '手机品牌'
      },
      {
        key: 'model',
        name: '手机型号'
      },
      {
        key: 'pixelRatio',
        name: '设备像素比'
      },
      {
        key: 'screenWidth',
        name: '屏幕宽度'
      },
      {
        key: 'screenHeight',
        name: '屏幕高度'
      },
      {
        key: 'windowWidth',
        name: '可使用窗口宽度'
      },
      {
        key: 'windowHeight',
        name: '可使用窗口高度'
      },
      {
        key: 'statusBarHeight',
        name: '状态栏高度'
      },
      {
        key: 'language',
        name: '微信设置的语言'
      },
      {
        key: 'version',
        name: '微信版本号'
      },
      {
        key: 'system',
        name: '操作系统版本'
      },
      {
        key: 'platform',
        name: '客户端平台'
      },
      {
        key: 'fontSizeSetting',
        name: '用户字体大小设置(px)'
      },
      {
        key: 'SDKVersion',
        name: '客户端基础库版本'
      }
    ]
  }

  componentDidShow() {
    this.setData({
      systeminfoObj: Taro.getApp().globalData.systeminfo
    })
  }

  config = {
    navigationBarTitleText: '系统信息'
  }

  render() {
    const {
      systeminfoObj: systeminfoObj,
      systeminfoArr: systeminfoArr
    } = this.state
    return (
      <View className="systeminfo">
        <View className="brand">
          <Image src={require('../../img/mobile.png')} />
          <Text>{systeminfoObj.brand}</Text>
        </View>
        {systeminfoArr.map((item, index) => {
          return (
            <View className="item" key={index}>
              <View className="key">{item.name}</View>
              <View className="value">{systeminfoObj[item.key]}</View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default _C
