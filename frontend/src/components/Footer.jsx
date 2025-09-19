import React from 'react';
import { MessageCircle, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">HealthCare AI</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              A multilingual AI healthcare chatbot providing vaccination reminders, 
              outbreak alerts, and health guidance through WhatsApp and SMS.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <Phone className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-primary transition-colors">Home</a></li>
              <li><a href="/chatbot" className="text-gray-300 hover:text-primary transition-colors">Chatbot</a></li>
              <li><a href="/register" className="text-gray-300 hover:text-primary transition-colors">Register</a></li>
              <li><a href="/admin" className="text-gray-300 hover:text-primary transition-colors">Admin</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-gray-300">healthcare@ai.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-gray-300">India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 HealthCare AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span className="text-gray-400 text-sm">for SIH 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
