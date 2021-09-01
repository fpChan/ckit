import { Address, Script } from '@ckb-lumos/base';
import { Builder, CellDep, WitnessArgs } from '@lay2/pw-core';
import { SerializeRcLockWitnessLock } from '../../tx-builders/generated/rc-lock';
import { Pw } from '../../helpers/pw';
import { CkitConfigKeys, CkitProvider } from '../../providers';
import { boom } from '../../utils';
import {Reader} from "@lay2/pw-core/build/main/ckb-js-toolkit/reader";
// TODO uncomment me when ran in Aggron or Mainnet
// import { getCellDeps } from '../unipass/config';

export abstract class AbstractPwSenderBuilder extends Builder {
  protected constructor(protected readonly provider: CkitProvider) {
    super(Number(provider.config.MIN_FEE_RATE));
  }

  // TODO refactor to ConfigManager
  protected getCellDeps(_scripts?: Script[]): CellDep[] {
    return [
      Pw.toPwCellDep(this.provider.getCellDep('SUDT')),
      Pw.toPwCellDep(this.provider.getCellDep('ANYONE_CAN_PAY')),
      Pw.toPwCellDep(this.provider.getCellDep('PW_NON_ANYONE_CAN_PAY')),
      Pw.toPwCellDep(this.provider.getCellDep('PW_ANYONE_CAN_PAY')),
      Pw.toPwCellDep(this.provider.getCellDep('SECP256K1_BLAKE160')),
      Pw.toPwCellDep(this.provider.getCellDep('RC_LOCK')),
      // TODO uncomment me when ran in Aggron or Mainnet
      // ...getCellDeps(),
    ];
  }

  // TODO refactor to ConfigManager
  protected getWitnessPlaceholder(address: string): WitnessArgs {
    const isTemplateOf = (key: CkitConfigKeys, address: Address): boolean => {
      const script = this.provider.parseToScript(address);
      const scriptConfig = this.provider.getScriptConfig(key);

      return scriptConfig.CODE_HASH === script.code_hash && scriptConfig.HASH_TYPE === script.hash_type;
    };

    if (isTemplateOf('SECP256K1_BLAKE160', address)) {
      return {
        lock: '0x' + '0'.repeat(130),
        input_type: '',
        output_type: '',
      };
    }

    if (isTemplateOf('PW_NON_ANYONE_CAN_PAY', address)) {
      return {
        lock: '0x' + '0'.repeat(132),
        input_type: '',
        output_type: '',
      };
    }

    if (isTemplateOf('PW_NON_ANYONE_CAN_PAY', address)) {
      return {
        lock: '0x' + '0'.repeat(132),
        input_type: '',
        output_type: '',
      };
    }

    if (isTemplateOf('ANYONE_CAN_PAY', address)) {
      return {
        lock: '0x' + '0'.repeat(130),
        input_type: '',
        output_type: '',
      };
    }
    if (isTemplateOf('RC_LOCK', address)) {
      const params = {
        signature: new Reader('0x' +'0'.repeat(130)),
      };
      const data =  buf2hex(SerializeRcLockWitnessLock(params));
      console.log(`witness is ${data}`);
      return {
        lock: '0x' + '0'.repeat(data.length),
        input_type: '',
        output_type: '',
      };
    }

    if (isTemplateOf('UNIPASS', address)) {
      return {
        lock: '0x' + '0'.repeat(2082),
        input_type: '',
        output_type: '',
      };
    }

    boom(`Unsupported lock ${address}`);
  }
}
function buf2hex(buffer: ArrayBuffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('');
}
