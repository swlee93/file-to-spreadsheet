const DOCUMENT_TYPE = { WIDGET: 'WIDGET', MXQL: 'MXQL' }

const DOCUMENT_HEADER = {
  WIDGET: [
    'version',
    'target',
    'view',
    '_filename_',
    'modified',
    'created',
    'widgetType',
    'requestApi',
    'isDev',
    'title',
    'supports',
    'metrics',
    'relates',
    'option',
    'isMultiProject',
  ],
  MXQL: ['version', 'target', 'view', '_filename_', 'modified', 'created', '--', 'HEADER', 'CATEGORY', '_query_', '#'],
}

module.exports = {
  DOCUMENT_TYPE,
  DOCUMENT_HEADER,
}
