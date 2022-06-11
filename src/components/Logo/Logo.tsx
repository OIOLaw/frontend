import React from "react";
import LogoImage from "./LogoImage";
import useStyles from "./Logo.styles";
import Link from "next/link";

export function Logo() {
  const { classes } = useStyles();

  return (
    <Link href="/" className={classes.logo} aria-label="OIO" passHref>
      <a style={{ display: "flex" }}>
        <LogoImage className={classes.image} />
      </a>
    </Link>
  );
}
