export default ({ invoke }) => ({
  getDevices: () => {
    return invoke('/devices/list')
  },

  getDeviceInfo: (id) => {
    return invoke(`/device/info`, { id })
  },

  bellDevice: (id) => {
    return invoke(`/device/bell`, { id })
  },

  commandDevice: (id, method, value) => {
    return invoke(`/device/command`, { id, method, value })
  },

  dimDevice: (id, level) => {
    return invoke(`/device/dim`, { id, level })
  },

  downDevice: (id) => {
    return invoke(`/device/down`, { id })
  },

  infoDevice: (id) => {
    return invoke(`/device/info`, { id })
  },

  learnDevice: (id) => {
    return invoke(`/device/learn`, { id })
  },

  setNameDevice: (id, name) => {
    return invoke(`/device/setName`, { id, name })
  },

  stopDevice: (id) => {
    return invoke(`/device/stop`, { id })
  },

  turnOffDevice: (id) => {
    return invoke(`/device/turnOff`, { id })
  },

  turnOnDevice: (id) => {
    return invoke(`/device/turnOn`, { id })
  },

  upDevice: (id) => {
    return invoke(`/device/up`, { id })
  }
})
