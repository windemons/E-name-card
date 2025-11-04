import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPalette,
  faBolt,
  faWandMagicSparkles,
  faMobileScreen,
  faShareNodes,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';

// Logo from public folder
const logoImage = '/Logo.png';

export default function HomePage({ onSignInClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="animate-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: faPalette,
      iconColor: "#ffcb66",
      title: "Professional Templates",
      desc: "Over 50+ professional, modern templates that are easy to customize"
    },
    {
      icon: faBolt,
      iconColor: "#ffcb66",
      title: "Fast & Easy",
      desc: "Create your digital business card in just 3 minutes with a user-friendly interface"
    },
    {
      icon: faWandMagicSparkles,
      iconColor: "#ffcb66",
      title: "Fully Customizable",
      desc: "Customize colors, fonts, logos, and content to match your personal style"
    },
    {
      icon: faMobileScreen,
      iconColor: "#ffcb66",
      title: "Mobile Optimized",
      desc: "Perfect display on all devices from smartphones to computers"
    },
    {
      icon: faShareNodes,
      iconColor: "#ffcb66",
      title: "Easy Sharing",
      desc: "Share via QR code, link, or integrate into email signature"
    },
    {
      icon: faChartLine,
      iconColor: "#ffcb66",
      title: "Analytics Dashboard",
      desc: "Track views, interactions, and effectiveness of your business card"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50+", label: "Templates" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#00343d' }}>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-on-scroll {
          opacity: 0;
        }
        .animate-on-scroll.visible {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffcb66 0%, #ffd966 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(255, 203, 102, 0.3);
        }
        .glow-effect {
          box-shadow: 0 0 30px rgba(255, 203, 102, 0.5);
        }
        .icon-container {
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(255, 203, 102, 0.15) 0%, rgba(255, 203, 102, 0.05) 100%);
          border: 2px solid rgba(255, 203, 102, 0.3);
          transition: all 0.3s ease;
        }
        .card-hover:hover .icon-container {
          transform: translateY(-5px);
          background: linear-gradient(135deg, rgba(255, 203, 102, 0.25) 0%, rgba(255, 203, 102, 0.15) 100%);
          border-color: rgba(255, 203, 102, 0.6);
          box-shadow: 0 10px 30px rgba(255, 203, 102, 0.3);
        }
      `}</style>

      {/* Header */}
      <header 
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 ? 'rgba(0, 52, 61, 0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
          boxShadow: scrollY > 50 ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none',
          height: '80px'
        }}
      >
        <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <h2 className="text-3xl font-bold text-white leading-none">Cosma</h2>
            <img 
              src={logoImage}
              alt="Cosma Logo" 
              className="object-contain"
              style={{ 
                width: '100px',
                height: '100px',
                transform: 'rotate(-20deg)',
                marginLeft: '-30px',
                marginTop: '2px'
              }}
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 text-white font-medium">
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <a href="#pricing" className="hover:text-yellow-400 transition-colors">Pricing</a>
          </nav>

          {/* Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onSignInClick}
              className="px-6 py-2 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-teal-900 transition-all duration-300"
            >
              Sign in
            </button>
            <button 
              onClick={onSignInClick}
              className="px-6 py-2 rounded-full font-medium hover:scale-105 transition-all duration-300 glow-effect" 
              style={{ backgroundColor: '#ffcb66', color: '#000000' }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <div className="inline-block px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 text-sm font-semibold mb-4">
               Create Your Digital Identity
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-tight">
              Your Digital
              <span className="gradient-text block">Business Card</span>
              Reimagined
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed max-w-xl">
              Create professional digital business cards in minutes. No design skills needed, 
              just choose a template and customize it to your style.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4">
              <button 
                onClick={onSignInClick}
                className="px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl" 
                style={{ backgroundColor: '#ffcb66', color: '#000000' }}
              >
                Create Free Card →
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-teal-900 transition-all duration-300">
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="float-animation">
              <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#ffcb66' }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-24 h-24 rounded-full bg-teal-900 mx-auto flex items-center justify-center text-4xl">
                      👤
                    </div>
                    <h3 className="text-2xl font-bold text-teal-900">John Doe</h3>
                    <p className="text-teal-800">Fullstack Developer</p>
                    <div className="flex justify-center gap-3 pt-4">
                      <div className="w-10 h-10 rounded-full bg-teal-900"></div>
                      <div className="w-10 h-10 rounded-full bg-teal-900"></div>
                      <div className="w-10 h-10 rounded-full bg-teal-900"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-2xl shadow-xl float-animation" style={{ backgroundColor: '#1a5f6f', animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-2xl shadow-xl float-animation" style={{ backgroundColor: '#ffd966', animationDelay: '1s' }}></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div 
            id="animate-features-title"
            className={`text-center mb-16 animate-on-scroll ${isVisible['animate-features-title'] ? 'visible' : ''}`}
          >
            <div className="inline-block px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 text-sm font-semibold mb-4">
              Why Choose Cosma
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The perfect tool to create and manage professional digital business cards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                id={`animate-feature-${idx}`}
                className={`card-hover p-8 rounded-2xl border-2 border-gray-700 animate-on-scroll ${isVisible[`animate-feature-${idx}`] ? 'visible' : ''}`}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div className="icon-container mb-6">
                  <FontAwesomeIcon 
                    icon={feature.icon} 
                    className="text-3xl"
                    style={{ color: feature.iconColor }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-8" style={{ backgroundColor: 'rgba(255, 203, 102, 0.05)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div 
              id="animate-about-image"
              className={`animate-on-scroll ${isVisible['animate-about-image'] ? 'visible' : ''}`}
            >
              <div className="relative">
                <div className="w-full h-96 rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#ffcb66' }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6 p-8">
                      <div className="text-8xl">💼</div>
                      <h3 className="text-3xl font-bold text-teal-900">Modern Design</h3>
                      <p className="text-teal-800">Professional & Elegant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div 
              id="animate-about-content"
              className={`space-y-6 animate-on-scroll ${isVisible['animate-about-content'] ? 'visible' : ''}`}
            >
              <div className="inline-block px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 text-sm font-semibold">
                About Cosma
              </div>
              
              <h2 className="text-5xl font-bold text-white leading-tight">
                Leading Digital Business Card
                <span className="gradient-text block">Platform in Vietnam</span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Cosma was developed with the goal of bringing a modern, professional, 
                and easy-to-use digital business card solution for everyone. We believe 
                that every individual and business deserves an impressive digital business card.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#ffcb66' }}>
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Easy to Use</h4>
                    <p className="text-gray-400">User-friendly interface, no design skills required</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#ffcb66' }}>
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Professional Quality</h4>
                    <p className="text-gray-400">Templates designed by professional experts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: '#ffcb66' }}>
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">24/7 Support</h4>
                    <p className="text-gray-400">Dedicated support team, ready to help</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={onSignInClick}
                className="px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl mt-6" 
                style={{ backgroundColor: '#ffcb66', color: '#000000' }}
              >
                Start Creating Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div 
          id="animate-cta"
          className={`max-w-5xl mx-auto text-center rounded-3xl p-16 animate-on-scroll ${isVisible['animate-cta'] ? 'visible' : ''}`}
          style={{ backgroundColor: '#ffcb66' }}
        >
          <h2 className="text-5xl font-bold text-teal-900 mb-6">
            Ready to Create Your Digital Card?
          </h2>
          <p className="text-teal-800 text-xl mb-8 max-w-2xl mx-auto">
            Join over 10,000+ users who are using Cosma to create 
            professional digital business cards
          </p>
          <button 
            onClick={onSignInClick}
            className="px-12 py-5 bg-teal-900 text-white rounded-full font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl"
          >
            Get Started - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-white leading-none">Cosma</h3>
                <img 
                  src={logoImage}
                  alt="Cosma Logo" 
                  className="object-contain"
                  style={{ 
                    width: '70px',
                    height: '70px',
                    transform: 'rotate(-20deg)',
                    marginLeft: '-20px',
                    marginTop: '2px'
                  }}
                />
              </div>
              <p className="text-gray-400">
                Create professional digital business cards in minutes
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 Cosma E-name Card. All rights reserved. Made with ❤️ in Vietnam</p>
          </div>
        </div>
      </footer>
    </div>
  );
}