import { Check } from "tabler-icons-react";
import { Button, Text } from "@mantine/core";
import { FC } from "react";

interface ISubmitTrustButton {
  isLoading: boolean;
  onClick: () => void;
}

const SubmitTrustButton: FC<ISubmitTrustButton> = ({ isLoading, onClick }) => {
  return (
    <Button
      onClick={onClick}
      loading={isLoading}
      style={{ position: "relative", marginTop: 30, width: "100%" }}
      variant="gradient"
      gradient={{ from: "indigo", to: "cyan" }}>
      <Text>{`Submit Trust`}</Text>
    </Button>
  );
};

export default SubmitTrustButton;
