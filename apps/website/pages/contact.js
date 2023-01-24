import Meta from '../components/Meta'

export default function Contact() {
  return (
    <>
      <Meta titlePrefix={'Contact'} />

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
                  <h1 className="text-white">How can we help?</h1>
                  <p className="lead">24/7 Help Center</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Hero Section */}
        {/*Start Contact Section*/}
        <section id="contact" className="contact-us-section ptb-50">
          <div className="container">
            <div className="row justify-content-around">
              <div className="col-md-6">
                <div className="contact-us-form gray-light-bg rounded p-5">
                  <h4>Get in Touch</h4>
                  <p>
                    Address Data is the leader in location data intelligence. We
                    provide lightning fast address validation, rooftop
                    geocoding, and address autocomplete APIs for NIgerian
                    addresses.
                  </p>
                  <form
                    action="#"
                    method="POST"
                    id="contactForm"
                    className="contact-us-form"
                    noValidate="novalidate"
                  >
                    <div className="form-row">
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="First Name"
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
                            name="Last Name"
                            placeholder="Last Name"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            placeholder="Enter email"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="Subject"
                            placeholder="Subject"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <textarea
                            name="message"
                            id="message"
                            className="form-control"
                            rows={7}
                            cols={25}
                            placeholder="Message"
                            defaultValue={''}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12 mt-3">
                        <button
                          type="submit"
                          className="btn solid-btn"
                          id="btnContactUs"
                        >
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-md-5">
                <div className="contact-us-content">
                  <h2>What to Expect</h2>
                  <p>
                    Describe the problem you&apos;re having as best you can.
                    After you complete the form, we&apos;ll connect you with one
                    of our fantastic member of our support team who will be in
                    touch with you as soon as possible.{' '}
                  </p>
                  <hr className="my-5" />
                  <h5>If you&apos;ll rather shoot us an email</h5>
                  <a
                    href="mailto:addressdata@haqqman.com"
                    className="btn outline-btn align-items-center"
                  >
                    Send eMail <span className="ti-arrow-right pl-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
