import React, {FC, useEffect, useState} from 'react'
import {Box, Button, Divider, Grid, Text} from "@mantine/core";
import AssetSelect from "../src/components/Inputs/AssetSelect";
import PeriodSelect from "../src/components/Inputs/PeriodSelect";
import StartTimeSelect from "../src/components/Inputs/StartTimeSelect";
import Layout from '../src/components/Layout';
import AmountInput from "../src/components/Inputs/AmountInput";
import SubmitTrustButton from "../src/components/Buttons/SubmitTrustButton";

const CreatePage: FC = () => {
    const [selectedTokens, setSelectedTokens] = useState(['']);
    const [selectedPeriod, setSelectedPeriod] = useState<'days' | 'months' | 'years'>('days');
    const [frequency, setFrequency] = useState<number>(1);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [selectedAmounts, setSelectedAmounts] = useState<{ [token: string]: number } | {}>({});

    return (
        <Layout>
            <Text mt="md"  sx={{textAlign: "center", fontWeight: 300}}>
                Create Trust
            </Text>
            {/*<Divider my="xs" label="Assets" labelPosition="center"/>*/}
            <Box mb="md" py="md">
                <AssetSelect setSelectedTokens={setSelectedTokens}/>
                {selectedTokens.map(selectedToken => {
                        return selectedToken &&
                            <AmountInput selectedAmounts={selectedAmounts} setSelectedAmounts={setSelectedAmounts}
                                         selectedToken={selectedToken} key={selectedToken}/>
                    }
                )
                }
            </Box>
            <Divider my="xs" label="Period" labelPosition="center"/>
            <Box my="md" py="md">
                <PeriodSelect setSelectedPeriod={setSelectedPeriod} setFrequency={setFrequency}/>
                <StartTimeSelect startTime={startTime} setStartTime={setStartTime}/>
                <SubmitTrustButton  isLoading={false}/>
            </Box>
        </Layout>
    );
};

export default CreatePage
