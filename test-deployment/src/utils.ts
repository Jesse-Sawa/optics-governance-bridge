import * as types from "ethers";
import { Contract, ethers, Signer } from "ethers";

export type Address = string;

export type CallData = {
  to: Address;
  data: string;
};

function ethersAddressToBytes32(address: string): string {
  return ethers.utils
    .hexZeroPad(ethers.utils.hexStripZeros(address), 32)
    .toLowerCase();
}

export async function formatCall(
  destinationContract: Contract,
  functionStr: string,
  functionArgs: any[]
): Promise<CallData> {
  // Set up data for call message
  const callFunc = destinationContract.interface.getFunction(functionStr);
  const callDataEncoded = destinationContract.interface.encodeFunctionData(
    callFunc,
    functionArgs
  );

  return {
    to: ethersAddressToBytes32(destinationContract.address),
    data: callDataEncoded,
  };
}

export function encodeData(
  contract: Contract,
  functionName: string,
  args: any[]
): string {
  const func = contract.interface.getFunction(functionName);
  return contract.interface.encodeFunctionData(func, args);
}

// Send a transaction from the specified signer
export async function sendFromSigner(
  signer: types.Signer,
  contract: types.Contract,
  functionName: string,
  args: any[]
) {
  const data = encodeData(contract, functionName, args);

  return signer.sendTransaction({
    to: contract.address,

    //ethers.estimateGas() throws error

    //kovan
    // gasPrice: 50000000000,
    // gasLimit: 9000000,

    // polygon
    gasPrice: 4000000000000,
    gasLimit: 5000000,
    data,
  });
}
