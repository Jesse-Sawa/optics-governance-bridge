import * as alfajores from '../../config/testnets/alfajores';
import * as kovan from '../../config/testnets/kovan';
import { CoreDeploy } from '../../src/core/CoreDeploy';
import { deployGovernanceBridgeOnTwoChains } from '../../src/core/governanceBridgeDeployment';

let alfaConfig = alfajores.devConfig;
let kovanConfig = kovan.devConfig;

const alfaDeploy = new CoreDeploy(alfajores.chain, alfaConfig);
const kovanDeploy = new CoreDeploy(kovan.chain, kovanConfig);

deployGovernanceBridgeOnTwoChains(kovanDeploy, alfaDeploy);
