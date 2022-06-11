import { Box, Code, Tooltip } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { FC } from "react";
import { truncateAddress } from "../utils/utility";

const AddressDisplay: FC<{ address: string }> = ({ address }) => {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <Box>
      <Tooltip label="Copied" opened={clipboard.copied}>
        <Code onClick={() => clipboard.copy(address)}>
          {truncateAddress(address)}
        </Code>
      </Tooltip>
    </Box>
  );
};

export default AddressDisplay;
