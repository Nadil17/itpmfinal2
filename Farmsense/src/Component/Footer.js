import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
          <h3 className="text-2xl font-bold text-white hover:text-green-200 transition-all">
  <span className="text-yellow-400">Farm</span>Sense
</h3>

            <p className="text-green-200 mb-4">
              Innovative solutions for sustainable agriculture and precision farming.
            </p>
            <div className="flex space-x-4">
              <button className="hover:text-green-300 transition">
                <Facebook className="w-6 h-6" />
              </button>
              <button className="hover:text-green-300 transition">
                <Twitter className="w-6 h-6" />
              </button>
              <button className="hover:text-green-300 transition">
                <Instagram className="w-6 h-6" />
              </button>
              <button className="hover:text-green-300 transition">
                <Linkedin className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', link: '#' },
                { name: 'Services', link: '#' },
                { name: 'Features', link: '#' },
                { name: 'About Us', link: '#' },
                { name: 'Contact', link: '#' }
              ].map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.link} 
                    className="text-green-200 hover:text-white transition"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                'Crop Nutrition Analysis',
                'Fertilizer Recommendations',
                'Soil Health Monitoring',
                'Yield Optimization',
                'Agricultural Consulting'
              ].map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-green-200 hover:text-white transition"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-300" />
                <span className="text-green-200">info@fertilizerpro.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-300" />
                <span className="text-green-200">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-green-300" />
                <span className="text-green-200">123 Farm Tech Road, AgriHub, USA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p className="text-green-300">
            © 2024 FertilizerPro. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
