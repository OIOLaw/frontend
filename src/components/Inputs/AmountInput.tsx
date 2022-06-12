import React, {FC, useState} from 'react'
import {Box, Text, Image} from "@mantine/core";
import { TextInput, createStyles } from '@mantine/core';
import {string} from "prop-types";
import {useValidatedState} from "@mantine/hooks";
import {tokenAddresses} from "../../constants/contractAddresses";


interface IAmountInput {
    selectedToken: string;
    setSelectedAmounts: React.Dispatch<React.SetStateAction<{ [token:string]: number } | {}>>;
    selectedAmounts: { [token:string]: number } | {};
    installment?: boolean;
}

const AmountInput: FC<IAmountInput> = ({selectedToken, setSelectedAmounts, selectedAmounts, installment }) => {
    return (
        <Box style={{ marginTop: 10 }}>
            <TextInput
                placeholder={installment ? `${selectedToken} total amount` : `${selectedToken} amount per installment`}
                required
                onChange={(event) => (setSelectedAmounts({...selectedAmounts, [selectedToken]: parseInt(event.currentTarget.value)}))}
                mt="md"
                autoComplete="nope"
                rightSection={(<Image sx={{borderRadius:'25px'}} mr='lg' alt={selectedToken} src={tokenAddresses[selectedToken].image}/>)}
                rightSectionWidth={40}
                type={"number"}
            />
        </Box>
    );
};

export default AmountInput
