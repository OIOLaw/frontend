import { NextPage } from "next";
import { useRouter } from "next/router";
import React, {FC, useEffect, useState} from "react";
import dayjs from 'dayjs';
import Layout from "../../src/components/Layout";
import {Box, Button, Divider, NumberInput, Text} from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import {useWeb3} from "../../src/providers/Web3Provider";
import AssetSelect from "../../src/components/Inputs/AssetSelect";
import AmountInput from "../../src/components/Inputs/AmountInput";
import PeriodSelect from "../../src/components/Inputs/PeriodSelect";
import StartTimeSelect from "../../src/components/Inputs/StartTimeSelect";
import SubmitTrustButton from "../../src/components/Buttons/SubmitTrustButton";

function getTomorrowDate(){
    return new Date(new Date().getTime() + 86400000)
}

const UpdatePage : NextPage = () => {

    const [selectedTokens, setSelectedTokens] = useState(['']);
    const [selectedPeriod, setSelectedPeriod] = useState<'days' | 'months' | 'years'>('days');
    const [frequency, setFrequency] = useState<number>(1);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [selectedAmounts, setSelectedAmounts] = useState<{ [token: string]: number } | {}>({});
    const [currentAmounts, setCurrentAmounts] = useState<{ [token: string]: number } | {}>({});

  const router = useRouter();
  const { id } = router.query;
  // let { trusts } = useWeb3();
    // console.log(trusts);

    const trusts = [
        {
            "id": "1",
        "description":"OIOTrust, tokens held: \n- MyToken amount: 1000000000000000000 (decimals 18)\n",
        "name":"OIOTrust NFT #1",
        "image":"data:image/svg;base64,",
        "background_color":"ffffff",
        "creator":"0xd0eb99adadda1022804256f378ab2cbf39afee6b",
        "start_time":1000914745219200,
        "frequency_in_days":1,
        "installments_paid":0,
        "tokens":[
            {
                "name":"WETH",
                "amount":10000000000000,
                "decimals":18
            }
        ]
    }
    ]

    useEffect(() => {
        trusts?.filter((metadata) => metadata?.id === id)
            .map((metadata) => {
                console.log(metadata);
                setFrequency(metadata.frequency_in_days);
                setStartTime(new Date(metadata.start_time));
                setSelectedTokens(metadata.tokens.flatMap((token: any) => token.name))
                metadata.tokens.map((token: any) =>
                    setCurrentAmounts({...selectedAmounts, [token.name]: parseInt(token.amount)})
                )
            })
    }, [])



  return (
      <Layout>
          <Text mt="md"  sx={{textAlign: "center", fontWeight: 300}}>
              Update Trust
          </Text>

          {/*<Divider my="xs" label="Assets" labelPosition="center"/>*/}
          <Box mb="md" py="md">
              <AssetSelect selectedTokens={selectedTokens} setSelectedTokens={setSelectedTokens}/>
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
              <PeriodSelect selectedFrequency={frequency} selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} setFrequency={setFrequency}/>
              <StartTimeSelect startTime={startTime} setStartTime={setStartTime}/>
              <SubmitTrustButton  isLoading={false} buttonText={"Update Trust"}/>
          </Box>

      </Layout>);


};

export default UpdatePage;
