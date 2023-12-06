const config: any = {}

const setConfig = (newConfig) => {
  Object.assign(config, newConfig)
}
const getConfig = () => {
  return config
}

export { config, getConfig, setConfig }
