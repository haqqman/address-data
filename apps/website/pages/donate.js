import Meta from '../components/Meta'
import Brands from '../components/Brands'

export default function Donate() {
  return (
    <>
      <Meta title='Donate' />

      <div className="main">
        {/* Start Hero Section */}
        <section
          className="hero ptb-100 gradient-overlay"
          style={{
            background:
              'url("assets/images/hero-bg-1.jpg")no-repeat top center / cover',
          }}
        >
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-9 col-lg-8">
                <div
                  className="hero-content-left position-relative z-index text-center text-white"
                  style={{ marginTop: 50, marginBottom: '-50px' }}
                >
                  <h1 className="text-white">Donate</h1>
                  <p className="lead">
                    Support in Helping to Sustain and Grow Address Data Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Hero Section */}
        {/*pricing section start*/}
        <section id="pricing" className="pricing ptb-30 gray-light-bg">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-9 col-lg-8">
                <div className="section-heading mb-5 text-center">
                  <h2>Why we encourage your donation?</h2>
                  <p className="lead">
                    Relying on volunteers to maintain Address Data Open
                    isn&apos;t long term sustainable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*pricing section end*/}
        {/* Start Donation Section */}
        <section id="contact" className="contact-us-section ptb-50">
          <div className="container">
            <div className="row justify-content-around">
              <div className="col-md-5">
                <div className="contact-us-content">
                  <h2>Looking for a excellent Business idea?</h2>
                  <p>
                    We are working on Address Data to ensure accurate and
                    up-to-date Address Data for platforms in Nigeria, which is
                    essential for web-savvy organizations to function
                    effectively. Currently, our efforts are funded primarily by
                    Haqqman, a technology company based in Abuja. However,
                    consistent commitments have been a challenge as developers
                    often work on this project in their spare time
                  </p>
                  <p>
                    No matter how small, every contribution helps us continue to
                    improve and expand Address Data for the benefit of all
                    platforms in need of efficient address validation in
                    Nigeria. Thank you for considering supporting our efforts.
                  </p>
                  <hr className="my-5" />
                  <h5>Volunteer</h5>
                  <p>
                    No matter how small, every code contribution helps us
                    continue to improve and expand Address Data for the benefit
                    of all platforms in need of efficient address validation in
                    Nigeria. Thank you for considering supporting our efforts.
                  </p>
                  <a href="#" className="btn outline-btn align-items-center">
                    Volunteer <span className="ti-arrow-right pl-2" />
                  </a>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-us-form gray-light-bg rounded p-5">
                  <p>
                    If you believe in the importance of Open Source Address Data
                    Platform and the work we do, please consider making a
                    donation today. Your support will make a real difference in
                    helping us to achieve our mission and make a positive impact
                    in the world.
                  </p>
                  <form
                    action="#"
                    method="POST"
                    id="contactForm1"
                    className="contact-us-form"
                    noValidate="novalidate"
                  >
                    <div className="form-row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="first-name"
                            placeholder="First Name"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="last-name"
                            placeholder="Last Name"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Organization Name"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            name="email-address"
                            placeholder="Enter email address"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control"
                            name="phone-number"
                            placeholder="Phone Number"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="numeric"
                            className="form-control"
                            name="name"
                            placeholder="How much do you want to donate?"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 mt-3">
                        <button
                          type="submit"
                          className="btn solid-btn"
                          id="btnDonateWithPaystack"
                        >
                          Donate
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*contact us section end*/}

        {/* Start Brands Section */}
        <Brands />
        {/* End Brands Section */}

        {/* Start Start Mobile App Download Section */}
        <section
          className="gradient-overlay ptb-100"
          style={{
            background:
              'url("assets/images/hero-bg-1.jpg")no-repeat center center / cover fixed',
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-9 col-lg-8">
                <div className="section-heading text-center">
                  <h2 className="text-white">
                    Get the Address Data Mobile App
                  </h2>
                  <div className="action-btns download-btn mt-4">
                    <a
                      href="#download"
                      className="btn outline-white-btn mr-3 page-scroll"
                    >
                      {' '}
                      App Store
                    </a>
                    <a
                      href="#contact"
                      className="btn solid-white-btn page-scroll"
                    >
                      {' '}
                      Play Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* End Mobile App Download Section */}
      </div>
    </>
  )
}
