import { Center, Box } from "@mantine/core";
import { FC, ReactNode } from "react";

const CenteredText: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Center sx={{ height: "70vh", textAlign: "center", color: "white" }}>
      <Box>{children}</Box>
    </Center>
  );
};

export default CenteredText;
