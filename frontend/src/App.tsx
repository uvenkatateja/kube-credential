import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Issue from './pages/Issue';
import Verify from './pages/Verify';
import Landing from './components/Landing';
import './index.css'

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route 
            path="/issue" 
            element={
              <div className="min-h-screen bg-white flex flex-col">
                <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors" onClick={closeMobileMenu}>
                        Kube Credential
                      </Link>
                      
                      <div className="hidden md:flex space-x-8">
                        <Link to="/issue" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                          Issue Credential
                        </Link>
                        <Link to="/verify" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                          Verify Credential
                        </Link>
                      </div>

                      <div className="md:hidden">
                        <button
                          onClick={toggleMobileMenu}
                          className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    {mobileMenuOpen && (
                      <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-4">
                          <Link 
                            to="/issue" 
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                            onClick={closeMobileMenu}
                          >
                            Issue Credential
                          </Link>
                          <Link 
                            to="/verify" 
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                            onClick={closeMobileMenu}
                          >
                            Verify Credential
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
                <main className="flex-1 bg-white">
                  <Issue />
                </main>
                <footer className="bg-gray-50 border-t border-gray-200 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600">&copy; 2025 Kube Credential System - Zupple Labs Assignment</p>
                  </div>
                </footer>
              </div>
            } 
          />
          <Route 
            path="/verify" 
            element={
              <div className="min-h-screen bg-white flex flex-col">
                <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors" onClick={closeMobileMenu}>
                        Kube Credential
                      </Link>
                      
                      <div className="hidden md:flex space-x-8">
                        <Link to="/issue" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                          Issue Credential
                        </Link>
                        <Link to="/verify" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                          Verify Credential
                        </Link>
                      </div>

                      <div className="md:hidden">
                        <button
                          onClick={toggleMobileMenu}
                          className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                          </svg>
                        </button>
                      </div>
                    </div>

                    {mobileMenuOpen && (
                      <div className="md:hidden border-t border-gray-200 py-4">
                        <div className="flex flex-col space-y-4">
                          <Link 
                            to="/issue" 
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                            onClick={closeMobileMenu}
                          >
                            Issue Credential
                          </Link>
                          <Link 
                            to="/verify" 
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors px-2 py-1"
                            onClick={closeMobileMenu}
                          >
                            Verify Credential
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
                <main className="flex-1 bg-white">
                  <Verify />
                </main>
                <footer className="bg-gray-50 border-t border-gray-200 py-8">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-600">&copy; 2025 Kube Credential System - Zupple Labs Assignment</p>
                  </div>
                </footer>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App