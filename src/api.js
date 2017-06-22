let device = (session) => ({
  bellDevice: (id) => {
    return session.invoke(`/device/bell`, { id })
  },

  commandDevice: (id) => {
    return session.invoke(`/device/command`, { id })
  },

  dimDevice: (id, level) => {
    return session.invoke(`/device/dim`, { id, level })
  },

  getDeviceInfo: (id) => {
    return session.invoke(`/device/info`, { id })
  },

  setDeviceLearn: (id) => {
    return session.invoke(`/device/learn`, { id })
  },

  setDeviceName: (id, name) => {
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
  },

  downDevice: (id) => {
    return session.invoke(`/device/down`, { id })
  },

  upDownDevice: (id, state) => {
    return state ? (
      session.invoke(`/device/up`, { id })
    ) : (
      session.invoke(`/device/down`, { id })
    )
  },

  onOffDevice: (id, state) => {
    return state ? (
      session.invoke(`/device/turnOn`, { id })
    ) : (
      session.invoke(`/device/turnOff`, { id })
    )
  }
})

let devices = (session) => ({
  getDevices: () => {
    return session.invoke(`/devices/list`).then(resp => resp.device)
  }
})

let sensor = (session) => ({
  getSensorInfo: (id) => {
    return session.invoke(`/sensor/info`, { id })
  },

  setSensorName: (id, name) => {
    return session.invoke(`/sensor/setName`, { id, name })
  }
})

let sensors = (session) => ({
  getSensors: () => {
    return session.invoke(`/sensors/list`).then(resp => resp.sensor)
  }
})

let lua = (session) => ({
  luaCall: (script, functionName, params = {}) => {
    return session.invoke(`/lua/call`, {
      script,
      function: functionName,
      ...params
    })
  }
})

export default (session) => ({
  ...device(session),
  ...devices(session),
  ...sensor(session),
  ...sensors(session),
  ...lua(session)
})
