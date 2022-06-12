import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";
import dayjs from 'dayjs';
import Layout from "../../src/components/Layout";
import {Button, NumberInput} from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import {useWeb3} from "../../src/providers/Web3Provider";

function getTomorrowDate(){
    return new Date(new Date().getTime() + 86400000)
}

const UpdatePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const {
        trusts,
    } = useWeb3();
    console.log(trusts);
  return (
      <Layout>
          <a>UPDATE TRUST {id}</a>
          {trusts?.filter((metadata) => metadata?.id == id)
              .map((metadata, i) => (
                  metadata.tokens.map((token: any, i: number) => (
                      <>
                          <a>token.name</a>
                          <NumberInput
                              defaultValue={token.amount}
                              placeholder="Select amount for this trust"
                              label="Amount"
                              required
                              onChange={() => {}}
                              min={0}
                              max={10000000}
                              hideControls
                          />
                          <NumberInput
                              defaultValue={metadata.frequency_in_days}
                              placeholder="Select amount of Installments for this trust"
                              label="Installments"
                              required
                              onChange={() => {}}
                              min={1}
                              max={100000}
                              hideControls
                          />
                          <DatePicker
                              label="Start date"
                              placeholder="Pick start date"
                              value={metadata.start_time}
                              onChange={() => {}}
                              minDate={getTomorrowDate()}
                              required
                          />
                          <Button onClick={() => {}}>
                              {/* TODO implement save */}
                              <a>Update</a>
                          </Button>

                      </>
                  )))
              )
          }

      </Layout>);


};

export default UpdatePage;
