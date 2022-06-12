import React, {FC} from 'react';
import {NativeSelect, TextInput} from '@mantine/core';

const data = [
    {value: 'days', label: 'Days'},
    {value: 'months', label: 'Months'},
    {value: 'years', label: 'Years'},
];

interface IPeriodSelect {
    selectedPeriod: 'days' | 'months' | 'years';
    frequency: number;
    setSelectedPeriod: React.Dispatch<React.SetStateAction<'days' | 'months' | 'years'>>
    setFrequency: React.Dispatch<React.SetStateAction<number>>
}

const PeriodSelect: FC<IPeriodSelect> = ({selectedPeriod, frequency, setSelectedPeriod, setFrequency}) => {

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
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.currentTarget.value as 'days' | 'months' | 'years')
            }
        />
    );

    return (
        <TextInput
            type="number"
            placeholder="How frequent?"
            // label="Select period"
            rightSection={select}
            rightSectionWidth={92}
            value={frequency}
            min={1}
            onChange={event => setFrequency(parseInt(event.currentTarget.value))}
        />
    );
}

export default PeriodSelect;
