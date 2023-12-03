import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { join, resolve } from 'path'

const PROTO_PATH1 = resolve(join(__dirname, '..', '../../resources/robotOp.proto'))
const packageDefinition = protoLoader.loadSync(PROTO_PATH1, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export const proto = grpc.loadPackageDefinition(packageDefinition)
