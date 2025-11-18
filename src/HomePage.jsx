import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPalette,
  faBolt,
  faWandMagicSparkles,
  faMobileScreen,
  faShareNodes,
  faChartLine,
  faTimes,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faGlobe,
  faChevronLeft,
  faChevronRight,
  faDesktop,
  faMobile,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faLinkedinIn, 
  faGithub,
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';

// Logo from public folder
const logoImage = '/Logo.png';

export default function HomePage({ onSignInClick, onViewPricing }) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [viewMode, setViewMode] = useState('desktop');

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

  const demoCards = [
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Senior Product Designer',
      company: 'Cosma Tech',
      email: 'sarah.johnson@cosma.com',
      phone: '+84 901 234 567',
      location: 'Ho Chi Minh City, Vietnam',
      website: 'www.sarahjohnson.com',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&size=200&background=667eea&color=fff&bold=true',
      theme: {
        name: 'Purple Dream',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        primary: '#667eea'
      }
    },
    {
      id: 2,
      name: 'Michael Chen',
      title: 'Full Stack Developer',
      company: 'Tech Innovations',
      email: 'michael.chen@tech.io',
      phone: '+84 912 345 678',
      location: 'Hanoi, Vietnam',
      website: 'www.michaelchen.dev',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&size=200&background=FF6B6B&color=fff&bold=true',
      theme: {
        name: 'Sunset Orange',
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FFA500 50%, #FFD700 100%)',
        primary: '#FF6B6B'
      }
    },
    {
      id: 3,
      name: 'Emma Williams',
      title: 'Marketing Director',
      company: 'Brand Studio',
      email: 'emma.w@brandstudio.com',
      phone: '+84 923 456 789',
      location: 'Da Nang, Vietnam',
      website: 'www.emmawilliams.co',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Williams&size=200&background=00C9FF&color=fff&bold=true',
      theme: {
        name: 'Ocean Blue',
        background: 'linear-gradient(135deg, #00C9FF 0%, #0084FF 50%, #667eea 100%)',
        primary: '#00C9FF'
      }
    },
    {
      id: 4,
      name: 'David Park',
      title: 'UI/UX Designer',
      company: 'Creative Labs',
      email: 'david.park@creative.co',
      phone: '+84 934 567 890',
      location: 'Ho Chi Minh City, Vietnam',
      website: 'www.davidpark.design',
      avatar: 'https://ui-avatars.com/api/?name=David+Park&size=200&background=34D399&color=fff&bold=true',
      theme: {
        name: 'Emerald Green',
        background: 'linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)',
        primary: '#34D399'
      }
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      title: 'Business Consultant',
      company: 'Strategy Inc',
      email: 'lisa@strategyinc.com',
      phone: '+84 945 678 901',
      location: 'Singapore',
      website: 'www.lisaanderson.biz',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&size=200&background=F472B6&color=fff&bold=true',
      theme: {
        name: 'Pink Blossom',
        background: 'linear-gradient(135deg, #F472B6 0%, #EC4899 50%, #DB2777 100%)',
        primary: '#F472B6'
      }
    }
  ];

  const currentCard = demoCards[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % demoCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + demoCards.length) % demoCards.length);
  };

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
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
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
        .modal-overlay {
          animation: fadeInUp 0.3s ease-out;
        }
        .modal-content {
          animation: modalFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-slide-in {
          animation: slideInFromRight 0.5s ease-out;
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255, 203, 102, 0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        .theme-dot {
          transition: all 0.3s ease;
        }
        .theme-dot:hover {
          transform: scale(1.2);
        }
        .theme-dot.active {
          transform: scale(1.3);
          box-shadow: 0 0 20px currentColor;
        }
        .demo-card-3d {
          transform-style: preserve-3d;
          transition: transform 0.6s;
        }
        .demo-card-3d:hover {
          transform: rotateY(2deg) rotateX(2deg);
        }
      `}</style>

      {/* Demo Modal */}
      {showDemoModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 modal-overlay"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' }}
          onClick={() => setShowDemoModal(false)}
        >
          <div 
            className="relative w-full max-w-5xl modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDemoModal(false)}
              className="absolute -top-2 -right-2 md:-top-3 md:-right-3 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white hover:scale-110 hover:rotate-90 transition-all shadow-2xl"
              style={{ backgroundColor: '#ffcb66' }}
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg md:text-xl text-black" />
            </button>

            {/* Modal Content */}
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: '#003540' }}>
              {/* Header */}
              <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #00343d 0%, #004d5c 100%)' }}>
                <div className="absolute inset-0 shimmer"></div>
                <div className="relative px-3 py-3 md:px-6 md:py-4">
                  <div className="flex items-center justify-between flex-col md:flex-row gap-2 md:gap-0">
                    <div className="text-center md:text-left">
                      <h2 className="text-xl md:text-3xl font-bold text-white mb-0.5 md:mb-1">Interactive Demo</h2>
                      <p className="text-gray-300 text-xs md:text-sm">Explore {demoCards.length} stunning designs</p>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-black/30 rounded-full p-0.5 md:p-1">
                      <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-2 py-1 md:px-3 rounded-full transition-all text-xs md:text-sm ${
                          viewMode === 'desktop' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FontAwesomeIcon icon={faDesktop} className="mr-1" />
                        Desktop
                      </button>
                      <button
                        onClick={() => setViewMode('mobile')}
                        className={`px-2 py-1 md:px-3 rounded-full transition-all text-xs md:text-sm ${
                          viewMode === 'mobile' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <FontAwesomeIcon icon={faMobile} className="mr-1" />
                        Mobile
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Card Display */}
              <div className="p-2 md:p-4">
                {/* Theme Selector + Card Info */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-2 md:mb-3">
                  <div className="flex items-center gap-1.5 md:gap-2 bg-black/30 rounded-full px-2 md:px-3 py-1 md:py-1.5">
                    {demoCards.map((card, idx) => (
                      <button
                        key={card.id}
                        onClick={() => setCurrentCardIndex(idx)}
                        className={`theme-dot w-4 h-4 md:w-5 md:h-5 rounded-full border ${
                          idx === currentCardIndex ? 'active border-white scale-125' : 'border-transparent'
                        }`}
                        style={{ background: card.theme.primary }}
                        title={card.theme.name}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1.5 md:gap-2 bg-black/30 rounded-full px-2 md:px-3 py-1 md:py-1.5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentCard.theme.primary }}></div>
                    <span className="text-white text-xs font-medium">{currentCard.theme.name}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-gray-300 text-xs">{currentCardIndex + 1}/{demoCards.length}</span>
                  </div>
                </div>

                {/* Card with Navigation */}
                <div className="relative">
                  <button
                    onClick={prevCard}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-3 z-10 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-black text-xs md:text-sm" />
                  </button>

                  <button
                    onClick={nextCard}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-3 z-10 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                    style={{ backgroundColor: '#ffcb66' }}
                  >
                    <FontAwesomeIcon icon={faChevronRight} className="text-black text-xs md:text-sm" />
                  </button>

                  {/* Card Preview */}
                  <div className={`${viewMode === 'mobile' ? 'max-w-[240px] md:max-w-xs' : 'max-w-lg md:max-w-2xl'} mx-auto transition-all duration-500`}>
                    <div className="demo-card-3d card-slide-in">
                      <div 
                        className="w-full rounded-xl md:rounded-2xl shadow-2xl overflow-hidden"
                        style={{
                          aspectRatio: viewMode === 'mobile' ? '9 / 12' : '700 / 360',
                          background: currentCard.theme.background
                        }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                          <div className="absolute top-4 right-4 md:top-6 md:right-6 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 blur-2xl"></div>
                          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 blur-2xl"></div>
                        </div>

                        <div className={`relative h-full flex ${viewMode === 'mobile' ? 'flex-col' : 'flex-row'} text-white`}>
                          <div className={`${viewMode === 'mobile' ? 'w-full py-2' : 'w-2/5 py-3 md:py-4'} flex flex-col items-center justify-center px-2 md:px-4 ${viewMode === 'mobile' ? 'border-b' : 'border-r'} border-white/20`}>
                            <div className={`${viewMode === 'mobile' ? 'w-10 h-10 md:w-14 md:h-14' : 'w-16 h-16 md:w-20 md:h-20'} rounded-full border-2 border-white/30 overflow-hidden shadow-xl mb-1 md:mb-2`}>
                              <img 
                                src={currentCard.avatar} 
                                alt={currentCard.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h2 className={`${viewMode === 'mobile' ? 'text-xs md:text-sm' : 'text-base md:text-lg'} font-bold mb-0.5 text-center`}>{currentCard.name}</h2>
                            <p className={`${viewMode === 'mobile' ? 'text-xs' : 'text-xs md:text-sm'} opacity-90 text-center leading-tight`}>{currentCard.title}</p>
                            <p className="text-xs opacity-75 text-center">{currentCard.company}</p>
                          </div>

                          <div className={`flex-1 flex flex-col justify-center ${viewMode === 'mobile' ? 'p-2 space-y-1' : 'p-3 md:p-4'}`}>
                            <div className={`${viewMode === 'mobile' ? 'space-y-0.5' : 'space-y-1 md:space-y-1.5'} ${viewMode === 'mobile' ? 'mb-1' : 'mb-2 md:mb-3'}`}>
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs">
                                <div className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} rounded-full bg-white/20 flex items-center justify-center flex-shrink-0`}>
                                  <FontAwesomeIcon icon={faEnvelope} className={viewMode === 'mobile' ? 'text-xs' : 'text-xs'} />
                                </div>
                                <span className="truncate text-xs">{currentCard.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs">
                                <div className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} rounded-full bg-white/20 flex items-center justify-center flex-shrink-0`}>
                                  <FontAwesomeIcon icon={faPhone} className={viewMode === 'mobile' ? 'text-xs' : 'text-xs'} />
                                </div>
                                <span className="text-xs">{currentCard.phone}</span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs">
                                <div className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} rounded-full bg-white/20 flex items-center justify-center flex-shrink-0`}>
                                  <FontAwesomeIcon icon={faMapMarkerAlt} className={viewMode === 'mobile' ? 'text-xs' : 'text-xs'} />
                                </div>
                                <span className="truncate text-xs">{currentCard.location}</span>
                              </div>
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs">
                                <div className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} rounded-full bg-white/20 flex items-center justify-center flex-shrink-0`}>
                                  <FontAwesomeIcon icon={faGlobe} className={viewMode === 'mobile' ? 'text-xs' : 'text-xs'} />
                                </div>
                                <span className="truncate text-xs">{currentCard.website}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs opacity-70 mb-0.5">Connect:</p>
                              <div className="flex gap-1 md:gap-1.5">
                                {[faFacebookF, faLinkedinIn, faGithub, faTwitter].map((icon, idx) => (
                                  <a 
                                    key={idx}
                                    className={`${viewMode === 'mobile' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer`}
                                  >
                                    <FontAwesomeIcon icon={icon} className="text-xs" />
                                  </a>
                                ))}
                              </div>
                            </div>

                            <div className="mt-1 md:mt-1.5 text-right">
                              <p className="text-xs opacity-40">Powered by Cosma</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA + Features */}
                <div className="mt-3 md:mt-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3">
                  <div className="hidden sm:flex gap-1.5 md:gap-2 flex-1 w-full md:w-auto">
                    <div className="bg-black/20 rounded-lg px-1.5 py-1 md:px-2 md:py-1.5 text-center flex-1">
                      <FontAwesomeIcon icon={faPalette} className="text-sm md:text-base mb-0.5" style={{ color: '#ffcb66' }} />
                      <p className="text-white text-xs">50+ Templates</p>
                    </div>
                    <div className="bg-black/20 rounded-lg px-1.5 py-1 md:px-2 md:py-1.5 text-center flex-1">
                      <FontAwesomeIcon icon={faQrcode} className="text-sm md:text-base mb-0.5" style={{ color: '#ffcb66' }} />
                      <p className="text-white text-xs">QR Code</p>
                    </div>
                    <div className="bg-black/20 rounded-lg px-1.5 py-1 md:px-2 md:py-1.5 text-center flex-1">
                      <FontAwesomeIcon icon={faChartLine} className="text-sm md:text-base mb-0.5" style={{ color: '#ffcb66' }} />
                      <p className="text-white text-xs">Analytics</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={onSignInClick}
                      className="flex-1 md:flex-initial px-3 md:px-5 py-2 rounded-full font-semibold text-xs md:text-sm hover:scale-105 transition-all shadow-xl whitespace-nowrap"
                      style={{ backgroundColor: '#ffcb66', color: '#000' }}
                    >
                      Create Now →
                    </button>
                    <button
                      onClick={() => setShowDemoModal(false)}
                      className="flex-1 md:flex-initial px-3 md:px-4 py-2 border border-white/30 text-white rounded-full font-semibold text-xs md:text-sm hover:bg-white/10 transition-all whitespace-nowrap"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

          <nav className="hidden md:flex gap-8 text-white font-medium">
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
            <button onClick={onViewPricing} className="hover:text-yellow-400 transition-colors">Pricing</button>
          </nav>

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

            <div className="flex gap-4 pt-4">
              <button 
                onClick={onSignInClick}
                className="px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl" 
                style={{ backgroundColor: '#ffcb66', color: '#000000' }}
              >
                Create Free Card →
              </button>
              <button 
                onClick={() => setShowDemoModal(true)}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-teal-900 transition-all duration-300"
              >
                View Demo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

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
                <li><a href="#features" className="hover:text-yellow-400 transition-colors">Features</a></li>
                <li><button onClick={onViewPricing} className="hover:text-yellow-400 transition-colors">Pricing</button></li>
                <li><a href="#" className="hover:text-yellow-400 transition-colors">Templates</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-yellow-400 transition-colors">About</a></li>
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