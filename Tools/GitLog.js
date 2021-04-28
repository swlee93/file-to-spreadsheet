const gitDateExtractor = require('git-date-extractor')
const fse = require('fs-extra')
const Argv = require('./Argv')

class GitLog extends Argv {
  static stamps = {}

  constructor() {
    super()
  }

  loadGitLogStamps = async (projectRootPath, sheetName) => {
    if (!projectRootPath || !sheetName) {
      return []
    }

    const fileDir = `${__dirname}/../gitlog/${sheetName}.json`

    if (fse.existsSync(fileDir)) {
      this.stamps = fse.readJsonSync(fileDir)
    } else {
      this.stamps = await gitDateExtractor.getStamps({
        projectRootPath,
      })

      fse.outputJson(fileDir, this.stamps)
    }
    return this.stamps
  }

  getStampOf = (path = '', filename = '') => {
    const key = path.slice(1) + filename

    const stamp = this.stamps[key]
    if (!stamp) return {}

    return {
      created: new Date(stamp.created * 1000).toLocaleString(),
      modified: new Date(stamp.modified * 1000).toLocaleString(),
    }
  }
}

module.exports = GitLog
