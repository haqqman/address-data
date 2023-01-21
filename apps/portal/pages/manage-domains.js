import Link from 'next/link'
import Meta from '../components/Meta'
import SideBar from '../components/Sidebar'
import Header from '../components/Header'

export default function ManageDomains() {
  return (
    <>
      {/* Meta data and Title */}
          <Meta titlePrefix={'Manage Domains'}/>
      {/* Wrapper */}
      <div id="wrapper">
        {/* Import Header Component */}
        <Header />

        {/* Dashboard Container */}
        <div className="dashboard-container">
          <SideBar />
          {/* Dashboard Content
	================================================== */}
          <div className="dashboard-content-container" data-simplebar="">
            <div className="dashboard-content-inner">
              {/* Dashboard Headline */}
              <div className="dashboard-headline">
                <h3>Manage Domains</h3>
                {/* Breadcrumbs */}
                <nav id="breadcrumbs" className="white">
                  <ul>
                    <li>
                      <Link href="#">Formend</Link>
                    </li>
                    <li>
                      <Link href="#">Configure</Link>
                    </li>
                    <li>Manage Domains</li>
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
                        <i className="icon-material-outline-settings-input-component" />{' '}
                        Modify or revoke existing domains.
                      </h3>
                    </div>
                    {/* Start Section Flow */}
                    <div className="content">
                      <ul className="dashboard-box-list">
                        <li>
                          {/* Domain List */}
                          <div className="section-flow width-adjustment">
                            {/* Domain List Details */}
                            <div className="section-flow-details">
                              {/* Details */}
                              <div className="section-flow-description">
                                <h3 className="section-flow-title">
                                  Alillanso Contact Form{' '}
                                  <span className="dashboard-status-button green">
                                    Active
                                  </span>
                                </h3>
                                {/* Start Form Name */}
                                <p className="section-flow-item">
                                  <i className="icon-feather-calendar" />{' '}
                                  Created on February 14, 2019
                                </p>
                                <p className="section-flow-item">
                                  <i className="icon-feather-calendar" />{' '}
                                  Created on February 14, 2019
                                </p>
                                {/* End Form Names */}
                              </div>
                            </div>
                          </div>
                          {/* Start Form Endpoint Details */}
                          <ul className="dashboard-task-info">
                            <li>
                              <strong>Form Endpoint</strong>
                              <span>
                                https://mailer.haqqman.com/formend/##########
                              </span>
                            </li>
                            <li>
                              <strong>Created on</strong>
                              <span>March 03, 2022</span>
                            </li>
                          </ul>
                          {/* End Form Endpoint Details */}
                          {/* Buttons */}
                          <div className="buttons-to-right always-visible">
                            <Link
                              href="https://alillanso.com"
                              className="button ripple-effect"
                              target="_blank"
                            >
                              <i className="icon-line-awesome-globe" />{' '}
                              https://alillanso.com
                            </Link>
                            <Link
                              href="#"
                              className="button gray ripple-effect ico"
                              title="Edit"
                              data-tippy-placement="top"
                            >
                              <i className="icon-feather-edit" />
                            </Link>
                            <Link
                              href="#"
                              className="button gray ripple-effect ico"
                              title="Remove"
                              data-tippy-placement="top"
                            >
                              <i className="icon-feather-trash-2" />
                            </Link>
                          </div>
                        </li>
                        <li>
                          {/* Domain List */}
                          <div className="job-listing">
                            {/* Domain List Details */}
                            <div className="job-listing-details">
                              {/* Details */}
                              <div>
                                <h3>
                                  Menacoast Contact Form{' '}
                                  <span className="dashboard-status-button red">
                                    Inactive
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>
                          {/* Start Form Endpoint Details */}
                          <ul className="dashboard-task-info">
                            <li>
                              <strong>Form Endpoint</strong>
                              <span>
                                https://mailer.haqqman.com/formend/##########
                              </span>
                            </li>
                            <li>
                              <strong>Created on</strong>
                              <span>March 03, 2022</span>
                            </li>
                          </ul>
                          {/* End Form Endpoint Details */}
                          {/* Buttons */}
                          <div className="buttons-to-right always-visible">
                            <Link
                              href="https://menacoast.com"
                              className="button ripple-effect"
                              target="_blank"
                            >
                              <i className="icon-line-awesome-globe" />{' '}
                              https://menacoast.com
                            </Link>
                            <Link
                              href="#"
                              className="button gray ripple-effect ico"
                              title="Edit"
                              data-tippy-placement="top"
                            >
                              <i className="icon-feather-edit" />
                            </Link>
                            <Link
                              href="#"
                              className="button gray ripple-effect ico"
                              title="Remove"
                              data-tippy-placement="top"
                            >
                              <i className="icon-feather-trash-2" />
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                    {/* End Section Flow */}
                  </div>
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
      {/* <MySnackbar /> */}

    </>
  )
}
