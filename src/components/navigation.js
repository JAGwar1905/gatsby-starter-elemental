import React, { useEffect, useRef, useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import { Logo } from "./utils"
import List from "./navigation-list"
import { Menu } from "react-feather"
import SideBar from "./sidebar"

const Navbar = ({ navPlaceholder, location }) => {
    const currentLocation = location.pathname.split("/")[1]

    const data = useStaticQuery(graphql`
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    const navbar = useRef(null)

    const [scrolled, changeState] = useState(false)
    const [navbarHeight, setNavbarHeight] = useState(0)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            if (document.documentElement.scrollTop > 50 && !scrolled) {
                changeState(true)
            } else if (document.documentElement.scrollTop <= 50 && scrolled)
                changeState(false)
        }

        window.addEventListener("scroll", onScroll)

        setNavbarHeight(navbar.current.getBoundingClientRect().height)

        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [scrolled])

    return (
        <React.Fragment>
            <div
                className={`duration-300 transition-all flex justify-center lg:justify-between items-center z-20 fixed w-full nav ${
                    scrolled ? "scrolled bg-bg p-4" : "p-5"
                }`}
                ref={navbar}
            >
                <button
                    className="absolute text-primary outline-0"
                    style={{
                        transform: "translateY(-50%)",
                        top: "50%",
                        left: "10px",
                    }}
                    onClick={() => {
                        setSidebarOpen(true)
                    }}
                >
                    <Menu />
                </button>
                <SideBar open={sidebarOpen} onChange={setSidebarOpen}>
                    <div className="bg-bg h-full flex flex-col justify-center relative">
                        <div className="absolute top-0 my-4 text-center w-full">
                            <Link to="/" title={data.site.siteMetadata.title} className="inline-block">
                                <Logo
                                    className={`duration-300 transition-all ${
                                        scrolled ? "w-6" : "w-8"
                                    }`}
                                />
                            </Link>
                        </div>
                        <div className="text-center">
                            <List name="sidebar-nav" current={currentLocation} liClassName="block my-2"/>
                        </div>
                    </div>
                </SideBar>
                <Link to="/" title={data.site.siteMetadata.title}>
                    <Logo
                        className={`duration-300 transition-all ${
                            scrolled ? "w-6" : "w-8"
                        }`}
                    />
                </Link>
                <div className="hidden lg:block">
                    <List name="navbar" className="nav-links" current={currentLocation} />
                </div>
                <div className="absolute line h-px left-0 bottom-0 bg-gradient-primary"></div>
            </div>
            {navPlaceholder && (
                <div style={{ height: `${navbarHeight}px` }}></div>
            )}
        </React.Fragment>
    )
}

export default Navbar
