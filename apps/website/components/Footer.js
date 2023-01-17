import Image from 'next/image'
import Link from 'next/link'
import logo from '../public/assets/images/logo-light.svg'

export default function Footer() {
  return (
    <>
      <div className="footer-section">
        {/*footer top start*/}
        <div className="footer-top gradient-bg">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-12">
                <div className="footer-nav-wrap text-white mb-0 mb-md-4 mb-lg-0">
                  <Link className="d-block" href="/">
                    <Image
                      src={logo}
                      alt="footer logo"
                      className="img-fluid mb-1"
                    />
                  </Link>
                  <p>Efficient Nigerian address validation.</p>
                </div>
              </div>
              <div className="col-lg-2 col-md-4 col-12">
                <div className="footer-nav-wrap text-white">
                  <ul className="list-unstyled footer-nav-list mt-3">
                    <li>
                      <Link href="/">About</Link>
                    </li>
                    <li>
                      <Link href="/pricing">Pricing</Link>
                    </li>
                    <li>
                      <Link href="/documentation">Documentation</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2 col-md-4 col-12">
                <div className="footer-nav-wrap text-white">
                  <ul className="list-unstyled footer-nav-list mt-3">
                    <li>
                      <Link href="/contact">Contact</Link>
                    </li>
                    <li>
                      <Link href="/privacy">Privacy</Link>
                    </li>
                    <li>
                      <Link href="/terms">Terms</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-12">
                <div className="footer-nav-wrap text-white">
                  <h5 className="text-light footer-head">Create account</h5>
                  <form action="#" className="creator-form mt-3">
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Enter your email"
                        required=""
                      />
                      <div className="input-group-append">
                        <button
                          className="btn solid-btn creator-btn btn-hover"
                          type="submit"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*footer top end*/}
        {/*footer copyright start*/}
        <div className="footer-bottom gray-light-bg py-3">
          <div className="container">
            <div className="row text-center justify-content-center">
              <div className="col-md-6 col-lg-5">
                <p className="copyright-text pb-0 mb-0">
                  © Made with <span className="ti-heart color-7" /> by{' '}
                  <b>
                    <a
                      href="https://haqqman.agency/sitecredit"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Haqqman
                    </a>
                  </b>
                </p>
                <b></b>
              </div>
              <b></b>
            </div>
            <b></b>
          </div>
          <b></b>
        </div>
        <b>{/*footer copyright end*/}</b>
        {/* footer section end */}
      </div>

      {/*bottom to top button start*/}
      <button className="scroll-top scroll-to-target" data-target="html">
        <span className="ti-angle-up" />
      </button>
      {/*bottom to top button end*/}
    </>
  )
}
