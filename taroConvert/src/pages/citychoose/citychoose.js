import { Block, View, Image, Input, Text, Ad } from '@tarojs/components'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import './citychoose.scss'
let staticData = require('../../data/staticData.js')
let utils = require('../../utils/utils.js')

@withWeapp('Page')
class _C extends Taro.Component {
  state = {
    alternative: null,
    cities: [],
    // 需要显示的城市
    showItems: null,
    inputText: '',
    hotCities: []
  }
  cancel = () => {
    this.setData({
      inputText: '',
      showItems: this.data.cities
    })
  }
  inputFilter = e => {
    let alternative = {}
    let cities = this.data.cities
    let value = e.detail.value.replace(/\s+/g, '')
    if (value.length) {
      for (let i in cities) {
        let items = cities[i]
        for (let j = 0, len = items.length; j < len; j++) {
          let item = items[j]
          if (item.name.indexOf(value) !== -1) {
            if (utils.isEmptyObject(alternative[i])) {
              alternative[i] = []
            }
            alternative[i].push(item)
          }
        }
      }
      if (utils.isEmptyObject(alternative)) {
        alternative = null
      }
      this.setData({
        alternative,
        showItems: alternative
      })
    } else {
      this.setData({
        alternative: null,
        showItems: cities
      })
    }
  }
  getSortedAreaObj = areas => {
    // let areas = staticData.areas
    areas = areas.sort((a, b) => {
      if (a.letter > b.letter) {
        return 1
      }
      if (a.letter < b.letter) {
        return -1
      }
      return 0
    })
    let obj = {}
    for (let i = 0, len = areas.length; i < len; i++) {
      let item = areas[i]
      delete item.districts
      let letter = item.letter
      if (!obj[letter]) {
        obj[letter] = []
      }
      obj[letter].push(item)
    }
    // 返回一个对象，直接用 wx:for 来遍历对象，index 为 key，item 为 value，item 是一个数组
    return obj
  }
  choose = e => {
    let name = e.currentTarget.dataset.name
    let pages = Taro.getCurrentPages()
    let len = pages.length
    let indexPage = pages[len - 2]
    if (name) {
      indexPage.search(name, () => {
        Taro.navigateBack({})
      })
    } else {
      indexPage.init({}, () => {
        Taro.navigateBack({})
      })
    }
  }
  getHotCities = callback => {
    wx.cloud
      .callFunction({
        name: 'getHotCities',
        data: {}
      })
      .then(res => {
        let data = res.result.data
        if (data) {
          this.setData({
            hotCities: data
          })
        }
      })
  }

  componentWillMount() {
    this.getHotCities()
    let cities = this.getSortedAreaObj(staticData.cities || [])
    this.setData({
      cities,
      showItems: cities
    })
  }

  config = {
    navigationBarTitleText: '选择城市'
  }

  render() {
    const {
      inputText: inputText,
      hotCities: hotCities,
      showItems: showItems
    } = this.state
    return (
      <View className="container">
        <View className="wrapper">
          <View className="search">
            <View className="inner">
              <Image
                className="icon"
                src={require('../../img/search_grey.png')}
              />
              <Input
                value={inputText}
                placeholder="请输入城市名，快速查询天气信息"
                maxlength="20"
                confirmType="搜索"
                onInput={this.inputFilter}
                onConfirm={this.inputFilter}
                onFocus={this.inputFilter}
              />
            </View>
            <Text className="cancel" onClick={this.cancel}>
              清空
            </Text>
          </View>
        </View>
        {hotCities.length && (
          <View className="top">
            <View className="title">热门城市</View>
            <View className="items">
              {hotCities.map((item, index) => {
                return (
                  <View
                    className="item"
                    hoverClass="hover-ddd"
                    onClick={this.choose}
                    data-item={item}
                    key={index}
                  >
                    {item.name}
                  </View>
                )
              })}
            </View>
          </View>
        )}
        <View className="hot">
          <View className="title">猜你想找</View>
          <View className="cities">
            <View className="item active" onClick={this.choose}>
              <Image
                className="icon"
                src={require('../../img/location_s_w.png')}
              />
              <View>定位</View>
            </View>
            {hotCities.map((item, index) => {
              return (
                <View
                  className="item"
                  hoverClass="active"
                  onClick={this.choose}
                  key={index}
                  data-name={item.name}
                >
                  {item.name}
                </View>
              )
            })}
          </View>
        </View>
        <Ad unitId="adunit-a4ec392026d90b4e" />
        <View className="bottom">
          {showItems.map((item, index) => {
            return (
              <View key={index}>
                <View className="key">{index}</View>
                <View className="values">
                  {item.map((item, index) => {
                    return (
                      <View
                        key={index}
                        className="value"
                        hoverClass="hover"
                        onClick={this.choose}
                        data-name={item.name}
                      >
                        {item.name}
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
        {!showItems && <View className="empty">暂无城市可以选择</View>}
      </View>
    )
  }
}

export default _C
