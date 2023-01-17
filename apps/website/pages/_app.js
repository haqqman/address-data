import Head from 'next/head'
import Script from 'next/script'
import Layout from '../components/Layout'
import Loader from '../components/Loader'
import '../public/assets/css/bootstrap.min.css'
import '../public/assets/css/magnific-popup.css'
import '../public/assets/css/themify-icons.css'
import '../public/assets/css/animate.min.css'
import '../public/assets/css/jquery.mb.YTPlayer.min.css'
import '../public/assets/css/owl.carousel.min.css'
import '../public/assets/css/owl.theme.default.min.css'
import '../public/assets/css/style.css'
import '../public/assets/css/responsive.css'

function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {/* SEO Meta description */}
        <meta
          name="description"
          content="Hyper-accurate Nigeria Address Validation Tool"
        />
        <meta name="author" content="Haqqman.Agency, agency@haqqman.com" />
        <meta name="designer" content="Abdulhaqq Sule" />
        {/* Meta Tags for Facebook, Twitter and LinkedIn */}
        <meta property="og:site_name" content="" />
        <meta property="og:site" content="" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="article" />
        {/* Favicon */}
        <link
          rel="icon"
          href="/assets/favicon.png"
          type="image/png"
          sizes="16x16"
        />
      </Head>

      <Script src="assets/js/jquery-3.4.1.min.js" async />
      <Script src="assets/js/popper.min.js" async />
      <Script src="assets/js/bootstrap.min.js" async />
      <Script src="assets/js/jquery.magnific-popup.min.js" async />
      <Script src="assets/js/jquery.easing.min.js" async />
      <Script src="assets/js/jquery.mb.YTPlayer.min.js" async />
      <Script src="assets/js/wow.min.js" async />
      <Script src="assets/js/owl.carousel.min.js" async />
      <Script src="assets/js/jquery.countdown.min.js" async />
      <Script src="assets/js/scripts.js" async />

      <main className="app">
        <Loader />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </>
  )
}
export default CustomApp
