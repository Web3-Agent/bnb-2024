import { ethers } from 'ethers';
import Web3 from 'web3';

export const signMessage = async (provider) => {
  try {
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    const signature = await web3.eth.personal.sign(
      'hello-world',
      accounts[0],
      ''
    );
    return signature;
  } catch (error) {
    console.error(error);
  }
};

export const convertToInt = (amount, decimal) => {
  try {
    const _amount = !amount ? '0' : amount;
    const result = ethers.utils.formatUnits(_amount.toString(), decimal);
    return result;
  } catch (e) {
    console.log(e, 'error');
  }
};
