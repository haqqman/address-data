import Head from "next/head";

// We save to redux
export default function PageTitle({ title }) {

  return (
    <>
      <Head>
        <title>{`${title}`} &mdash; Address Data</title>
      </Head>
    </>
  );
}
