export default (session) => ({
  getDevices: () => {
    return session.invoke('/devices/list')
  },

  getDeviceInfo: (id) => {
    return session.invoke(`/device/info`, { id })
  },

  bellDevice: (id) => {
    return session.invoke(`/device/bell`, { id })
  },

  commandDevice: (id, method, value) => {
    return session.invoke(`/device/command`, { id, method, value })
  },

  dimDevice: (id, level) => {
    return session.invoke(`/device/dim`, { id, level })
  },

  downDevice: (id) => {
    return session.invoke(`/device/down`, { id })
  },

  infoDevice: (id) => {
    return session.invoke(`/device/info`, { id })
  },

  learnDevice: (id) => {
    return session.invoke(`/device/learn`, { id })
  },

  setNameDevice: (id, name) => {
    return session.invoke(`/device/setName`, { id, name })
  },

  stopDevice: (id) => {
    return session.invoke(`/device/stop`, { id })
  },

  turnOffDevice: (id) => {
    return session.invoke(`/device/turnOff`, { id })
  },

  turnOnDevice: (id) => {
    return session.invoke(`/device/turnOn`, { id })
  },

  upDevice: (id) => {
    return session.invoke(`/device/up`, { id })
  }
})
