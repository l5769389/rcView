export default class Config {
  static readonly SERVER = 'SERVER' as const
  static readonly CLIENT = 'CLIENT' as const
  static readonly ROLE: 'SERVER' | 'CLIENT' = this.SERVER
  static readonly SERVER_ID = '1' as const

  static readonly SIGNAL_SERVER_IP = '192.168.3.162'
  static readonly SIGNAL_SERVER_PORT = 9000

  static readonly IS_SERVER_WINDOW_SHOW = true

  static readonly SERVER_AUTO_MACHINE_IS_ROBOT = false

  static readonly GRPC_IP = '127.0.0.1:50052'
}
