import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-glass-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-neon-green">Cheapal</h3>
            <p className="mb-6 text-gray-300">
              The best marketplace for shared subscriptions at affordable prices.
            </p>
            <div className="flex space-x-4">
              {[FaFacebook, FaTwitter, FaInstagram].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-xl text-neon-green hover:text-white transition-all duration-300 hover:scale-125"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-neon-green">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Subscriptions', 'Login', 'Register'].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:underline"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-neon-green">Contact Us</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-neon-green" />
                <span>support@cheapal.com</span>
              </div>
              <div className="flex items-center">
                <FaPhone className="mr-2 text-neon-green" />
                <span>+92 123 4567890</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-neon-green" />
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neon-green/20 mt-8 pt-6 text-center text-sm text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} Cheapal. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/privacy"
              className="hover:text-white transition-all duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-white transition-all duration-300"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
