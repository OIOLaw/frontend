import type {NextPage} from "next";
import Head from "next/head";
import Layout from '../src/components/Layout'

const Home: NextPage = () => {

    return (
        <>
            <Head>
                <title>OIOLaw</title>
                <meta name="description" content=""/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Layout>
                TODO:
                {/*    TODO: Add Create Trust button and link to /create */}

                {/*    TODO: NOT connected? "connect wallet to proceed". */}

                {/*    TODO: connected? && !trusts[] print "you have no trusts. Start by creating one. */}
                {/*    TODO: connected? && trusts[]? display list of trusts, with an update trust button */}
            </Layout>
        </>
    );
};

export default Home;
