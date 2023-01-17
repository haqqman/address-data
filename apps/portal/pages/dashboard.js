import Link from 'next/link'
import Head from 'next/head'
import Header from '../components/Header'
import SideBar from '../components/Sidebar'

export default function Dashboard() {
  return (
    <>
      <Head>
        {/* title */}
        <title>Deploy Domains — Haqqman Form Endpoints.</title>
      </Head>
      {/* Wrapper */}
      <div id="wrapper">
        <Header />
        {/* Dashboard Container */}
        <div className="dashboard-container">
          <SideBar />

          {/* Start Dashboard Content */}
          <div className="dashboard-content-container" data-simplebar="">
            <div className="dashboard-content-inner">
              {/* Dashboard Headline */}
              <div className="dashboard-headline">
                <h3>
                  Hello {'{'}Your Name{'}'},
                </h3>
                <span>Integrate or Contribute to Address Data</span>
                {/* Breadcrumbs */}
                <nav id="breadcrumbs" className="white">
                  <ul>
                    <li>
                      <Link href="#">Portalr</Link>
                    </li>
                    <li>Dashboard</li>
                  </ul>
                </nav>
              </div>
              {/* Fun Facts Container */}
              <div className="fun-facts-container">
                <div className="fun-fact" data-fun-fact-color="#F2AE23">
                  <div className="fun-fact-text">
                    <span>Street Addresses</span>
                    <h4>2</h4>
                  </div>
                  <div className="fun-fact-icon">
                    <i className="icon-feather-globe" />
                  </div>
                </div>
                <div className="fun-fact" data-fun-fact-color="#0675B6">
                  <div className="fun-fact-text">
                    <span>Cities</span>
                    <h4>1</h4>
                  </div>
                  <div className="fun-fact-icon">
                    <i className="icon-feather-link" />
                  </div>
                </div>
                <div className="fun-fact" data-fun-fact-color="#36bd78">
                  <div className="fun-fact-text">
                    <span>States</span>
                    <h4>37</h4>
                  </div>
                  <div className="fun-fact-icon">
                    <i className="icon-feather-trending-up" />
                  </div>
                </div>
                <div />
              </div>
            </div>
          </div>
          {/* End Dashboard Content */}
        </div>
        {/* End Dashboard Container */}
      </div>
      {/* End Wrapper */}
    </>
  )
}
