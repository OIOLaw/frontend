import {Container} from "@mantine/core"
import type {FC, ReactNode} from "react"
import styles from "../styles/layout.module.scss"
import Header from "./Header";
import Footer from "./Footer";

const Layout: FC<{
    children: ReactNode
}> = ({children}) => {
    return (
        <div className={styles["layout"]}>
            <Header/>
            <Container className={styles["container"]}>{children}</Container>
            <Footer/>
        </div>
    )
}

export default Layout
