"use client";

import React, { useState } from "react";
import { MessageCircle, X, Phone, Clock } from "lucide-react";

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "+923018465322";
  const whatsappMessage = "Hello! I'm interested in your real estate services. Can you help me find a property?";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleCallClick = () => {
    window.location.href = `tel:${whatsappNumber}`;
    setIsOpen(false);
  };

  return (
    <>
      {/* Main WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className={`transition-all duration-300 ${isOpen ? 'mb-4' : 'mb-0'}`}>
          {/* Expanded Menu */}
          {isOpen && (
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 mb-4 p-4 w-80 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Zameen Khatta</h3>
                    <p className="text-sm text-green-600">Online Now</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Hi there! 👋 How can we help you with your property needs today?
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">Chat on WhatsApp</div>
                    <div className="text-sm text-gray-600">Get instant replies</div>
                  </div>
                </button>
                
                <button
                  onClick={handleCallClick}
                  className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">Call Us</div>
                    <div className="text-sm text-gray-600">{whatsappNumber}</div>
                  </div>
                </button>
              </div>
              
              <div className="flex items-center space-x-1 mt-3 pt-3 border-t border-gray-100">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Available 24/7</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          {isOpen ? (
            <X className="h-8 w-8 text-white transition-transform duration-300" />
          ) : (
            <MessageCircle className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />
          )}
          
          {/* Pulse Animation */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25"></div>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-30"></div>
            </>
          )}
          
          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute right-full mr-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with us on WhatsApp
              <div className="absolute top-1/2 left-full w-0 h-0 border-l-4 border-l-gray-800 border-t-4 border-t-transparent border-b-4 border-b-transparent transform -translate-y-1/2"></div>
            </div>
          )}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default WhatsAppFloat;
