import grpc from '@grpc/grpc-js'
import { join, resolve } from 'path'
import protoLoader from '@grpc/proto-loader'

const PROTO_PATH = resolve(join(__dirname, '../../', '/resources/robotOp.proto'))
const PROTO_PATH1 = resolve(__dirname, '../../resources/robotOp.proto')

console.log(PROTO_PATH, PROTO_PATH1)

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
})

export const proto = grpc.loadPackageDefinition(packageDefinition)
