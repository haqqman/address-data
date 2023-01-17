import Head from 'next/head'
import PageTitle from '../components/PageTitle'
import Brands from '../components/Brands'

export default function Documentation() {
  return (
    <>
      <PageTitle title="Documentation" />

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
                  <h1 className="text-white">Documentation</h1>
                  <p className="lead">
                    Easy-to-use tool for single address verification &amp;
                    validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Hero Section */}
        {/* Start Address Demo Tool */}
        <section id="contact" className="contact-us-section ptb-50">
          <div className="container">
            <div className="row justify-content-around">
              {/* Start Lookup Type */}
              <div className="col-md-6">
                <div className="contact-us-form gray-light-bg rounded p-5">
                  <form
                    action="#"
                    method="POST"
                    id="contactForm1"
                    className="contact-us-form"
                    noValidate="novalidate"
                  >
                    <div className="form-row">
                      <div className="col-12">
                        <div className="form-group">
                          <label>Address Lookup Type</label>
                          <select
                            type="select"
                            className="form-control"
                            name="lookup-type"
                            required="required"
                          >
                            <option value="value1">Freeform Component</option>
                            <option value="value2">Select Component</option>
                            <option value="value3">
                              AutoComplete Component
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div className="form-row">
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Address line 1"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="address"
                            placeholder="Address line 2"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="state"
                            placeholder="State"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            placeholder="City"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="form-group">
                          <input
                            type="number"
                            className="form-control"
                            name="zip-code"
                            placeholder="000000"
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <button
                          type="submit"
                          className="btn solid-btn"
                          id="btnDonateWithPaystack"
                        >
                          View Results
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* End Lookup Type */}
              <div className="col-md-5">
                <div className="contact-us-content">
                  <h2>Awaiting input.</h2>
                  <p>
                    Enter an address in the address form on the left column to
                    see your results here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End Address Demo Tool */}

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
