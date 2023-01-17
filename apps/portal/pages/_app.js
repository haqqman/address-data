import Head from 'next/head'
import Script from 'next/script'
import '../public/assets/css/style.css'
import '../public/assets/css/green.css'
function CustomApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Basic Page Needs */}
        <title>Portal — Address Data</title>
        <meta
          name="description"
          content="Deploy, configure and hyper-accurate Nigeria Address Validation Tool."
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
      <main className="app">
        <Component {...pageProps} />
      </main>
      <Script src="/assets/js/jquery-3.3.1.min.js"></Script>
      <Script src="/assets/js/jquery-migrate-3.0.0.min.js"></Script>
      <Script src="/assets/js/mmenu.min.js"></Script>
      <Script src="/assets/js/tippy.all.min.js"></Script>
      <Script src="/assets/js/simplebar.min.js"></Script>
      <Script src="/assets/js/bootstrap-slider.min.js"></Script>
      <Script src="/assets/js/bootstrap-select.min.js"></Script>
      <Script
        src="/assets/js/snackbar.js"
        id="snackbar-script"
        onReady={() => {
          // Snackbar for user status switcher

          document
            .querySelectorAll('#snackbar-user-status label')
            .forEach((label) => {
              label.onclick = function () {
                Snackbar.show({
                  text: 'Your status has been changed!',
                  pos: 'bottom-center',
                  showAction: false,
                  actionText: 'Dismiss',
                  duration: 3000,
                  textColor: '#fff',
                  backgroundColor: '#383838',
                })
              }
            })
        }}
      ></Script>
      <Script src="/assets/js/clipboard.min.js"></Script>
      <Script src="/assets/js/counterup.min.js"></Script>
      <Script src="/assets/js/magnific-popup.min.js"></Script>
      <Script src="/assets/js/slick.min.js"></Script>
      <Script src="/assets/js/custom.js"></Script>
      <Script src="/assets/js/customSnackbar.js"></Script>
    </>
  )
}
export default CustomApp
