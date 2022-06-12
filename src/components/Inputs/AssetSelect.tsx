import React, {FC, useState} from 'react';
import { MultiSelect } from '@mantine/core';

interface IAssetSelect {
    setSelectedTokens: React.Dispatch<React.SetStateAction<string[]>>
    selectedTokens?: string[]
}
const AssetSelect: FC<IAssetSelect> = ({ selectedTokens, setSelectedTokens }) => {

    return (
        <MultiSelect
            placeholder="Select assets"
            data={['WETH', 'DAI', 'USDC']}
            searchable
            creatable={false}
            nothingFound="Nothing found..."
            onChange={setSelectedTokens}
            value={selectedTokens}
        />
    );
}

export default AssetSelect;
