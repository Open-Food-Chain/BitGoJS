import should from 'should';
import BigNum from 'bn.js';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import { register } from '../../../../../src/index';
import { TransactionBuilderFactory } from '../../../../../src/coin/stx';
import * as testData from '../../../../resources/stx/stx';
import { TransactionType } from '../../../../../src/coin/baseCoin';

describe('Stx Contract call Builder', () => {
  const factory = register('stx', TransactionBuilderFactory);

  const initTxBuilder = () => {
    const txBuilder = factory.getContractBuilder();
    txBuilder.fee({ fee: '180' });
    txBuilder.nonce(0);
    txBuilder.contractAddress(testData.CONTRACT_ADDRESS);
    txBuilder.contractName(testData.CONTRACT_NAME);
    txBuilder.functionName(testData.CONTRACT_FUNCTION_NAME);
    return txBuilder;
  };

  describe('should build ', () => {
    it('an unsigned contract call transaction', async () => {
      const builder = initTxBuilder();
      builder.functionArgs([
        { type: 'uint128', val: '400000000' },
        { type: 'principal', val: testData.ACCOUNT_2.address },
        { type: 'uint128', val: '200' },
        {
          type: 'tuple',
          val: [
            { key: 'hashbytes', type: 'buffer', val: Buffer.from('some-hash') },
            { key: 'version', type: 'buffer', val: new BigNum(1).toBuffer() },
          ],
        },
      ]);
      builder.fromPubKey(testData.TX_SENDER.pub);
      builder.numberSignatures(1);
      const tx = await builder.build();

      const txJson = tx.toJson();
      should.deepEqual(txJson.payload.contractAddress, testData.CONTRACT_ADDRESS);
      should.deepEqual(txJson.payload.contractName, testData.CONTRACT_NAME);
      should.deepEqual(txJson.payload.functionName, testData.CONTRACT_FUNCTION_NAME);
      should.deepEqual(txJson.nonce, 0);
      should.deepEqual(txJson.fee.toString(), '180');
      should.deepEqual(tx.toBroadcastFormat(), testData.UNSIGNED_CONTRACT_CALL);

      tx.type.should.equal(TransactionType.ContractCall);
      tx.outputs.length.should.equal(1);
      tx.outputs[0].address.should.equal(testData.CONTRACT_ADDRESS);
      tx.outputs[0].value.should.equal('0');
      tx.inputs.length.should.equal(1);
      tx.inputs[0].address.should.equal(testData.TX_SENDER.address);
      tx.inputs[0].value.should.equal('0');
    });

    it('a signed contract call with args', async () => {
      const builder = initTxBuilder();
      builder.functionArgs([
        { type: 'uint128', val: '400000000' },
        { type: 'principal', val: testData.ACCOUNT_2.address },
        { type: 'uint128', val: '200' },
        {
          type: 'tuple',
          val: [
            { key: 'hashbytes', type: 'buffer', val: Buffer.from('some-hash') },
            { key: 'version', type: 'buffer', val: new BigNum(1).toBuffer() },
          ],
        },
      ]);
      builder.sign({ key: testData.TX_SENDER.prv });
      const tx = await builder.build();

      const txJson = tx.toJson();
      should.deepEqual(txJson.payload.contractAddress, testData.CONTRACT_ADDRESS);
      should.deepEqual(txJson.payload.contractName, testData.CONTRACT_NAME);
      should.deepEqual(txJson.payload.functionName, testData.CONTRACT_FUNCTION_NAME);
      should.deepEqual(txJson.nonce, 0);
      should.deepEqual(txJson.fee.toString(), '180');
      should.deepEqual(tx.toBroadcastFormat(), testData.SIGNED_CONTRACT_WITH_ARGS);

      tx.type.should.equal(TransactionType.ContractCall);
      tx.outputs.length.should.equal(1);
      tx.outputs[0].address.should.equal(testData.CONTRACT_ADDRESS);
      tx.outputs[0].value.should.equal('0');
      tx.inputs.length.should.equal(1);
      tx.inputs[0].address.should.equal(testData.TX_SENDER.address);
      tx.inputs[0].value.should.equal('0');
    });

    it('a signed contract call transaction', async () => {
      const builder = initTxBuilder();
      builder.functionArgs([{ type: 'int128', val: '123' }]);
      builder.sign({ key: testData.TX_SENDER.prv });
      const tx = await builder.build();

      const txJson = tx.toJson();
      should.deepEqual(txJson.payload.contractAddress, testData.CONTRACT_ADDRESS);
      should.deepEqual(txJson.payload.contractName, testData.CONTRACT_NAME);
      should.deepEqual(txJson.payload.functionName, testData.CONTRACT_FUNCTION_NAME);
      should.deepEqual(txJson.nonce, 0);
      should.deepEqual(txJson.fee.toString(), '180');
      should.deepEqual(tx.toBroadcastFormat(), testData.SIGNED_CONTRACT_CALL);
      tx.type.should.equal(TransactionType.ContractCall);
    });

    it('a signed serialized contract call transaction', async () => {
      const builder = factory.from(testData.SIGNED_CONTRACT_CALL);
      const tx = await builder.build();
      const txJson = tx.toJson();
      should.deepEqual(txJson.payload.contractAddress, testData.CONTRACT_ADDRESS);
      should.deepEqual(txJson.payload.contractName, testData.CONTRACT_NAME);
      should.deepEqual(txJson.payload.functionName, testData.CONTRACT_FUNCTION_NAME);
      should.deepEqual(txJson.nonce, 0);
      should.deepEqual(txJson.fee.toString(), '180');
      should.deepEqual(tx.toBroadcastFormat(), testData.SIGNED_CONTRACT_CALL);
      tx.type.should.equal(TransactionType.ContractCall);
      tx.outputs.length.should.equal(1);
      tx.outputs[0].address.should.equal(testData.CONTRACT_ADDRESS);
      tx.outputs[0].value.should.equal('0');
      tx.inputs.length.should.equal(1);
      tx.inputs[0].address.should.equal(testData.TX_SENDER.address);
      tx.inputs[0].value.should.equal('0');
    });

    it('a multisig transfer transaction', async () => {
      const builder = initTxBuilder();
      builder.functionArgs([{ type: 'int128', val: '123' }]);
      builder.network(new StacksTestnet());

      builder.sign({ key: testData.prv1 });
      builder.sign({ key: testData.prv2 });
      builder.fromPubKey([testData.pub1, testData.pub2, testData.pub3]);
      builder.numberSignatures(2);
      const tx = await builder.build();
      should.deepEqual(tx.toBroadcastFormat(), testData.MULTI_SIG_CONTRACT_CALL);
    });

    describe('should fail', () => {
      it('a contract call with an invalid key', () => {
        const builder = initTxBuilder();
        should.throws(
          () => builder.sign({ key: 'invalidKey' }),
          (e) => e.message === 'Unsupported private key',
        );
      });
      it('a contract call with an invalid contract address', () => {
        const builder = initTxBuilder();
        builder.network(new StacksMainnet());
        should.throws(
          () => builder.contractAddress(testData.ACCOUNT_1.address),
          (e) => e.message === 'Invalid contract address',
        );
      });
      it('a contract call with an invalid contract name', () => {
        const builder = initTxBuilder();
        should.throws(
          () => builder.contractName('test'),
          (e) => e.message === 'Only pox contract supported',
        );
      });
      it('a contract call with an invalid contract function name', () => {
        const builder = initTxBuilder();
        should.throws(
          () => builder.functionName('test-function'),
          (e) => e.message === 'test-function is not supported contract function name',
        );
      });
    });
  });
});
