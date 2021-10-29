/**
 * @prettier
 */
import * as utxolib from '@bitgo/utxo-lib';
import * as Bluebird from 'bluebird';
import * as request from 'superagent';
import { BitGo } from '../../bitgo';
import { BaseCoin } from '../baseCoin';
import { AbstractUtxoCoin, UtxoNetwork } from './abstractUtxoCoin';
import * as common from '../../common';
import { toBitgoRequest } from '../../api';

const co = Bluebird.coroutine;

export interface ZecTransactionBuilder {
  setVersion: (number) => void;
  setVersionGroupId: (number) => void;
  setConsensusBranchId: (number) => void;
}

export class Zec extends AbstractUtxoCoin {
  constructor(bitgo: BitGo, network?: UtxoNetwork) {
    super(bitgo, network || utxolib.networks.zcash);
  }

  static createInstance(bitgo: BitGo): BaseCoin {
    return new Zec(bitgo);
  }

  getChain() {
    return 'zec';
  }

  getFamily() {
    return 'zec';
  }

  getFullName() {
    return 'ZCash';
  }

  supportsBlockTarget() {
    return false;
  }

  /**
   *
   * @param txBuilder
   * @returns {*}
   */
  prepareTransactionBuilder(txBuilder: ZecTransactionBuilder): any {
    // sapling transaction version, see modules/utxo-lib/src/forks/zcash/version
    txBuilder.setVersion(4);
    txBuilder.setVersionGroupId(0x892f2085);
    // Use "Canopy" consensus branch https://zips.z.cash/zip-0251
    // https://bitgoinc.atlassian.net/browse/BG-26072
    txBuilder.setConsensusBranchId(0xe9ff75a6);
    return txBuilder;
  }

  recoveryBlockchainExplorerUrl(url: string) {
    return common.Environments[this.bitgo.getEnv()].zecExplorerBaseUrl + url;
  }

  getAddressInfoFromExplorer(addressBase58: string): Bluebird<{ txCount: number; totalBalance: number }> {
    const self = this;
    return co<{ txCount: number; totalBalance: number }>(function* getAddressInfoFromExplorer() {
      const addrInfo = yield toBitgoRequest(
        request.get(self.recoveryBlockchainExplorerUrl(`/addr/${addressBase58}`))
      ).result();

      (addrInfo as any).txCount = (addrInfo as any).txApperances;
      (addrInfo as any).totalBalance = (addrInfo as any).balanceSat;

      return addrInfo;
    }).call(this);
  }

  getUnspentInfoFromExplorer(addressBase58: string): Bluebird<{ address: string; amount: number; n: number }[]> {
    const self = this;
    return co<{ address: string; amount: number; n: number }[]>(function* getUnspentInfoFromExplorer() {
      const unspents = yield toBitgoRequest(
        request.get(self.recoveryBlockchainExplorerUrl(`/addr/${addressBase58}/utxo`))
      ).result();

      if (!unspents) {
        return [];
      }

      (unspents as any[]).forEach((unspent) => {
        unspent.amount = unspent.satoshis;
        unspent.n = unspent.vout;
      });

      return unspents;
    }).call(this);
  }
}
