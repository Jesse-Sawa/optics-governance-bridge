import { ChainJson, toChain } from '../../src/chain';
import * as dotenv from 'dotenv';
import { CoreConfig } from '../../src/core/CoreDeploy';

dotenv.config();

const rpc = process.env.POLYGON_RPC;
if (!rpc) {
  throw new Error('Missing RPC URI');
}

export const chainJson: ChainJson = {
  name: 'polygon',
  rpc,
  deployerKey: process.env.POLYGON_DEPLOYER_KEY,
  domain: 0x706f6c79, // b'poly' interpreted as an int
  gasPrice: '120000000000', // 120 gwei
};

export const chain = toChain(chainJson);

export const config: CoreConfig = {
  environment: 'prod-community',
  updater: '0xBD8F71581478e67cE512F980a29266d500EBEA79',
  // TODO set before launch
  recoveryTimelock: 60 * 60 * 24 * 7, // 14 days
  recoveryManager: '0x507B0CED6A8F435866C5C578Cc17C29e22307A0A',
  optimisticSeconds: 60 * 30, // 30 minutes
  watchers: ['0x68015B84182c71F9c2EE6C8061405D6F1f56314B'],
  // governor: {},
  processGas: 850_000,
  reserveGas: 15_000,
  homeAddress: '0x97bbda9A1D45D86631b243521380Bc070D6A4cBD',
  replicas: new Map<number, string>([
    [1667591279, '0x681Edb6d52138cEa8210060C309230244BcEa61b'],
  ]),
};
