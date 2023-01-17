import Link from 'next/link'
import { useRouter } from 'next/router'
export default function SideBar(){
const router=useRouter();
const currentRoute=router.pathname;
    return(
        <>
        {/* Start Dashboard Sidebar */}
    <div className="dashboard-sidebar">
    <div className="dashboard-sidebar-inner">
      <div className="dashboard-nav-container">
        {/* Responsive Navigation Trigger */}
        <Link href="/" className="dashboard-responsive-nav-trigger">
          <span className="hamburger hamburger--collapse">
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </span>
          <span className="trigger-title">Dashboard Navigation</span>
        </Link>
        {/* Navigation */}
        <div className="dashboard-nav">
          <div className="dashboard-nav-inner">
            <ul data-submenu-title="Integrate">
              <li className={currentRoute==="/dashboard"?"active":""}>
                <Link href="/dashboard">
                  <i className="icon-line-awesome-home" />
                  Dashboard
                </Link>
              </li>
              <li className={currentRoute==="/manage-domains"?"active":""}>
                <Link href="/manage-domains">
                  <i className="icon-material-outline-settings-input-component" />{" "}
                  Manage Domains
                </Link>
              </li>
              <li className={currentRoute==="/deploy-domains"?"active":""}>
                <Link href="/deploy-domains">
                  <i className="icon-line-awesome-globe" /> Deploy Domains
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Navigation / End */}
      </div>
    </div>
  </div>
  {/* Dashboard Sidebar / End */}
  </>
  )
}