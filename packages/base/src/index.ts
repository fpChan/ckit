import { Transaction, Hash, OutPoint, HexNumber, ChainInfo, Output, HexString, Script, Address } from '@ckb-lumos/base';

export type ConnectStatus = 'disconnected' | 'connecting' | 'connected';

export interface WalletEventListener {
  (event: 'connectStatusChanged', listener: (status: ConnectStatus) => void): void;
  (event: 'signerChanged', listener: (signer: Signer) => void): void;
  (event: 'error', listener: (error?: unknown) => void): void;
}

export type BuiltinFeatures = 'issue-sudt' | 'acp';
export type WalletFeature = BuiltinFeatures | string;

export interface WalletDescriptor {
  readonly name: string;
  readonly description: string;
  readonly features: WalletFeature[];
}

export interface WalletConnector {
  connect(): void;
  disconnect(): void;
  on: WalletEventListener;
}

export interface Signer {
  getAddress(): Promise<string>;
  signMessage(message: HexString): Promise<HexString>;
}

export interface TransactionBuilder {
  build(): Promise<Transaction>;
}

export type CkbTypeScript = Script;

export type ResolvedOutpoint = {
  block_number: HexNumber;
  out_point: OutPoint;
  output: Output;
  output_data: HexString;
  tx_index: HexNumber;
};

export interface Provider {
  /**
   * check a node is mainnet or testnet
   */
  getChainInfo(): Promise<ChainInfo>;

  /**
   * collect free capacity
   * @param lock
   * @param capacity
   */
  collectCkbLiveCell(lock: Address, capacity: HexNumber): Promise<ResolvedOutpoint[]>;

  /**
   * send a signed transaction to a ckb node
   * @param tx
   */
  sendTransaction(tx: Transaction): Promise<Hash>;

  /**
   * parse a lock script to an address
   * @param script
   * @see https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0021-ckb-address-format/0021-ckb-address-format.md
   */
  parseToAddress(script: Script): string;
}

export { AbstractProvider } from './AbstractProvider';
export { AbstractWallet } from './AbstractWallet';