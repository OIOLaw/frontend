import React, {FC} from 'react';
import { createStyles } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        height: 'auto',
        paddingTop: 18,
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: theme.spacing.sm / 2,
        zIndex: 1,
    },
}));

const StartTimeSelect: FC = () => {
    // You can add these classes as classNames to any Mantine input, it will work the same
    const { classes } = useStyles();

    return (
        <div>
            <DatePicker
                style={{ marginTop: 20 }}
                label="Start time"
                placeholder="When do you want assets to be sent?"
                classNames={classes}
                clearable={false}
            />
        </div>
    );
}

export default StartTimeSelect;
