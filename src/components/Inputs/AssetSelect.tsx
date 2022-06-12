import React, { FC, useState } from "react";
import { MultiSelect } from "@mantine/core";

interface IAssetSelect {
  selectedTokens: string[];
  setSelectedTokens: React.Dispatch<React.SetStateAction<string[]>>;
}
const AssetSelect: FC<IAssetSelect> = ({
  selectedTokens,
  setSelectedTokens,
}) => {

    return (
        <MultiSelect
            placeholder="Select assets"
            data={['wETH','wBTC', 'DAI', 'USDC', 'MATIC', 'UNI', 'MAKER']}
            searchable={true}
            nothingFound="Nothing found..."
            onChange={setSelectedTokens}
            clearButtonLabel="Clear selection"
        />
    );
}

export default AssetSelect;
