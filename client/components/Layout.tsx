import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, LogOut, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { getUser, logout, getCart } from "@/utils/storage";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const user = getUser();
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);

  const categories = [
    { label: "Cement", href: "/shop?category=Cement" },
    { label: "Steel Rods", href: "/shop?category=Steel Rods" },
    { label: "Bricks", href: "/shop?category=Bricks" },
    { label: "Sand", href: "/shop?category=Sand" },
    { label: "Tiles", href: "/shop?category=Tiles & Marble" },
    { label: "Pipes", href: "/shop?category=Pipes & Plumbing" },
    { label: "Paints", href: "/shop?category=Paints" },
    { label: "Tools", href: "/shop?category=Construction Tools" },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-[#B22222]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}

            <Link to="/" className="flex items-center gap-3 font-bold text-2xl flex-shrink-0">
              <img
                src="/logo.png"
                alt="BricksKart Logo"
                className="h-[70px] w-auto object-contain"
              />

              <span className="text-white tracking-wide">
                BricksKart
              </span>
            </Link>


            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-xs mx-2">
              <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 gap-2">
                <Search size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-6">
                {user ? (
                  <>
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-600 hover:text-pink-600 transition-colors flex items-center gap-1"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-gray-700 hover:text-[#B22222] transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-[#B22222] transition-colors"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-600 hover:text-pink-600"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Category Menu - Desktop */}
          <div className="hidden lg:flex items-center gap-6 overflow-x-auto py-2 border-t border-gray-100 text-sm">
            <Link to="/" className="font-semibold text-gray-700 hover:text-pink-600 whitespace-nowrap">
              Home
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.href}
                to={cat.href}
                className="text-gray-600 hover:text-[#B22222] whitespace-nowrap transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2 mb-4">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              <Link
                to="/"
                className="block px-4 py-2 font-semibold text-gray-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  to={cat.href}
                  className="block px-4 py-2 text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}

              <div className="border-t pt-3 mt-3 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-600">Logged in as {user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-[#B22222] hover:bg-[#B22222]/10 rounded-lg"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 font-semibold hover:text-pink-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 text-lg"><img
                src="/logo.png"
                alt="BricksKart Logo"
                className="h-[70px] w-auto object-contain"
              /></h3>
              <p className="text-sm">Your trusted partner for premium construction materials.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="hover:text-yellow-400 transition-colors">Shop</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Cement</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Steel Rods</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="tel:+919876543210" className="hover:text-pink-400 transition-colors">+91 98765 43210</a></li>
                <li><a href="mailto:info@Brickskart.com" className="hover:text-pink-400 transition-colors">info@Brickskart.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm">&copy; 2024 BricksKart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
