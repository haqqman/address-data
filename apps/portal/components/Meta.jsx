import Head from "next/head"
export default function Meta ({titlePrefix,titleSufix,description}){
    return(

    
    <Head>
        <title className="myTitle">{`${titlePrefix} — ${titleSufix}`}</title>
        <meta
          name="description"
          content={description}
        />
        <meta
          name="founder"
          content="Abdulhaqq Sule, writeme@abdulhaqqsule.com"
        />
        <meta
          name="contributors"
          content="https://addressdata.ng/contributors"
        />
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        {/* Favicon */}
        <link
          rel="shortcut icon"
          href="/assets/favicon.png"
          type="image/x-icon"
        />
      </Head>
        )
}
Meta.defaultProps={
    titlePrefix:"Portal",
    titleSufix:"Address-data",//Address data is used as the default prop value because it is used more often,  now assuming 
    description:"Deploy, configure and hyper-accurate Nigeria Address Validation Tool."
}