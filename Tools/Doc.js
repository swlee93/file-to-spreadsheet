const GitLog = require('./GitLog')

class Doc extends GitLog {
  static doc

  constructor(doc) {
    super()
    this.doc = doc
  }
}

module.exports = Doc
