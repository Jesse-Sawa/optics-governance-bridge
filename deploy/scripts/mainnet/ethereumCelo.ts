import * as celo from '../../config/mainnets/celo';
import * as ethereum from '../../config/mainnets/ethereum';
import { CoreDeploy } from '../../src/core/CoreDeploy';
import { deployGovernanceBridgeOnTwoChains } from '../../src/core/governanceBridgeDeployment';

let celoConfig = celo.config;
let ethereumConfig = ethereum.config;

const celoDeploy = new CoreDeploy(celo.chain, celoConfig);
const ethereumDeploy = new CoreDeploy(ethereum.chain, ethereumConfig);

deployGovernanceBridgeOnTwoChains(ethereumDeploy, celoDeploy);
