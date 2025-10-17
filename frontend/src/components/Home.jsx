import React from "react";  
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-green-600 mb-4">
            🌱 GreenTrip
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            Travel Smarter, Travel Greener
          </p>
          <p className="text-lg text-gray-600">
            Share rides, reduce emissions, save money
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🚗</div>
              <h3 className="font-bold text-lg mb-2">Share Rides</h3>
              <p className="text-gray-600 text-sm">
                Find or offer carpooling options
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-bold text-lg mb-2">Save Money</h3>
              <p className="text-gray-600 text-sm">
                Split costs with fellow travelers
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-bold text-lg mb-2">Help Planet</h3>
              <p className="text-gray-600 text-sm">
                Reduce carbon footprint together
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 text-center"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm">
          <p>Join thousands of eco-conscious travelers</p>
        </div>
      </div>
    </div>
  );
}