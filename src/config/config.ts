export default class Config {
  static readonly SERVER: 'SERVER' = 'SERVER'
  static readonly CLIENT: 'CLIENT' = 'CLIENT'
  static readonly ROLE: 'SERVER' | 'CLIENT' = this.CLIENT

  static readonly SERVER_ID = '1'

  static readonly SIGNAL_SERVER_IP = '192.168.3.243'
  static readonly SIGNAL_SERVER_PORT = 9000

  static readonly IS_SERVER_WINDOW_SHOW = true
  //清晰度。越高清晰度越高。
  static readonly VIEW_RESOLUTION = 1
}
