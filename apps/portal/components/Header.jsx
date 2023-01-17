import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <>
      {/* Header Container */}
      <header id="header-container" className="fullwidth transparent">
        {/* Header */}
        <div id="header">
          <div className="container">
            {/* Left Side Content */}
            <div className="left-side">
              {/* Logo */}
              <div id="logo">
                <Link href="index.html">
                  <Image src="/assets/images/mailer-logo.svg"
                  width={50}
                  height={50}
                  alt="" />
                </Link>
              </div>
            </div>
            {/* Left Side Content / End */}
            {/* Right Side Content / Start */}
            <div className="right-side">
              {/*  User Notifications */}
              <div className="header-widget">
                {/* Messages */}
                <div className="header-notifications">
                  <div className="header-notifications-trigger">
                    <Link href="#">
                      <i className="icon-feather-bell" />
                      <span>3</span>
                    </Link>
                  </div>
                  {/* Dropdown */}
                  <div className="header-notifications-dropdown">
                    <div className="header-notifications-headline">
                      <h4>Notifications &amp; Updates</h4>
                      <button
                        className="mark-as-read ripple-effect-dark"
                        title="Mark all as read"
                        data-tippy-placement="left"
                      >
                        <i className="icon-feather-check-square" />
                      </button>
                    </div>
                    <div className="header-notifications-content">
                      <div
                        className="header-notifications-scroll"
                        data-simplebar=""
                      >
                        <ul>
                          {/* Notification */}
                          <li className="notifications-not-read">
                            <Link href="dashboard-messages.html">
                              <span className="notification-avatar status-online">
                                <Image
                                  src="/assets/images/formend-avatar.svg"
                                  alt=""
                                  width={50}
                                  height={50}
                                />
                              </span>
                              <div className="notification-text">
                                <strong>Formend Support</strong> —{' '}
                                <span className="color">4 hours ago</span>
                                <p className="notification-msg-text">
                                  No information available yet!
                                </p>
                              </div>
                            </Link>
                          </li>
                          {/* Notification */}
                          <li className="notifications-not-read">
                            <Link href="dashboard-messages.html">
                              <span className="notification-avatar status-online">
                                <Image
                                  src="/assets/images/formend-avatar.svg"
                                  alt=""
                                  width={50}
                                  height={50}
                                />
                              </span>
                              <div className="notification-text">
                                <strong>Formend Update</strong> —{' '}
                                <span className="color">Yesterday</span>
                                <p className="notification-msg-text">
                                  No information available yet!
                                </p>
                              </div>
                            </Link>
                          </li>
                          {/* Notification */}
                          <li className="notifications-not-read">
                            <Link href="dashboard-messages.html">
                              <span className="notification-avatar status-online">
                                <Image
                                  src="/assets/images/formend-avatar.svg"
                                  alt=""
                                  width={50}
                                  height={50}
                                />
                              </span>
                              <div className="notification-text">
                                <strong>Formend Support</strong> —{' '}
                                <span className="color">Yesterday</span>
                                <p className="notification-msg-text">
                                  No information available yet!
                                </p>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Link
                      href="dashboard-messages.html"
                      className="header-notifications-button ripple-effect button-sliding-icon"
                    >
                      View All
                      <i className="icon-material-outline-arrow-right-alt" />
                    </Link>
                  </div>
                </div>
              </div>
              {/*  User Notifications / End */}
              {/* User Menu */}
              <div className="header-widget">
                {/* Messages */}
                <div className="header-notifications user-menu">
                  <div className="header-notifications-trigger">
                    <Link href="#">
                      <div className="user-avatar status-online">
                        <Image src="/assets/images/user-avatar.png" alt="" height={43} width={50} />
                      </div>
                    </Link>
                  </div>
                  {/* Dropdown */}
                  <div className="header-notifications-dropdown">
                    {/* User Status */}
                    <div className="user-status">
                      {/* User Name / Avatar */}
                      <div className="user-details">
                        <div className="user-avatar status-online">
                          <Image
                            src="/assets/images/user-avatar.png"
                            alt=""
                            width={50}
                            height={43}
                          />
                        </div>
                        <div className="user-name">
                          Formend Manager <span>Haqqman Webmaster</span>
                        </div>
                      </div>
                      {/* User Status Switcher */}
                      <div className="status-switch" id="snackbar-user-status">
                        <label className="user-online current-status">
                          Active
                        </label>
                        <label className="user-invisible">Inactive</label>
                        {/* Status Indicator */}
                        <span className="status-indicator" aria-hidden="true" />
                      </div>
                    </div>
                    <ul className="user-menu-small-nav">
                      <li>
                        <Link href="account-center.html">
                          <i className="icon-material-outline-settings" />
                          Account Center
                        </Link>
                      </li>
                      <li>
                        <Link href="logout.html">
                          <i className="icon-material-outline-power-settings-new" />{' '}
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* User Menu / End */}
            </div>
            {/* Right Side Content / End */}
          </div>
        </div>
        {/* Header / End */}
      </header>
      <div className="clearfix" />
      {/* Header Container / End */}
    </>
  )
}
