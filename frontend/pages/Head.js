import Head from "next/head";

const PageHead = ({ title }) => {
  return (
    <>
      <Head>
        <title>{title} || Web3 Agent</title>
        <meta name="description" content="Page Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
    </>
  );
};

export default PageHead;
