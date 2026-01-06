import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';
import carIcon from '../assets/search for a car (1).png';
import scheduleIcon from '../assets/schedule.png';
import { SHAREFOX_CONFIG } from '../config/sharefox';

const Header = ({ searchTerm, setSearchTerm, rentalDays, setRentalDays, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [landingSearchTerm, setLandingSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isProductsPage = location.pathname === '/products' || location.pathname === '/products-sharefox' || location.pathname === '/search';
  const shopName = SHAREFOX_CONFIG.shopDomain.replace('.mysharefox.com', '');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch();
    } else if (landingSearchTerm && landingSearchTerm.trim()) {
      // Navigate to search page from landing page
      navigate(`/search?q=${encodeURIComponent(landingSearchTerm.trim())}`);
    }
  };

  const handleLandingSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  // Load Sharefox Embed script globally (once)
  useEffect(() => {
    const existingScript = document.getElementById('sharefox-embed-script');
    if (existingScript) {
      // Re-initialize embeds on route change
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
        if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
          window.SharefoxEmbed.init();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'sharefox-embed-script';
    script.setAttribute('data-shop', shopName);
    script.src = `https://${shopName}.mysharefox.com/embed.min.js`;
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        window.dispatchEvent(new Event('DOMContentLoaded'));
        if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
          window.SharefoxEmbed.init();
        }
      }, 500);
    };

    script.onerror = () => {
      console.error('Failed to load Sharefox Embed script');
    };

    document.head.appendChild(script);
  }, [shopName]);

  // Re-initialize embeds when route changes to ensure the search bar is processed
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event('DOMContentLoaded'));
      if (window.SharefoxEmbed && typeof window.SharefoxEmbed.init === 'function') {
        window.SharefoxEmbed.init();
      }
    }, 100);
  }, [location.pathname]);

  // Load auth state from localStorage
  useEffect(() => {
    try {
      const storedLoggedIn = localStorage.getItem('kr_is_logged_in');
      const storedName = localStorage.getItem('kr_user_name');
      if (storedLoggedIn === 'true' && storedName) {
        setIsLoggedIn(true);
        setUserName(storedName);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  const setAuthState = (name) => {
    setIsLoggedIn(true);
    setUserName(name);
    try {
      localStorage.setItem('kr_is_logged_in', 'true');
      localStorage.setItem('kr_user_name', name);
    } catch (e) {
      // ignore storage errors
    }
  };

  // Intercept Sharefox navigation:
  // - If it's a search, route to in-app /search?q=...
  // - Otherwise, force same-tab navigation (no new tabs)
  useEffect(() => {
    const originalWindowOpen = window.open;
    window.open = function(url, target, features) {
      try {
        if (url && url.includes('mysharefox.com')) {
          const parsed = new URL(url);
          const q = parsed.searchParams.get('search') || parsed.searchParams.get('q') || parsed.searchParams.get('query');
          if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
            return null;
          }
          // Any other Sharefox URL: open in same tab
          window.location.href = url;
          return null;
        }
      } catch (e) {
        // ignore parsing errors, fallback to original
      }
      return originalWindowOpen.call(window, url, target, features);
    };

    const handleMessage = (event) => {
      if (event.origin && event.origin.includes('mysharefox.com')) {
        let url = null;
        if (typeof event.data === 'string') {
          url = event.data;
        } else if (typeof event.data === 'object' && event.data) {
          url = event.data.url || event.data.href || event.data.navigate || event.data.link || null;
        }
        if (url && url.includes('mysharefox.com')) {
          try {
            const parsed = new URL(url);
            const q = parsed.searchParams.get('search') || parsed.searchParams.get('q') || parsed.searchParams.get('query');
            if (q) {
              event.preventDefault?.();
              navigate(`/search?q=${encodeURIComponent(q)}`);
              return;
            }
            // Any other Sharefox URL: open in same tab
            event.preventDefault?.();
            window.location.href = url;
          } catch (e) {
            // ignore
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.open = originalWindowOpen;
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  return (
    <header className="header">
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
      <div className="header-top">
        <div className="header-container">
          <Link
            to="/"
            className="logo-section"
            onClick={(e) => {
              e.preventDefault();
              // Force a full refresh to ensure fresh embeds/data
              window.location.href = '/';
            }}
          >
            <img src={logo} alt="KINGO RIDES" className="logo-icon" />
            <div className="logo-text">
              <span className="logo-kingo">KINGO</span>
              <span className="logo-rides">RIDES</span>
            </div>
          </Link>
          
          <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/products-sharefox" className="nav-link" onClick={() => setIsMenuOpen(false)}>FIND A CAR</Link>
            <Link to="/packages" className="nav-link" onClick={() => setIsMenuOpen(false)}>PACKAGES</Link>
            <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>CONTACT US</Link>
          </nav>

          <div className={`account-section ${isMenuOpen ? 'active' : ''}`}>
            {isLoggedIn ? (
              <span className="account-user-name">Hello, {userName}</span>
            ) : (
              <>
                <button className="my-account-btn" onClick={() => { setShowLogin(true); setLoginSubmitted(false); }}>My account</button>
                <button className="create-account-btn" onClick={() => { setShowSignup(true); setSignupSubmitted(false); }}>Create an account</button>
              </>
            )}
          </div>

          <button className="hamburger-menu" onClick={toggleMenu} aria-label="Toggle menu">
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>
      
      {isProductsPage && (
        <div className="search-bar-container">
          <div className="search-bar-wrapper">
            <div
              data-path="search"
              className="sharefox-embed"
              style={{ width: '100%', height: '90px' }}
            />
          </div>
        </div>
      )}
      
      {!isProductsPage && (
        <div className="search-bar-container">
          <div className="search-bar-wrapper">
            <div
              data-path="search"
              className="sharefox-embed"
              style={{ width: '100%', height: '90px' }}
            />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="kr-modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="kr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kr-modal-header">
              <h3 className="kr-modal-title">My Account</h3>
              <button className="kr-modal-close" onClick={() => setShowLogin(false)}>✕</button>
            </div>
            <form
              className="kr-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                setLoginSubmitted(true);
                // Get name (optional) or derive from email
                const nameInput = e.currentTarget.elements['loginName']?.value?.trim();
                const emailInput = e.currentTarget.elements['loginEmail']?.value?.trim();
                let derivedName = nameInput;
                if (!derivedName && emailInput) {
                  const local = emailInput.split('@')[0] || '';
                  derivedName = local
                    .split(/[._-]+/)
                    .filter(Boolean)
                    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ') || 'User';
                }
                if (!derivedName) derivedName = 'User';
                setAuthState(derivedName);
                setTimeout(() => setShowLogin(false), 1200);
              }}
            >
              <div className={`kr-form-group ${loginSubmitted ? 'success' : ''}`}>
                <label>Full Name (optional)</label>
                <input name="loginName" type="text" placeholder="John Doe" />
                {loginSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              <div className={`kr-form-group ${loginSubmitted ? 'success' : ''}`}>
                <label>Email</label>
                <input name="loginEmail" type="email" placeholder="you@example.com" required />
                {loginSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              <div className={`kr-form-group ${loginSubmitted ? 'success' : ''}`}>
                <label>Password</label>
                <input name="loginPassword" type="password" placeholder="••••••••" required />
                {loginSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              {loginSubmitted && (
                <div className="kr-form-success">Successfully signed in!</div>
              )}
              <button type="submit" className="kr-submit-btn" disabled={loginSubmitted}>
                {loginSubmitted ? 'Success' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="kr-modal-overlay" onClick={() => setShowSignup(false)}>
          <div className="kr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kr-modal-header">
              <h3 className="kr-modal-title">Create an Account</h3>
              <button className="kr-modal-close" onClick={() => setShowSignup(false)}>✕</button>
            </div>
            <form
              className="kr-modal-form"
              onSubmit={(e) => {
                e.preventDefault();
                setSignupSubmitted(true);
                const fullName = e.currentTarget.elements['signupName']?.value?.trim() || 'User';
                setAuthState(fullName);
                setTimeout(() => setShowSignup(false), 1200);
              }}
            >
              <div className={`kr-form-group ${signupSubmitted ? 'success' : ''}`}>
                <label>Full Name</label>
                <input name="signupName" type="text" placeholder="John Doe" required />
                {signupSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              <div className={`kr-form-group ${signupSubmitted ? 'success' : ''}`}>
                <label>Email</label>
                <input name="signupEmail" type="email" placeholder="you@example.com" required />
                {signupSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              <div className={`kr-form-group ${signupSubmitted ? 'success' : ''}`}>
                <label>Password</label>
                <input name="signupPassword" type="password" placeholder="Create a strong password" required />
                {signupSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              <div className={`kr-form-group ${signupSubmitted ? 'success' : ''}`}>
                <label>Phone</label>
                <input name="signupPhone" type="tel" placeholder="+1 (555) 123-4567" />
                {signupSubmitted && <span className="kr-input-success">✓ Looks good</span>}
              </div>
              {signupSubmitted && (
                <div className="kr-form-success">Account created successfully!</div>
              )}
              <button type="submit" className="kr-submit-btn" disabled={signupSubmitted}>
                {signupSubmitted ? 'Success' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
