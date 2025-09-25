import { Facebook, Instagram, Twitter } from 'lucide-react'
import React from 'react'

const FooterHome = () => {
  return (
    <div>
      <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                    <img className="h-25" src="/logo.png" alt="dummyLogoDark" />
                    <p className="mt-6 text-sm">
                    At Closet Cartel, we bring you curated fashion with uncompromising quality. 
                    From timeless classics to the latest trends, every piece is handpicked for style, 
                    comfort, and durability. Shop with confidence — 100% secure payments and easy returns.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Socials</h2>
                        <ul className="flex-1 flex items-center text-sm gap-2">
      {/* Instagram with gradient */}
      <li>
        <a
          href="https://www.instagram.com/closetcartel.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="group-hover:scale-105 transition  max-w-26 md:max-w-36"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#feda75" />
                <stop offset="30%" stopColor="#fa7e1e" />
                <stop offset="60%" stopColor="#d62976" />
                <stop offset="100%" stopColor="#962fbf" />
              </linearGradient>
            </defs>
            <g stroke="url(#ig-gradient)" strokeWidth="2" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="5" />
              <circle cx="12" cy="12" r="3.5" />
              <circle cx="16.5" cy="7.5" r="0.5" />
            </g>
          </svg>
        </a>
      </li>

      {/* Facebook */}
      <li>
        <a href="#" className="text-[#1877F2]">
          <Facebook className="w-6 h-6" />
        </a>
      </li>

      {/* Twitter */}
      <li>
        <a href="#" className="text-[#1DA1F2]">
          <Twitter className="w-6 h-6" />
        </a>
      </li>
    </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-white mb-5">Subscribe for Latest deals and Drops</h2>
                        <div className="text-sm space-y-2">
                            {/* <p>The latest deals and drops in your inbox!.</p> */}
                            <div className="flex items-center gap-2 pt-4">
                                <input className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-nav outline-none w-full max-w-64 h-9 rounded px-2" type="email" placeholder="Enter your email" />
                                <button className="bg-white w-24 h-9 text-black rounded hover:bg-black hover:text-white transition duration-200 delay-200 cursor-pointer">Subscribe</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2024 © <a href="https://prebuiltui.com">Closet Cartel</a>. All Right Reserved.
            </p>
        </footer>
    </div>
  )
}

export default FooterHome
