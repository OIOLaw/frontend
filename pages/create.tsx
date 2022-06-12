import React, { FC, useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Text, TextInput } from "@mantine/core";
import AssetSelect from "../src/components/Inputs/AssetSelect";
import PeriodSelect from "../src/components/Inputs/PeriodSelect";
import StartTimeSelect from "../src/components/Inputs/StartTimeSelect";
import Layout from "../src/components/Layout";
import AmountInput from "../src/components/Inputs/AmountInput";
import SubmitTrustButton from "../src/components/Buttons/SubmitTrustButton";
import { useWeb3 } from "../src/providers/Web3Provider";
import { tokenAddresses } from "../src/constants/contractAddresses";

const CreatePage: FC = () => {
  const { createTrust, depositToken } = useWeb3();
  const [selectedTokens, setSelectedTokens] = useState([""]);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "days" | "months" | "years"
  >("days");
  const [frequency, setFrequency] = useState<number>(1);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [selectedAmounts, setSelectedAmounts] = useState<{
    [token: string]: number;
  }>({});
  const [selectedInstallmentAmounts, setSelectedInstallmentAmounts] = useState<{
    [token: string]: number;
  }>({});
  const [recipient, setRecipient] = useState("");

  const handleCreate = async () => {
    let frequencyInDays = 0;
    switch (selectedPeriod) {
      case "days":
        frequencyInDays = frequency;
        break;
      case "months":
        frequencyInDays = frequency * 30;
        break;
      case "years":
        frequencyInDays = frequency * 365;
        break;
      default:
        return;
    }
    if (!startTime) return;

    const trustId = await createTrust?.call(
      this,
      recipient,
      Math.round(startTime.getTime() / 1000),
      frequencyInDays
    );
    if (!trustId) return;

    for (const [token, amount] of Object.entries(selectedAmounts)) {
      if (!Object.keys(selectedInstallmentAmounts).includes(token)) return;
      if (!Object.keys(tokenAddresses).includes(token)) return;
      // @ts-ignore
      const tokenAddress = tokenAddresses[token];

      await depositToken?.call(
        this,
        trustId,
        tokenAddress.address,
        amount * 10 ** 18,
        selectedInstallmentAmounts[token] * 10 ** 18
      );
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: "100%", width: "400px" }}>
        <Text mt="md" sx={{ textAlign: "center", fontWeight: 300 }}>
          Create Trust
        </Text>
        {/*<Divider my="xs" label="Assets" labelPosition="center"/>*/}
        <Box mb="md" py="md">
          <AssetSelect
            selectedTokens={selectedTokens}
            setSelectedTokens={setSelectedTokens}
          />
          {selectedTokens.map((selectedToken) => {
            return (
              selectedToken && (
                <>
                  <AmountInput
                    selectedAmounts={selectedAmounts}
                    setSelectedAmounts={setSelectedAmounts}
                    selectedToken={selectedToken}
                    key={selectedToken + "_amount"}
                  />
                  <AmountInput
                    installment
                    selectedAmounts={selectedInstallmentAmounts}
                    setSelectedAmounts={setSelectedInstallmentAmounts}
                    selectedToken={selectedToken}
                    key={selectedToken + "_installment"}
                  />
                </>
              )
            );
          })}
        </Box>
        <Divider my="xs" label="Period" labelPosition="center" />
        <Box my="md" py="md">
          <PeriodSelect
            selectedPeriod={selectedPeriod}
            frequency={frequency}
            setSelectedPeriod={setSelectedPeriod}
            setFrequency={setFrequency}
          />
          <StartTimeSelect startTime={startTime} setStartTime={setStartTime} />
        </Box>
        <Divider my="xs" label="Recipient" labelPosition="center" />
        <Box my="md" py="md">
          <TextInput
            type="text"
            placeholder="Recipient address"
            onChange={(event) => setRecipient(event.currentTarget.value)}
          />
          <SubmitTrustButton onClick={handleCreate} isLoading={false} />
        </Box>
      </Box>
    </Layout>
  );
};

export default CreatePage;
