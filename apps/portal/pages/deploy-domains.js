import Link from 'next/link'
import Meta from '../components/Meta'
import Header from '../components/Header'
import SideBar from '../components/Sidebar'
export default function DeployDomains() {
  return (
    <>
        {/* Meta data and Title */}
        <Meta titlePrefix={'Deploy Domains'} />
      {/* Wrapper */}
      <div id="wrapper">
        {/* Import Header Component */}
        <Header />

        {/* Dashboard Container */}
        <div className="dashboard-container">
          {/* Import Sidebar Component */}
          <SideBar />

          {/* Dashboard Content
	================================================== */}
          <div className="dashboard-content-container" data-simplebar="">
            <div className="dashboard-content-inner">
              {/* Dashboard Headline */}
              <div className="dashboard-headline">
                <h3>Deploy Domains</h3>
                {/* Breadcrumbs */}
                <nav id="breadcrumbs" className="white">
                  <ul>
                    <li>
                      <Link href="#">Formend</Link>
                    </li>
                    <li>
                      <Link href="#">Configure</Link>
                    </li>
                    <li>Deploy Domains</li>
                  </ul>
                </nav>
              </div>
              {/* Row */}
              <div className="row">
                {/* Dashboard Box */}
                <div className="col-xl-12">
                  <div className="dashboard-box margin-top-0">
                    {/* Headline */}
                    <div className="headline">
                      <h3>
                        <i className="icon-line-awesome-globe" /> Deploy a new
                        form end point.
                      </h3>
                    </div>
                    <div className="content with-padding padding-bottom-10">
                      <div className="row">
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>Domain Name</h5>
                            <input
                              type="text"
                              className="with-border"
                              placeholder="https://domain.com"
                            />
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>
                              From Name{' '}
                              <i
                                className="help-icon"
                                data-tippy-placement="right"
                                title="This also serves as the form name."
                              />
                            </h5>
                            <input
                              type="text"
                              className="with-border"
                              placeholder="e.g. Formend Contact Form"
                            />
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>Email Subject</h5>
                            <input
                              type="text"
                              className="with-border"
                              placeholder="e.g. You've received a submission!)"
                            />
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>
                              Email - Primary
                              <i
                                className="help-icon"
                                data-tippy-placement="right"
                                title="Successful submissions will be sent to this email."
                              />
                            </h5>
                            <input
                              type="email"
                              className="with-border"
                              placeholder="e.g. formend@haqqman.com"
                            />
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>
                              Email - Secondary
                              <i
                                className="help-icon"
                                data-tippy-placement="right"
                                title="Carbon copy of successful submission emails (Cc)"
                              />
                            </h5>
                            <input
                              type="email"
                              className="with-border"
                              placeholder="e.g. formend2@haqqman.com"
                            />
                          </div>
                        </div>
                        <div className="col-xl-4">
                          <div className="submit-field">
                            <h5>Status</h5>
                            <select
                              className="selectpicker with-border"
                              data-size={7}
                              title="Select Status"
                            >
                              <option>Enabled</option>
                              <option>Disabled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12">
                  <Link
                    href="#"
                    className="button ripple-effect big margin-top-30"
                  >
                    <i className="icon-feather-plus" /> Deploy Domain
                  </Link>
                </div>
              </div>
              {/* Row / End */}
              {/* Footer */}
              <div className="dashboard-footer-spacer" />
              <div className="small-footer margin-top-15">
                <div className="small-footer-copyrights">
                  © Formend by Haqqman
                </div>
                <div className="clearfix" />
              </div>
              {/* Footer / End */}
            </div>
          </div>
          {/* Dashboard Content / End */}
        </div>
        {/* Dashboard Container / End */}
      </div>
      {/* Wrapper / End */}
    </>
  )
}
