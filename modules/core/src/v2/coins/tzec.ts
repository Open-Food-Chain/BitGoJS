import { BitGo } from '../../bitgo';
import { BaseCoin } from '../baseCoin';
import { Zec, ZecTransactionBuilder } from './zec';
import * as utxolib from '@bitgo/utxo-lib';

export class Tzec extends Zec {
  constructor(bitgo: BitGo) {
    super(bitgo, utxolib.networks.zcashTest);
  }

  static createInstance(bitgo: BitGo): BaseCoin {
    return new Tzec(bitgo);
  }

  getChain() {
    return 'tzec';
  }

  getFullName() {
    return 'Testnet ZCash';
  }

  /**
   * Set up default parameters to send a Zcash Sapling compatible transaction
   * @param txBuilder
   * @returns {*}
   */
  prepareTransactionBuilder(txBuilder: ZecTransactionBuilder): any {
    txBuilder.setVersion(4);
    txBuilder.setVersionGroupId(0x892f2085);
    // Use "Canopy" consensus branch ID https://zips.z.cash/zip-0251
    txBuilder.setConsensusBranchId(0xe9ff75a6);
    return txBuilder;
  }
}
