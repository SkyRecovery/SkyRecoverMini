import {
  Block,
  View,
  Image,
  Input,
  OpenData,
  Text,
  Swiper,
  SwiperItem,
  Ad,
  Button
} from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import Heartbeat from '../../components/heartbeat/heartbeat'
import './index.scss'
let utils = require('../../utils/utils.js')
let globalData = Taro.getApp().globalData
const key = globalData.key
let SYSTEMINFO = globalData.systeminfo

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    isIPhoneX: globalData.isIPhoneX,
    message: '',
    cityDatas: {},
    hourlyDatas: [],
    weatherIconUrl: globalData.weatherIconUrl,
    detailsDic: {
      key: [
        'tmp',
        'fl',
        'hum',
        'pcpn',
        'wind_dir',
        'wind_deg',
        'wind_sc',
        'wind_spd',
        'vis',
        'pres',
        'cloud',
        ''
      ],
      val: {
        tmp: '温度(℃)',
        fl: '体感温度(℃)',
        hum: '相对湿度(%)',
        pcpn: '降水量(mm)',
        wind_dir: '风向',
        wind_deg: '风向角度(deg)',
        wind_sc: '风力(级)',
        wind_spd: '风速(mk/h)',
        vis: '能见度(km)',
        pres: '气压(mb)',
        cloud: '云量'
      }
    },
    lifestyles: {
      comf: '舒适度指数',
      cw: '洗车指数',
      drsg: '穿衣指数',
      flu: '感冒指数',
      sport: '运动指数',
      trav: '旅游指数',
      uv: '紫外线指数',
      air: '空气污染扩散条件指数',
      ac: '空调开启指数',
      ag: '过敏指数',
      gl: '太阳镜指数',
      mu: '化妆指数',
      airc: '晾晒指数',
      ptfc: '交通指数',
      fsh: '钓鱼指数',
      spi: '防晒指数'
    },
    // 用来清空 input
    searchText: '',
    // 是否已经弹出
    hasPopped: false,
    animationMain: {},
    animationOne: {},
    animationTwo: {},
    animationThree: {},
    // 是否切换了城市
    located: true,
    // 需要查询的城市
    searchCity: '',
    setting: {},
    bcgImgList: [
      {
        src: '/img/beach-bird-birds-235787.jpg',
        topColor: '#393836'
      },
      {
        src: '/img/clouds-forest-idyllic-417102.jpg',
        topColor: '#0085e5'
      },
      {
        src: '/img/backlit-dawn-dusk-327466.jpg',
        topColor: '#2d2225'
      },
      {
        src: '/img/accomplishment-adventure-clear-sky-585825.jpg',
        topColor: '#004a89'
      },
      {
        src: '/img/fog-himalayas-landscape-38326.jpg',
        topColor: '#b8bab9'
      },
      {
        src: '/img/asphalt-blue-sky-clouds-490411.jpg',
        topColor: '#009ffe'
      },
      {
        src: '/img/aerial-climate-cold-296559.jpg',
        topColor: '#d6d1e6'
      },
      {
        src: '/img/beautiful-cold-dawn-547115.jpg',
        topColor: '#ffa5bc'
      }
    ],
    bcgImgIndex: 0,
    bcgImg: '',
    bcgImgAreaShow: false,
    bcgColor: '#2d2225',
    // 粗暴直接：移除后再创建，达到初始化组件的作用
    showHeartbeat: true,
    // heartbeat 时禁止搜索，防止动画执行
    enableSearch: true,
    openSettingButtonShow: false,
    shareInfo: {}
  }
  success = (data, location) => {
    this.setData({
      openSettingButtonShow: false,
      searchCity: location
    })
    Taro.stopPullDownRefresh()
    let now = new Date()
    // 存下来源数据
    data.updateTime = now.getTime()
    data.updateTimeFormat = utils.formatDate(now, 'MM-dd hh:mm')
    Taro.setStorage({
      key: 'cityDatas',
      data
    })
    this.setData({
      cityDatas: data
    })
  }
  fail = res => {
    Taro.stopPullDownRefresh()
    let errMsg = res.errMsg || ''
    // 拒绝授权地理位置权限
    if (errMsg.indexOf('deny') !== -1 || errMsg.indexOf('denied') !== -1) {
      Taro.showToast({
        title: '需要开启地理位置权限',
        icon: 'none',
        duration: 2500,
        success: res => {
          if (this.canUseOpenSettingApi()) {
            let timer = setTimeout(() => {
              clearTimeout(timer)
              Taro.openSetting({})
            }, 2500)
          } else {
            this.setData({
              openSettingButtonShow: true
            })
          }
        }
      })
    } else {
      Taro.showToast({
        title: '网络不给力，请稍后再试',
        icon: 'none'
      })
    }
  }
  commitSearch = res => {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  }
  dance = () => {
    this.setData({
      enableSearch: false
    })
    let heartbeat = this.selectComponent('#heartbeat')
    heartbeat.dance(() => {
      this.setData({
        showHeartbeat: false,
        enableSearch: true
      })
      this.setData({
        showHeartbeat: true
      })
    })
  }
  clearInput = () => {
    this.setData({
      searchText: ''
    })
  }
  search = (val, callback) => {
    if (val === '520' || val === '521') {
      this.clearInput()
      this.dance()
      return
    }
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    if (val) {
      this.setData({
        located: false
      })
      this.getWeather(val)
      this.getHourly(val)
    }
    callback && callback()
  }
  canUseOpenSettingApi = () => {
    let systeminfo = Taro.getApp().globalData.systeminfo
    let SDKVersion = systeminfo.SDKVersion
    let version = utils.cmpVersion(SDKVersion, '2.0.7')
    if (version < 0) {
      return true
    } else {
      return false
    }
  }
  init = (params, callback) => {
    this.setData({
      located: true
    })
    Taro.getLocation({
      success: res => {
        this.getWeather(`${res.latitude},${res.longitude}`)
        this.getHourly(`${res.latitude},${res.longitude}`)
        callback && callback()
      },
      fail: res => {
        this.fail(res)
      }
    })
  }
  getWeather = location => {
    Taro.request({
      url: `${globalData.requestUrl.weather}`,
      data: {
        location,
        key
      },
      success: res => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.clearInput()
            this.success(data, location)
          } else {
            Taro.showToast({
              title: '查询失败',
              icon: 'none'
            })
          }
        }
      },
      fail: () => {
        Taro.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    })
  }
  getHourly = location => {
    Taro.request({
      url: `${globalData.requestUrl.hourly}`,
      data: {
        location,
        key
      },
      success: res => {
        if (res.statusCode === 200) {
          let data = res.data.HeWeather6[0]
          if (data.status === 'ok') {
            this.setData({
              hourlyDatas: data.hourly || []
            })
          }
        }
      },
      fail: () => {
        Taro.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    })
  }
  onPullDownRefresh = res => {
    this.reloadPage()
  }
  getCityDatas = () => {
    let cityDatas = Taro.getStorage({
      key: 'cityDatas',
      success: res => {
        this.setData({
          cityDatas: res.data
        })
      }
    })
  }
  setBcgImg = index => {
    if (index !== undefined) {
      this.setData({
        bcgImgIndex: index,
        bcgImg: this.data.bcgImgList[index].src,
        bcgColor: this.data.bcgImgList[index].topColor
      })
      this.setNavigationBarColor()
      return
    }
    Taro.getStorage({
      key: 'bcgImgIndex',
      success: res => {
        let bcgImgIndex = res.data || 0
        this.setData({
          bcgImgIndex,
          bcgImg: this.data.bcgImgList[bcgImgIndex].src,
          bcgColor: this.data.bcgImgList[bcgImgIndex].topColor
        })
        this.setNavigationBarColor()
      },
      fail: () => {
        this.setData({
          bcgImgIndex: 0,
          bcgImg: this.data.bcgImgList[0].src,
          bcgColor: this.data.bcgImgList[0].topColor
        })
        this.setNavigationBarColor()
      }
    })
  }
  setNavigationBarColor = color => {
    let bcgColor = color || this.data.bcgColor
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bcgColor
    })
  }
  getBroadcast = callback => {
    wx.cloud
      .callFunction({
        name: 'getBroadcast',
        data: {
          hour: new Date().getHours()
        }
      })
      .then(res => {
        let data = res.result.data
        console.log(data)
        if (data) {
          callback && callback(data[0].message)
        }
      })
  }
  reloadGetBroadcast = () => {
    this.getBroadcast(message => {
      this.setData({
        message
      })
    })
  }
  reloadWeather = () => {
    if (this.data.located) {
      this.init({})
    } else {
      this.search(this.data.searchCity)
      this.setData({
        searchCity: ''
      })
    }
  }

  componentDidShow() {
    // onShareAppMessage 要求同步返回
    if (!utils.isEmptyObject(this.data.shareInfo)) {
      return
    }
    wx.cloud
      .callFunction({
        name: 'getShareInfo'
      })
      .then(res => {
        let shareInfo = res.result
        if (shareInfo) {
          if (!utils.isEmptyObject(shareInfo)) {
            this.setData({
              shareInfo
            })
          }
        }
      })
  }

  componentWillMount() {
    this.reloadPage()
  }

  reloadPage = () => {
    this.setBcgImg()
    this.getCityDatas()
    this.reloadInitSetting()
    this.reloadWeather()
    this.reloadGetBroadcast()
  }
  checkUpdate = setting => {
    // 兼容低版本
    if (!setting.forceUpdate || !wx.getUpdateManager) {
      return
    }
    let updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      console.error(res)
    })
    updateManager.onUpdateReady(function() {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已下载完成，是否重启应用？',
        success: function(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  }
  showBcgImgArea = () => {
    this.setData({
      bcgImgAreaShow: true
    })
  }
  hideBcgImgArea = () => {
    this.setData({
      bcgImgAreaShow: false
    })
  }
  chooseBcg = e => {
    let dataset = e.currentTarget.dataset
    let src = dataset.src
    let index = dataset.index
    this.setBcgImg(index)
    Taro.setStorage({
      key: 'bcgImgIndex',
      data: index
    })
  }
  toCitychoose = () => {
    Taro.navigateTo({
      url: '/pages/citychoose/citychoose'
    })
  }
  initSetting = successFunc => {
    Taro.getStorage({
      key: 'setting',
      success: res => {
        let setting = res.data || {}
        this.setData({
          setting
        })
        successFunc && successFunc(setting)
      },
      fail: () => {
        this.setData({
          setting: {}
        })
      }
    })
  }
  reloadInitSetting = () => {
    this.initSetting(setting => {
      this.checkUpdate(setting)
    })
  }
  onShareAppMessage = res => {
    let shareInfo = this.data.shareInfo
    return {
      title: shareInfo.title || 'Freedom Weather',
      path: shareInfo.path || '/pages/index/index',
      imageUrl: shareInfo.imageUrl
    }
  }
  menuHide = () => {
    if (this.data.hasPopped) {
      this.takeback()
      this.setData({
        hasPopped: false
      })
    }
  }
  menuMain = () => {
    if (!this.data.hasPopped) {
      this.popp()
      this.setData({
        hasPopped: true
      })
    } else {
      this.takeback()
      this.setData({
        hasPopped: false
      })
    }
  }
  menuToCitychoose = () => {
    this.menuMain()
    Taro.navigateTo({
      url: '/pages/citychoose/citychoose'
    })
  }
  menuToSetting = () => {
    this.menuMain()
    Taro.navigateTo({
      url: '/pages/setting/setting'
    })
  }
  menuToAbout = () => {
    this.menuMain()
    Taro.navigateTo({
      url: '/pages/about/about'
    })
  }
  popp = () => {
    let animationMain = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(180).step()
    animationOne
      .translate(0, -60)
      .rotateZ(360)
      .opacity(1)
      .step()
    animationTwo
      .translate(-Math.sqrt(3600 - 400), -30)
      .rotateZ(360)
      .opacity(1)
      .step()
    animationThree
      .translate(-Math.sqrt(3600 - 400), 30)
      .rotateZ(360)
      .opacity(1)
      .step()
    animationFour
      .translate(0, 60)
      .rotateZ(360)
      .opacity(1)
      .step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export()
    })
  }
  takeback = () => {
    let animationMain = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationOne = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationTwo = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationThree = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    let animationFour = Taro.createAnimation({
      duration: 200,
      timingFunction: 'ease-out'
    })
    animationMain.rotateZ(0).step()
    animationOne
      .translate(0, 0)
      .rotateZ(0)
      .opacity(0)
      .step()
    animationTwo
      .translate(0, 0)
      .rotateZ(0)
      .opacity(0)
      .step()
    animationThree
      .translate(0, 0)
      .rotateZ(0)
      .opacity(0)
      .step()
    animationFour
      .translate(0, 0)
      .rotateZ(0)
      .opacity(0)
      .step()
    this.setData({
      animationMain: animationMain.export(),
      animationOne: animationOne.export(),
      animationTwo: animationTwo.export(),
      animationThree: animationThree.export(),
      animationFour: animationFour.export()
    })
  }
  config = {
    navigationBarTitleText: 'Freedom Weather',
    enablePullDownRefresh: true
  }

  render() {
    const {
      isIPhoneX: isIPhoneX,
      showHeartbeat: showHeartbeat,
      bcgImg: bcgImg,
      bcgColor: bcgColor,
      setting: setting,
      bcgImgAreaShow: bcgImgAreaShow,
      searchText: searchText,
      enableSearch: enableSearch,
      bcgImgIndex: bcgImgIndex,
      bcgImgList: bcgImgList,
      located: located,
      cityDatas: cityDatas,
      message: message,
      weatherIconUrl: weatherIconUrl,
      detailsDic: detailsDic,
      hourlyDatas: hourlyDatas,
      lifestyles: lifestyles,
      openSettingButtonShow: openSettingButtonShow,
      animationOne: animationOne,
      animationTwo: animationTwo,
      animationThree: animationThree,
      animationFour: animationFour,
      animationMain: animationMain
    } = this.state
    return (
      <View
        className={'container ' + (isIPhoneX ? 'iphonex-padding' : '')}
        onClick={this.menuHide}
      >
        {showHeartbeat && <Heartbeat id="heartbeat" />}
        {!bcgImg && <View className="bcg" style={'background: ' + bcgColor} />}
        {bcgImg && <Image className="bcg" src={bcgImg} mode="aspectFill" />}
        {!setting.hiddenSearch && !bcgImgAreaShow && (
          <View className="search" style="background:rgba(255, 255, 255, 0)">
            <View className="wrapper">
              <Image src={require('../../img/search.png')} />
              <Input
                placeholderClass="placeholderClass"
                confirmType="search"
                placeholder="请输入城市名，快速查询天气信息"
                maxlength="20"
                onConfirm={this.commitSearch}
                value={searchText}
                disabled={!enableSearch}
              />
            </View>
          </View>
        )}
        {bcgImgAreaShow && (
          <View className="chooseBcg">
            <View className="top">
              <View className="title">更换背景</View>
              <View className="bcgs">
                {bcgImgList.map((item, index) => {
                  return (
                    <View
                      className={
                        'border ' + (bcgImgIndex === index ? 'active' : '')
                      }
                      key={index}
                    >
                      <Image
                        src={item.src}
                        onClick={this.chooseBcg}
                        data-index={index}
                        data-src={item.src}
                      />
                    </View>
                  )
                })}
              </View>
            </View>
            <View className="close" onClick={this.hideBcgImgArea}>
              <Image src={require('../../img/up-arrow.png')} />
            </View>
          </View>
        )}
        {!bcgImgAreaShow && (
          <View
            className="content"
            style={'margin-top: ' + (setting.hiddenSearch ? 20 : 60) + 'px'}
          >
            <View className="avatarInfo" onClick={this.showBcgImgArea}>
              <OpenData className="avatar" type="userAvatarUrl" />
              <OpenData className="name" type="userNickName" />
              <Image
                className="downArrow"
                src={require('../../img/down.png')}
              />
            </View>
            <View className="info">
              <View className="city">
                <View className="name" onClick={this.toCitychoose}>
                  {located && (
                    <Image
                      className="icon"
                      src={require('../../img/location_s_w.png')}
                    />
                  )}
                  <View className="val">
                    {cityDatas.basic.location || '定位中'}
                  </View>
                  <Image className="down" src={require('../../img/down.png')} />
                </View>
                {cityDatas.updateTimeFormat && (
                  <Text className="time">
                    {cityDatas.updateTimeFormat + ' 更新'}
                  </Text>
                )}
              </View>
              <View className="message">{message}</View>
              <View className="temp num" decode="true">
                {cityDatas.now.tmp || '-'}
                <Text style="font-size:50rpx;position:relative;top:-20px;">
                  ℃
                </Text>
              </View>
              <View className="weather">{cityDatas.now.cond_txt || '--'}</View>
              <View className="pm">
                <Text>{'能见度 ' + cityDatas.now.vis}</Text>
              </View>
            </View>
            {cityDatas.daily_forecast && (
              <View className="guide">
                <View className="title">7 天预报</View>
                <View className="guides">
                  {cityDatas.daily_forecast.map((item, index) => {
                    return (
                      <View className="item" key={index}>
                        <View className="date i">{item.date}</View>
                        <View className="temperature i">
                          {item.tmp_max + '~' + item.tmp_min + '℃'}
                        </View>
                        <View className="weather i">
                          <Text>{item.cond_txt_d}</Text>
                          <Image
                            mode="widthFix"
                            src={weatherIconUrl + item.cond_code_d + '.png'}
                          />
                        </View>
                        <View className="wind i">
                          {item.wind_dir + item.wind_sc + '级'}
                        </View>
                      </View>
                    )
                  })}
                </View>
              </View>
            )}
            <View className="details">
              {detailsDic.key.map((item, index) => {
                return (
                  <View className="detail" key={index}>
                    <View>{detailsDic.val[item]}</View>
                    <View>{cityDatas.now[item]}</View>
                  </View>
                )
              })}
            </View>
            {hourlyDatas.length && (
              <View className="hourly">
                <View className="title">24 小时逐 3 小时预报</View>
                <View className="hours">
                  <Swiper
                    style="height:360rpx;"
                    indicatorDots={false}
                    autoplay={false}
                    circular={false}
                    duration="300"
                    nextMargin="50rpx"
                  >
                    {hourlyDatas.map((item, index) => {
                      return (
                        <Block key={index}>
                          <SwiperItem>
                            <View className="hour">
                              <View className="detail">
                                <View>温度(℃)</View>
                                <View>{item.tmp}</View>
                              </View>
                              <View className="detail">
                                <View>天气</View>
                                <View className="weather">
                                  <Text>{item.cond_txt}</Text>
                                  <Image
                                    mode="widthFix"
                                    src={
                                      weatherIconUrl + item.cond_code + '.png'
                                    }
                                  />
                                </View>
                              </View>
                              <View className="detail">
                                <View>相对湿度(%)</View>
                                <View>{item.hum}</View>
                              </View>
                              <View className="detail">
                                <View>露点温度(℃)</View>
                                <View>{item.dew}</View>
                              </View>
                              <View className="detail">
                                <View>降水概率</View>
                                <View>{item.pop}</View>
                              </View>
                              <View className="detail">
                                <View>风向</View>
                                <View>{item.wind_dir}</View>
                              </View>
                              <View className="detail">
                                <View>风向角度(deg)</View>
                                <View>{item.wind_deg}</View>
                              </View>
                              <View className="detail">
                                <View>风力(级)</View>
                                <View>{item.wind_sc}</View>
                              </View>
                              <View className="detail">
                                <View>风速(mk/h)</View>
                                <View>{item.wind_spd}</View>
                              </View>
                              <View className="detail">
                                <View>气压(mb)</View>
                                <View>{item.pres}</View>
                              </View>
                              <View className="detail">
                                <View>云量</View>
                                <View>{item.cloud}</View>
                              </View>
                            </View>
                            <View className="time">{item.time}</View>
                          </SwiperItem>
                        </Block>
                      )
                    })}
                  </Swiper>
                </View>
              </View>
            )}
            <Ad unitId="adunit-fd0d2b63f6e96bbf" />
            {!setting.hiddenIndex && (
              <View className="livingIndex">
                {cityDatas.lifestyle.map((item, index) => {
                  return (
                    <View className="item" key={index}>
                      <Image
                        className="icon"
                        src={'/img/lifestyle_' + item.type + '.png'}
                      />
                      <View className="right">
                        <View className="key">
                          {lifestyles[item.type] + ' ' + item.brf}
                        </View>
                        <View className="value">{item.txt}</View>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        )}
        {openSettingButtonShow && (
          <View className="openSettingButton">
            <Image src={require('../../img/unlock.png')} />
            <Button openType="openSetting" />
          </View>
        )}
        {/*  悬浮菜单  */}
        {!bcgImgAreaShow && (
          <View className="menus">
            <Image
              src={require('../../img/share_circle.png')}
              animation={animationOne}
              className="menu"
            />
            <Button
              plain="true"
              openType="share"
              animation={animationOne}
              className="menu share"
            />
            <Image
              src={require('../../img/setting.png')}
              animation={animationTwo}
              className="menu"
              onClick={this.menuToSetting}
            />
            <Image
              src={require('../../img/location.png')}
              animation={animationThree}
              className="menu"
              onClick={this.menuToCitychoose}
            />
            <Image
              src={require('../../img/info.png')}
              animation={animationFour}
              className="menu"
              onClick={this.menuToAbout}
            />
            <Image
              src={require('../../img/menu.png')}
              animation={animationMain}
              className="menu main"
              onClick={this.menuMain}
            />
          </View>
        )}
      </View>
    )
  }
}

export default _C
