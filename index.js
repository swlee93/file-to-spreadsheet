const Tools = require('./Tools')

require('dotenv').config()

const onError = (error) => {
  console.log(error)
}

const main = async () => {
  const { GoogleSpreadsheet } = require('google-spreadsheet')

  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID)

  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc
    .useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    })
    .catch(onError)

  await doc.loadInfo().catch(onError)

  const tools = new Tools(doc)

  // loads document properties and worksheets

  // const sheetCount = doc.sheetCount
  //   const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
}

main()
