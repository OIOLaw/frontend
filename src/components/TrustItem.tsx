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
import AddressDisplay from "./AddressDisplay";

const TrustItem: FC<{ metadata: any }> = ({ metadata }) => {
  return (
    <Card mb="lg" shadow="sm" p="0">
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ flex: "1" }}>
          <Box p="lg">
            <Title>Trust #{metadata.id}</Title>
            <Text size="sm" color="dimmed">
              Recipient:
            </Text>
            <AddressDisplay address={metadata.owner} />
            <Text size="sm" color="dimmed">
              Start time:
            </Text>
            <Text weight={500} size="sm">
              {new Date(metadata.start_time).toLocaleString()}
            </Text>
            <Text size="sm" color="dimmed" mt="xs">
              Installment frequency:
            </Text>
            <Text weight={500} size="sm">
              {metadata.frequency_in_days} days
            </Text>
          </Box>
          <Table ml="sm" mr="lg" mb="lg">
            <tbody>
              {metadata.tokens.map((token: any, i: number) => (
                <tr key={i}>
                  <td>{token.name}</td>
                  <td>
                    <b>
                      {token.amount / Math.pow(10, token.decimals)}{" "}
                      {token.ticker}
                    </b>
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
