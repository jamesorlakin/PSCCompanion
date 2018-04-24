import cheerio from 'react-native-cheerio'
import moment from 'moment'

export default async function fetchNotices () {
  var page = await (await fetch('https://intranet.psc.ac.uk/news/browser.php')).text()
  var document = cheerio.load(page)
  var notices = []

  document("div[id='report-wide'] > ul > li").each(function (item) {
    var newNotice = {}
    newNotice.title = document(this).find('h4').text()
    newNotice.date = moment(document(this).find('.posted').text().substr(8), 'DD/MM/YY HH:mm')

    document(document(this).find('h4')).remove()
    document(document(this).find('.posted')).remove()
    newNotice.body = document(this).html()
    newNotice.body = newNotice.body.substr(16, newNotice.body.length)
    newNotice.rawText = document(this).text()
    newNotice.rawText = newNotice.rawText.substr(16, newNotice.rawText.length)

    notices.push(newNotice)
  })

  return notices
}
