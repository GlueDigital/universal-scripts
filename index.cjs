const { cleanup, clientInit } = require('./lib/redux/actions')
const { updateIntl, requestInit } = require('./lib/redux/slices')
const { setLang } = require('./lib/redux/lang')

const { useAppDispatch, useAppSelector } = require('./lib/redux/selector')

module.exports = {
  cleanup,
  clientInit,
  updateIntl,
  requestInit,
  useAppDispatch,
  useAppSelector,
  setLang
}
