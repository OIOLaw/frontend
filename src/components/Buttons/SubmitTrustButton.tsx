import { Check } from 'tabler-icons-react';
import {Button, Text} from "@mantine/core";
import {FC} from "react";

interface ISubmitTrustButton {
    isLoading: boolean
}

const SubmitTrustButton: FC<ISubmitTrustButton> = ({isLoading}) => {
    return (
        <Button
            // onClick={() => handleClick}
            loading={isLoading}
            style={{position: 'relative', marginTop: 30, width: '100%'}}
            variant="gradient" gradient={{from: 'indigo', to: 'cyan'}}>
            <Text>
                {`Submit Trust`}
            </Text>
        </Button>)
}

export default SubmitTrustButton;
