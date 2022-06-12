import React, {FC} from 'react';
import {NativeSelect, TextInput} from '@mantine/core';

const data = [
    {value: 'days', label: 'Days'},
    {value: 'months', label: 'Months'},
    {value: 'years', label: 'Years'},
];

interface IPeriodSelect {
    setSelectedPeriod: React.Dispatch<React.SetStateAction<'days' | 'months' | 'years'>>
    setFrequency: React.Dispatch<React.SetStateAction<number>>
    selectedFrequency?: number
    selectedPeriod?: string
}

const PeriodSelect: FC<IPeriodSelect> = ({setSelectedPeriod, setFrequency, selectedFrequency, selectedPeriod}) => {

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
            onChange={(event) => setSelectedPeriod(event.currentTarget.value as 'days' | 'months' | 'years')
            }
            value={selectedPeriod}
            defaultValue={'days'}
        />
    );

    return (
        <TextInput
            type="text"
            placeholder="How frequent?"
            // label="Select period"
            rightSection={select}
            rightSectionWidth={92}
            onChange={event => setFrequency(parseInt(event.currentTarget.value))}
            value={selectedFrequency}
        />
    );
}

export default PeriodSelect;
