import { Empty, Typography } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { AssetList } from 'components/Assets';
import { StyledCardWrapper } from 'components/Styled';
import { WalletContainer } from 'containers/WalletContainer';

export const AssetsView: React.FC = observer(() => {
  const { selectedWallet } = WalletContainer.useContainer();
  const showAssetList = selectedWallet?.signer;
  return (
    <div>
      <StyledCardWrapper>
        <div style={{ marginBottom: '12px' }}>
          <Typography.Title level={3}> Assets </Typography.Title>
        </div>
        <div>
          {showAssetList && <AssetList />}
          {!showAssetList && <Empty />}
        </div>
      </StyledCardWrapper>
    </div>
  );
});
