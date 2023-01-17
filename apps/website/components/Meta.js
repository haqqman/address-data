import Head from 'next/head'

const Meta = ({ title, description }) => {

  return (
    <Head>
      <title>{`${title}`} &mdash; Address Data</title>
      <meta
        name="description"
        content={description}
      />
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Home',
  description: 'Hyper-accurate Nigeria Address Validation Tool',
}

export default Meta