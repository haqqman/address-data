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

var $ = require('jquery')
if (typeof window !== 'undefined') {
  // Client side only code
  window.$ = window.jQuery = require('jquery')
}

function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Script src="assets/js/jquery.easing.min.js" async />
      <Script src="assets/js/jquery.magnific-popup.min.js" async />
      <Script src="assets/js/jquery.mb.YTPlayer.min.js" async />
      <Script src="assets/js/jquery.countdown.min.js" async />
      <Script src="assets/js/popper.min.js" async />
      <Script src="assets/js/bootstrap.min.js" async />
      <Script src="assets/js/wow.min.js" async />
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
