import React, { useState } from 'react';
import { MultiSelect } from '@mantine/core';

export function AssetSelect() {
    // TODO: state
    // TODO: display AmountInput component for every field Selected

    const [fields, setFields] = useState(['WETH', 'DAI', 'USDC']);

    return (
        <MultiSelect
            placeholder="Select assets"
            data={fields}
            searchable
            creatable={false}
            nothingFound="Nothing found..."
        />
    );
}
