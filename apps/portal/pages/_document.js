import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {

  return (
    <Html>
      <Head>
      <link
          href="https://fonts.googleapis.com/css?family=Oxygen:300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <Main />
        <NextScript />
      
    </Html>
  )
}