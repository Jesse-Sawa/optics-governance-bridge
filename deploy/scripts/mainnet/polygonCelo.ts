import * as celo from '../../config/mainnets/celo';
import * as polygon from '../../config/mainnets/polygon';
import { CoreDeploy } from '../../src/core/CoreDeploy';
import { deployGovernanceBridgeOnTwoChains } from '../../src/core/governanceBridgeDeployment';

let celoConfig = celo.config;
let polygonConfig = polygon.config;

const celoDeploy = new CoreDeploy(celo.chain, celoConfig);
const polygonDeploy = new CoreDeploy(polygon.chain, polygonConfig);

deployGovernanceBridgeOnTwoChains(polygonDeploy, celoDeploy);
