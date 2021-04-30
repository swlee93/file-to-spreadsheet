const WorkSheet = require('./WorkSheet')

class Tools extends WorkSheet {
  constructor(doc) {
    super(doc)
    this.onLoad()
  }

  onLoad = async () => {
    await this.loadArgv()
    await this.getCurrentSheet()
    await this.readFileSystem()
  }
}

module.exports = Tools
