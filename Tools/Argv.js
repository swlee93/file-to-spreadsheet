const { DOCUMENT_TYPE } = require('../constants')
const prompts = require('prompts')
const fse = require('fs-extra')

class Argv {
  static documentsType
  static documentsDir
  static documentsExt

  constructor() {}

  loadArgv = async () => {
    let noArgs = false
    process.argv.forEach((argv, index) => {
      switch (argv) {
        case '-widget':
          this.documentsType = DOCUMENT_TYPE.WIDGET
          this.documentsDir = process.argv[index + 1] || process.env.DEFAULT_WIDGET_PATH_ARG
          this.documentsExt = '.json'
          break
        case '-mql':
        case '-mxql':
          this.documentsType = DOCUMENT_TYPE.MXQL
          this.documentsDir = process.argv[index + 1] || process.env.DEFAULT_MXQL_PATH_ARG
          this.documentsExt = '.mql'
          break
        default:
          noArgs = true
      }
    })
    if (noArgs) {
      await this.getPrompts()
    }

    this.print()
  }
  getPrompts = async () => {
    const response = await prompts([
      {
        type: 'toggle',
        name: 'documentsType',
        message: 'documentsType',
        initial: true,
        active: '-mxql',
        inactive: '-widget',
        style: 'emoji',
      },
      {
        type: 'text',
        name: 'documentsDir',
        message: 'documentsDir',

        onRender(kleur) {
          this.msg = 'documentsDir: ' + kleur.cyan('*미입력 시 ".env"에 등록된 경로 기본값을 사용합니다.')
        },
        validate: (path) => {
          return this.validatePath(path)
        },
      },
    ])

    this.documentsType = response.documentsType ? DOCUMENT_TYPE.MXQL : DOCUMENT_TYPE.WIDGET
    this.documentsDir = response.documentsDir
      ? response.documentsDir
      : response.documentsType
      ? process.env.DEFAULT_MXQL_PATH_ARG
      : process.env.DEFAULT_WIDGET_PATH_ARG

    this.documentsExt = this.documentsType === DOCUMENT_TYPE.MXQL ? '.mql' : '.json'
  }
  validatePath = async (path) => {
    if (!path) return true
    try {
      if (fse.pathExistsSync(path)) {
        return true
      } else {
        return `${path} 폴더가 존재하지 않습니다.`
      }
    } catch (error) {
      return error
    }
  }

  print = (title, message) => {
    if (title) {
      console.log(`[${title}] ${message} > ${this.currentSheet.title}`)
    } else {
      console.log({
        Type: this.documentsType,
        Dir: this.documentsDir,
        Ext: this.documentsExt,
      })
    }
  }
}

module.exports = Argv
