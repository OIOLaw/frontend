import React from 'react';
import LogoImage from './LogoImage';
import useStyles from './Logo.styles';
import Link from "next/link";

export function Logo() {
    const { classes } = useStyles();

    return (
        // TODO: why doesn't the link work?
        <Link href="/" className={classes.logo} aria-label="OIO">
            <LogoImage className={classes.image} />
        </Link>
    );
}
