import React, {FC, useState} from 'react'
import {Box, Text} from "@mantine/core";
import { TextInput, createStyles } from '@mantine/core';
import {string} from "prop-types";
import {useValidatedState} from "@mantine/hooks";


interface IAmountInput {
    selectedToken: string
    setSelectedAmounts: React.Dispatch<React.SetStateAction<{ [token:string]: number } | {}>>
    selectedAmounts: { [token:string]: number } | {}
}

const AmountInput: FC<IAmountInput> = ({selectedToken,setSelectedAmounts, selectedAmounts }) => {
    return (
        <Box style={{ marginTop: 10 }}>
            <TextInput
                placeholder={`${selectedToken} amount`}
                required
                onChange={(event) => (setSelectedAmounts({...selectedAmounts, [selectedToken]: parseInt(event.currentTarget.value)}))}
                mt="md"
                autoComplete="nope"
                rightSection={(<Box pr='lg'> {selectedToken} </Box>)}
                rightSectionWidth={50}
                type={"number"}
            />
        </Box>
    );
};

export default AmountInput
