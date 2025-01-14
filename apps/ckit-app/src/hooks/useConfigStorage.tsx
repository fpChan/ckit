import { CkitInitOptions, predefined } from '@ckit/ckit';
import { useLocalStorage } from '@rehooks/local-storage';
import { useMemo } from 'react';

export interface LocalConfig {
  ckitConfig: CkitInitOptions;
  mecuryRPC: string;
  ckbRPC: string;
  nervosExploreTxUrlPrefix: string;
  nervosExploreAddressUrlPrefix: string;
  nervosExploreSudtUrlPrefix: string;
}

// TODO remove random when predefined config is ready
export function useConfigStorage(): [LocalConfig, (newValue: LocalConfig) => void, () => void] {
  const initialConfig = useMemo<LocalConfig>(() => {
    // TODO check network first
    const ckitConfig: CkitInitOptions = predefined.Aggron;
    const mecuryRPC = 'https://testnet.ckb.dev/indexer';
    const ckbRPC = 'https://testnet.ckb.dev/rpc';
    const nervosExploreTxUrlPrefix = 'https://explorer.nervos.org/aggron/transaction/';
    const nervosExploreAddressUrlPrefix = 'https://explorer.nervos.org/aggron/address/';
    const nervosExploreSudtUrlPrefix = 'https://explorer.nervos.org/aggron/sudt/';
    return {
      ckitConfig: ckitConfig,
      mecuryRPC: mecuryRPC,
      ckbRPC: ckbRPC,
      nervosExploreTxUrlPrefix: nervosExploreTxUrlPrefix,
      nervosExploreAddressUrlPrefix: nervosExploreAddressUrlPrefix,
      nervosExploreSudtUrlPrefix: nervosExploreSudtUrlPrefix,
    };
  }, []);

  return useLocalStorage<LocalConfig>('localConfig', initialConfig);
}
