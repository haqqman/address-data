import Meta from '../components/Meta'
import Script from 'next/script'
import '../public/assets/css/style.css'
import '../public/assets/css/green.css'
function CustomApp({ Component, pageProps }) {
  return (
    <>
      
      <main className="app">
        <Component {...pageProps} />
      </main>
      <Meta />
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
