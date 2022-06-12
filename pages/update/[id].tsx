import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import Layout from "../../src/components/Layout";
import {
  Box,
  Button,
  Center,
  Divider,
  Loader,
  NumberInput,
  Text,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useWeb3 } from "../../src/providers/Web3Provider";
import AssetSelect from "../../src/components/Inputs/AssetSelect";
import { tokenAddresses } from "../../src/constants/contractAddresses";
import AmountInput from "../../src/components/Inputs/AmountInput";
import PeriodSelect from "../../src/components/Inputs/PeriodSelect";
import StartTimeSelect from "../../src/components/Inputs/StartTimeSelect";
import SubmitTrustButton from "../../src/components/Buttons/SubmitTrustButton";

function getTomorrowDate() {
  return new Date(new Date().getTime() + 86400000);
}

const UpdatePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { trusts, updateTrust, depositToken, withdrawToken } = useWeb3();
  const trust = trusts?.find((it) => it.id === Number(id));

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

  useEffect(() => {
    if (!trust) return;
    console.log(trust);
    setFrequency(trust.frequency_in_days);
    setSelectedPeriod("days");
    setStartTime(new Date(trust.start_time * 1000));
    setSelectedTokens(trust.tokens.map((it: any) => it.symbol));
    setSelectedAmounts(
      Object.fromEntries(trust.tokens.map((it: any) => [it.symbol, it.amount]))
    );
    setSelectedInstallmentAmounts(
      Object.fromEntries(trust.tokens.map((it: any) => [it.symbol, it.amount]))
    );
  }, [trust]);

  const handleUpdate = async () => {
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
    if (!startTime || !trust) return;

    if (
      trust.start_time != Math.round(startTime.getTime() / 1000) ||
      trust.frequency_in_days != frequencyInDays
    ) {
      await updateTrust?.call(
        this,
        trust.id,
        Math.round(startTime.getTime() / 1000),
        frequencyInDays
      );
    }

    for (const [token, amount] of Object.entries(selectedAmounts)) {
      if (!Object.keys(selectedInstallmentAmounts).includes(token)) return;
      if (!Object.keys(tokenAddresses).includes(token)) return;
      // @ts-ignore
      const tokenAddress = tokenAddresses[token];
      const currentAmount =
        trust.tokens.find((it: any) => it.symbol === token)?.amount ?? 0;
      if (amount > currentAmount) {
        await depositToken?.call(
          this,
          trust.id,
          tokenAddress.address,
          amount * 10 ** 18 - currentAmount,
          selectedInstallmentAmounts[token] * 10 ** 18
        );
      } else if (amount < currentAmount) {
        await withdrawToken?.call(
          this,
          trust.id,
          tokenAddress.address,
          currentAmount - amount * 10 ** 18
        );
      }
    }
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: "100%", width: "400px" }}>
        <Text mt="md" sx={{ textAlign: "center", fontWeight: 300 }}>
          Update Trust #{id}
        </Text>
        {trusts === undefined && (
          <Center sx={{ marginTop: 100 }}>
            <Loader />
          </Center>
        )}
        {trust && (
          <>
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
              <StartTimeSelect
                startTime={startTime}
                setStartTime={setStartTime}
              />
              <SubmitTrustButton onClick={handleUpdate} isLoading={false} />
            </Box>
          </>
        )}
      </Box>
    </Layout>
  );
};

export default UpdatePage;
