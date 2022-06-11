import {
  Box,
  Button,
  Card,
  Grid,
  RingProgress,
  Table,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { useWeb3 } from "../providers/Web3Provider";

const TrustItem: FC<{ metadata: any }> = ({ metadata }) => {
  return (
    <Card mb="lg" shadow="sm" p="0">
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flex: "1" }}>
          <Box p="lg">
            <Title>Trust ID #{metadata.id}</Title>
            <Text>
              Start time: {new Date(metadata.start_time).toLocaleString()}
            </Text>
            <Text>
              Installment frequency: {metadata.frequency_in_days} days
            </Text>
          </Box>
          <Table ml="sm" mr="lg" mb="lg">
            <tbody>
              {metadata.tokens.map((token: any, i: number) => (
                <tr key={i}>
                  <td>{token.name}</td>
                  <td>
                    {token.amount / Math.pow(10, token.decimals)} {token.ticker}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
        <Box p="lg">
          <RingProgress
            label={
              <Text size="xs" align="center">
                Allocation
              </Text>
            }
            sections={metadata.tokens.map((token: any, i: number) => ({
              value: token.amount,
              color: ["orange", "cyan", "green", "red", "violet"][i % 5],
            }))}
          />
          <Link href={`/update/${metadata.id}`} passHref>
            <Button component="a" variant="light" mt="lg">
              Update trust
            </Button>
          </Link>
        </Box>
      </Box>
    </Card>
  );
};

export default TrustItem;
