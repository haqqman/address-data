import Head from 'next/head'

export default function Meta({ titlePrefix, titleSuffix, description, keywords }) {
  return (

    <Head>
      <title>{`${titlePrefix} — ${titleSuffix}`}</title>
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords}
      />
      {/* Default Meta */}
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1.0"
      />
      {/* Favicon & Icons */}
      <link
        rel="shortcut icon"
        href="/assets/favicon.png"
        type="image/png"
      />
      {/* Twitter Card data */}
      <meta name="twitter:title" content={`${titlePrefix} — ${titleSuffix}`} />
      <meta name="twitter:site" content="@addressdata" />
      <meta name="twitter:card" content="Address Data" />
      <meta
        name="twitter:description"
        content={description}
      />
      <meta name="twitter:creator" content="@addressdata" />
      <meta name="twitter:image" content="#" />
      {/* Open Graph data */}
      <meta property="og:title" content={`${titlePrefix} — ${titleSuffix}`} />
      <meta property="og:url" content="#" />
      <meta property="og:image" content="#" />
      <meta
        property="og:description"
        content={description}
      />
      {/* Credit */}
      <meta
        name="founder"
        content="Abdulhaqq Sule, writeme@abdulhaqqsule.com"
      />
      <meta
        name="contributors"
        content="https://addressdata.ng/contributors"
      />
    </Head>
  )
}
Meta.defaultProps = {
  titlePrefix: "Portal",
  titleSuffix: "Address Data",
  description: "Deploy, configure and manage hyper-accurate Nigeria Address Validation Tool.",
  keywords: "address, data, location, map"
}