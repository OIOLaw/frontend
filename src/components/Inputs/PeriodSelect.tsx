import React from 'react';
import { NativeSelect, TextInput } from '@mantine/core';

const data = [
    { value: 'days', label: 'Days' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
];

export function PeriodSelect() {
    // TODO: data validation
    // TODO: state
    const select = (
        <NativeSelect
            data={data}
            styles={{
                input: {
                    fontWeight: 500,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                },
            }}
        />
    );

    return (
        <TextInput
            type="text"
            placeholder="how frequent?"
            // label="Select period"
            rightSection={select}
            rightSectionWidth={92}
        />
    );
}
