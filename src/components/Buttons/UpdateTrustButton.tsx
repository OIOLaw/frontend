import React, { FC } from 'react'
import {Button} from "@mantine/core";
import Link from 'next/link';

const UpdateTrustButton: FC = () => {

    return (
        <Link href="/update/1" >
            <Button>
                Update
             </Button>
        </Link>
  );
};

export default UpdateTrustButton
