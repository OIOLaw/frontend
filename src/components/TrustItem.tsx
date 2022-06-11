import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  RingProgress,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { FC } from "react";
import { Check, Lock } from "tabler-icons-react";
import { useWeb3 } from "../providers/Web3Provider";
import AddressDisplay from "./AddressDisplay";
import TokenIcon from "./TokenIcon";

const TrustItem: FC<{ metadata: any }> = ({ metadata }) => {
  return (
    <Card mb="lg" shadow="sm" p="0">
      <Card.Section>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ flex: "1" }}>
            <Box p="lg">
              <Title>Trust #{metadata.id}</Title>
              <Text size="sm" color="dimmed">
                Recipient:
              </Text>
              <AddressDisplay address={metadata.owner} />
              <Text size="sm" color="dimmed" mt="xs">
                Start time:
              </Text>
              <Text weight={500} size="sm">
                {new Date(metadata.start_time * 1000).toLocaleString()}
              </Text>
              <Text size="sm" color="dimmed" mt="xs">
                Installment frequency:
              </Text>
              <Text weight={500} size="sm">
                {metadata.frequency_in_days} days
              </Text>
            </Box>
          </Box>
          <Box p="lg">
            <RingProgress
              sections={[{ value: 100, color: "blue" }]}
              label={
                <Center>
                  <ThemeIcon color="blue" variant="light" radius="xl" size="xl">
                    <Lock size={22} />
                  </ThemeIcon>
                </Center>
              }
            />
            <Link href={`/update/${metadata.id}`} passHref>
              <Button component="a" variant="light" mt="lg" my="lg">
                Update trust
              </Button>
            </Link>
          </Box>
        </Box>
      </Card.Section>
      <Card.Section>
        <Box ml="sm" pr="lg" mb="lg">
          <Table>
            <thead>
              <tr>
                <th>ERC20 Token</th>
                <th>Total balance</th>
                <th>Installment amount</th>
              </tr>
            </thead>
            <tbody>
              {metadata.tokens.map((token: any, i: number) => (
                <tr key={i}>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                    <TokenIcon symbol={token.symbol} /> {token.name}
                  </td>
                  <td>
                    {token.amount / Math.pow(10, token.decimals)} {token.symbol}
                  </td>
                  <td>
                    {token.installment_amount / Math.pow(10, token.decimals)}{" "}
                    {token.symbol}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>
      </Card.Section>
    </Card>
  );
};

export default TrustItem;
