import { Block, View, Swiper, SwiperItem, Image, Ad } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './about.scss'
let utils = require('../../utils/utils.js')

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    projectAddress: 'https://github.com/myvin/quietweather',
    github: 'https://github.com/myvin',
    email: '851399101@qq.com',
    qq: '851399101',
    swiperHeight: 'auto',
    bannerImgList: [
      // {
      //   src: 'https://raw.githubusercontent.com/myvin/miniprogram/master/quietweather/images/miniqrcode.jpg',
      //   title: 'Quiet Weather',
      // },
      {
        src:
          'https://raw.githubusercontent.com/myvin/miniprogram/master/juejin/images/miniqrcode.jpg',
        title: '掘金第三方版'
      },
      {
        src:
          'https://raw.githubusercontent.com/myvin/miniprogram/master/suijiyitu/images/suijiyitu.jpg',
        title: '随机一图'
      }
    ]
  }

  componentWillMount() {
    this.initSwiper()
  }

  previewImages = e => {
    let index = e.currentTarget.dataset.index || 0
    let urls = this.data.bannerImgList
    let arr = []
    let imgs = urls.forEach(item => {
      arr.push(item.src)
    })
    Taro.previewImage({
      current: arr[index],
      urls: arr,
      success: function(res) {},
      fail: function(res) {
        console.error('previewImage fail: ', res)
      }
    })
  }
  initSwiper = () => {
    let systeminfo = Taro.getApp().globalData.systeminfo
    if (utils.isEmptyObject(systeminfo)) {
      Taro.getSystemInfo({
        success: res => {
          this.setSwiperHeight(res)
        }
      })
    } else {
      this.setSwiperHeight(systeminfo)
    }
  }
  setSwiperHeight = res => {
    this.setData({
      swiperHeight: `${((res.windowWidth || res.screenWidth) / 375) * 200}px`
    })
  }
  copy = e => {
    let dataset = (e.currentTarget || {}).dataset || {}
    let title = dataset.title || ''
    let content = dataset.content || ''
    Taro.setClipboardData({
      data: content,
      success() {
        Taro.showToast({
          title: `已复制${title}`,
          duration: 2000
        })
      }
    })
  }
  config = {
    navigationBarTitleText: '关于'
  }

  render() {
    const {
      swiperHeight: swiperHeight,
      bannerImgList: bannerImgList,
      projectAddress: projectAddress
    } = this.state
    return (
      <View className="about">
        <View className="content">
          <Swiper
            indicatorColor="#666666"
            indicatorActiveColor="#40a7e7"
            indicatorDots="true"
            autoplay="true"
            circular="true"
            interval="5000"
            duration="300"
            previousMargin="0px"
            nextMargin="0px"
            style={'height:' + swiperHeight}
          >
            {bannerImgList.map((item, index) => {
              return (
                <Block key={index}>
                  <SwiperItem>
                    <View
                      className="info"
                      data-index={index}
                      onClick={this.previewImages}
                    >
                      <Image src={item.src} />
                      <View className="name">{item.title}</View>
                    </View>
                  </SwiperItem>
                </Block>
              )
            })}
          </Swiper>
          <Ad unitId="adunit-a4ec392026d90b4e" />
          <View className="item">
            <View className="title">代码已开源</View>
            <View
              className="i"
              onClick={this.copy}
              data-title="项目地址"
              data-content={projectAddress}
            >
              <View className="icon">
                <Image src={require('../../img/github.png')} />
              </View>
              <View className="text">
                <View>可随意 star</View>
                <View>{projectAddress}</View>
              </View>
            </View>
          </View>
          {/*  <view class='item'>
                                                                                                                                                                                                                                                                                                                                                                                                           <view class='title'>联系开发者</view>
                                                                                                                                                                                                                                                                                                                                                                                                           <view class='i' catchtap='copy' data-title='GitHub' data-content='{{github}}'>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='icon'>
                                                                                                                                                                                                                                                                                                                                                                                                               <image src='/img/github.png'></image>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='text'>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>通过 GitHub 反馈</view>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>{{github}}</view>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                           </view>
                                                                                                                                                                                                                                                                                                                                                                                                           <view class='i' catchtap='copy' data-title='邮箱' data-content='{{email}}'>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='icon'>
                                                                                                                                                                                                                                                                                                                                                                                                               <image src='/img/email.png'></image>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='text'>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>通过 Email 反馈</view>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>{{email}}</view>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                           </view>
                                                                                                                                                                                                                                                                                                                                                                                                           <view class='i' catchtap='copy' data-title='QQ' data-content='{{qq}}'>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='icon'>
                                                                                                                                                                                                                                                                                                                                                                                                               <image src='/img/qq.png'></image>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                             <view class='text'>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>通过 QQ 反馈</view>
                                                                                                                                                                                                                                                                                                                                                                                                               <view>{{qq}}</view>
                                                                                                                                                                                                                                                                                                                                                                                                             </view>
                                                                                                                                                                                                                                                                                                                                                                                                           </view>
                                                                                                                                                                                                                                                                                                                                                                                                         </view>  */}
          <View className="thanks item">
            <View className="title">鸣谢</View>
            <View className="i">
              <View className="icon">
                <Image src={require('../../img/weather.png')} />
              </View>
              <View className="text">气象数据来源：和风天气</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default _C
