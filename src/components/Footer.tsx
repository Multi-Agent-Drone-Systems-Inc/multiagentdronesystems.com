import React from 'react';
import { Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-[#1A1A1A] relative">
      {/* Texture overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.857 8.485 15.272 9.9l9.9-9.9h-2.83zM32 0l-3.486 3.485 1.415 1.415L34.828.828 32 0zm-6.485 0L16.828 8.687l1.414 1.414 8.485-8.485L25.515 0zm12.97 0l8.486 8.486-1.414 1.415-8.485-8.485L38.485 0zm6.484 0l8.486 8.486-1.414 1.415-8.485-8.485L44.97 0zm-18 0L18.284 8.687l1.414 1.414 8.485-8.485L26.97 0zm-6.484 0L11.8 8.687l1.415 1.414 8.485-8.485L20.485 0zm-6.485 0L5.657 8.343 7.07 9.757 15.557 1.27 14.142 0h-.172zM38.828 0L40.242 1.414 48.728 9.9l1.414-1.415L41.657 0h-2.829zM3.415 0l8.485 8.485-1.414 1.415L2 1.415 3.415 0zm10.313 0l8.485 8.485-1.414 1.415L12.313 1.415 13.728 0zm10.313 0l8.485 8.485-1.414 1.415-8.485-8.485L24.04 0zm10.314 0l8.485 8.485-1.414 1.415-8.485-8.485L34.354 0zm10.313 0l8.485 8.485-1.414 1.415-8.485-8.485L44.667 0zM0 47.373l-.828-.83L0 45.544v2.829zm0-5.657l-.828-.829L0 39.887v2.829zm0-5.657l-.828-.828L0 34.23v2.829zm0-5.657l-.828-.828L0 28.573v2.829zm0-5.657l-.828-.828L0 22.916v2.829zm0-5.657l-.828-.828L0 17.26v2.829zm0-5.657l-.828-.828L0 11.602v2.829zm0-5.657l-.828-.828L0 5.945v2.829zm0-5.657l-.828-.828L0 .288v2.829z' fill='%23FFFFFF' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Logo & Social */}
          <div>
            <img src="/images/logo.png" alt="MADS Logo" className="w-72 h-12 mb-6 mt-[-2px] ml-[-4px]" />
            <p className="text-gray-400 mb-3">
              Revolutionary solutions for tomorrow's challenges
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-[#FFD700] transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#technology"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Our Technology
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Our Drones
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#careers"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <address className="text-gray-400 not-italic mb-4 space-y-2">
              <p>Edmonton, Alberta, Canada</p>
              <p>
                <a 
                  href="mailto:info@multiagentdronesystems.com"
                  className="hover:text-white transition-colors duration-300"
                >
                  info@multiagentdronesystems.com
                </a>
              </p>
              <p>
                <a 
                  href="tel:+17802784283"
                  className="hover:text-white transition-colors duration-300"
                >
                  +1 (780) 278-4283
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col items-center justify-center mb-12 mt-8">
          <div className="flex items-center gap-3 mb-3">
            <h4 className="text-white text-2xl font-bold">Stay Updated</h4>
            <span className="text-gray-400">MADS Newsletter</span>
          </div>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-l focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
            />
            <button
              type="submit"
              className="bg-[#FFD700] text-gray-900 px-8 py-2 rounded-r hover:bg-[#FCC201] transition-colors duration-300 font-medium"
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Multi-Agent Drone Systems Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 text-sm hover:text-white transition-colors duration-300"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;