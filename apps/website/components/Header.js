import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import logo from '../public/assets/images/logo-light.svg'

export default function Header() {
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg fixed-top bg-transparent">
        <div className="container">
          <Link className="navbar-brand" href="#">
            <Image src={logo} alt="Address Logo" className="img-fluid" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="ti-menu" />
          </button>
          <div
            className="collapse navbar-collapse h-auto"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav ml-auto menu">
              <li>
                <Link href="/">About</Link>
              </li>
              <li>
                <Link href="/documentation">Documentation</Link>
              </li>
              <li>
                <Link href="/donate">Donate</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <font color="white">
                  <a className="dropdown-toggle" href="#">
                    Manage Account
                  </a>
                </font>
                <ul className="sub-menu">
                  <li>
                    <Link href="/access">Access</Link>
                  </li>
                  <li>
                    <Link href="/create">Create</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
