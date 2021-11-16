const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  return db.collection('hotCities')
    .get()
}