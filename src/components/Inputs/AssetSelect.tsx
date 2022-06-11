import React, {FC, useState} from 'react';
import { MultiSelect } from '@mantine/core';

interface IAssetSelect {
    setSelectedTokens: React.Dispatch<React.SetStateAction<string[]>>
}
const AssetSelect: FC<IAssetSelect> = ({ setSelectedTokens }) => {
    // TODO: state
    // TODO: display AmountInput component for every field Selected

    return (
        <MultiSelect
            placeholder="Select assets"
            data={['WETH', 'DAI', 'USDC']}
            searchable
            creatable={false}
            nothingFound="Nothing found..."
            onChange={setSelectedTokens}
        />
    );
}

export default AssetSelect;
