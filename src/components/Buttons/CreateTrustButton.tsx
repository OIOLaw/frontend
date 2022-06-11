import { Button } from "@mantine/core";
import Link from "next/link";
import React, { FC } from "react";
import { Plus } from "tabler-icons-react";

const CreateTrustButton: FC = () => {
  return (
    <Link href="/create" passHref>
      <Button leftIcon={<Plus />} component="a" mt="md">
        Create a new trust
      </Button>
    </Link>
  );
};

export default CreateTrustButton;
