import React, { FC } from 'react'
import {Box, Divider, Text} from "@mantine/core";
import {AssetSelect} from "../src/components/Inputs/AssetSelect";
import {PeriodSelect} from "../src/components/Inputs/PeriodSelect";
import StartTimeSelect from "../src/components/Inputs/StartTimeSelect";
import Layout from '../src/components/Layout';

const CreatePage: FC = () => {

    return (
        <Layout>
            <Text my="md" py="md" sx={{textAlign: "center"}}>
                Create Trust
            </Text>
            <Divider my="xs" label="Assets" labelPosition="center" />
            <Box my="md" py="md" sx={{textAlign: "left",
                // border: "1px solid lightgray"
            }}>
                <AssetSelect/>
            </Box>
            <Divider my="xs" label="Period" labelPosition="center" />
            <Box my="md" py="md" sx={{textAlign: "left"
                // , border: "1px solid lightgray"
            }}>
                <PeriodSelect/>
                <StartTimeSelect/>
            </Box>
        </Layout>
  );
};

export default CreatePage
