const Doc = require('./Doc')
const glob = require('glob')
const fse = require('fs-extra')
const { DOCUMENT_TYPE, DOCUMENT_HEADER } = require('../constants')

class WorkSheet extends Doc {
  currentSheet

  constructor(props) {
    super(props)
    this.onLoad()
  }

  onLoad = async () => {
    await this.loadArgv()
    await this.getCurrentSheet()
    await this.readFileSystem()
  }

  getSheetTitle = () => {
    const today = new Date().toLocaleDateString()
    return [this.documentsType, today].join(' ')
  }

  getSheetHeader = () => DOCUMENT_HEADER[this.documentsType] || []

  getCurrentSheet = async () => {
    const title = this.getSheetTitle()
    const workSheet = this.doc.sheetsByTitle[title]
    if (workSheet) {
      this.setCurrentSheet(workSheet)
      return workSheet
    } else {
      return this.addSheet()
    }
  }

  addSheet = async () => {
    const title = this.getSheetTitle()
    const headerValues = this.getSheetHeader()
    const tabColor =
      this.documentsType === DOCUMENT_TYPE.MXQL
        ? { red: 25, green: 160, blue: 229, alpha: 1 }
        : { red: 255, green: 185, blue: 2, alpha: 1 }

    const newSheet = await this.doc.addSheet({
      title,
      headerValues,
      tabColor,
      index: 0,
    })

    await this.setCurrentSheet(newSheet)

    return this.currentSheet
  }

  setCurrentSheet = (sheet) => {
    this.currentSheet = sheet
  }
  getVersionByPath = (path = '') => {
    const pathes = path.split('/')
    const hasVersion = !!pathes[1].includes('v')
    let names = hasVersion ? [] : ['-']
    let index = 1
    while (index < pathes.length) {
      if (pathes[index]) {
        names.push(pathes[index])
      }
      index++
    }
    const [version, target, ...others] = names
    return { version, target, view: others.join('/') }
  }

  getFileInfoInPath = (path = '') => {
    const _filename_ = path.replace(/^.*[\\\/]/g, '')
    const _path_ = path.slice(this.documentsDir.length, path.lastIndexOf(_filename_))
    const stamp = this.getStampOf(_path_, _filename_)

    return { _filename_, _path_, ...stamp, ...this.getVersionByPath(_path_) }
  }

  addRows = async (files = []) => {
    const headers = this.getSheetHeader()
    let rows = []

    await this.loadGitLogStamps(this.documentsDir, this.currentSheet.title)
    switch (this.documentsType) {
      case DOCUMENT_TYPE.WIDGET:
        files.forEach(async (path) => {
          try {
            const widget = fse.readJsonSync(path) || {}

            rows.push({
              ...this.getFileInfoInPath(path),
              ...Object.entries(widget).reduce((parsed, [key, value]) => {
                if (typeof value !== 'undefined') {
                  parsed[key] = JSON.stringify(value)
                }
                return parsed
              }, {}),
            })
          } catch (error) {
            console.error(error)
          }
        })
        break
      case DOCUMENT_TYPE.MXQL:
        files.forEach(async (path) => {
          const _query_ = fse.readFileSync(path, 'utf8')
          let file = {
            _query_,
            ...this.getFileInfoInPath(path),
          }
          _query_.split(/\r?\n/).forEach((sourceLine, lineNumber) => {
            if (sourceLine.trim()) {
              headers.reduce((parsed, header) => {
                if (sourceLine.includes(header)) {
                  const body = sourceLine.slice(header.length, sourceLine.length).trim()
                  const numbered = '[' + lineNumber + '] ' + body
                  if (!parsed[header]) {
                    parsed[header] = numbered
                  } else {
                    parsed[header] = parsed[header] + '\n' + numbered
                  }
                }
                return parsed
              }, file)
            }
          })
          // push
          if (Object.keys(file).length) {
            rows.push(file)
          }
        })
        break
    }

    // 기존 데이터 삭제
    await this.currentSheet.clear()

    await this.currentSheet.setHeaderRow(this.getSheetHeader())
    // 신규 데이터 추가
    await this.currentSheet.addRows(rows)

    this.print('addRows', `${rows.length} lines`)
  }

  searchFromDirToExt = () => {
    const { documentsDir, documentsExt } = this
    const search = documentsDir + '/**/*' + documentsExt

    const options = {}
    const files = glob.sync(search, options)

    this.addRows(files)
  }

  readFileSystem = () => {
    try {
      if (fse.pathExistsSync(this.documentsDir)) {
        this.searchFromDirToExt()
      }
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = WorkSheet
