import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck,
  faTimes,
  faUser,
  faUsers,
  faStar,
  faRocket,
  faCrown,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const logoImage = '/Logo.png';

export default function PricingPage({ onBackToHome, onGetStarted }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFAQ, setActiveFAQ] = useState(null);

  // Pricing plans
  const pricingPlans = {
    personal: {
      free: {
        name: 'Personal Free',
        icon: faUser,
        color: '#3b82f6',
        price: { monthly: 0, yearly: 0 },
        description: 'Try out with 1 test card',
        features: [
          { text: '1 Test Card (Limited features)', included: true },
          { text: 'Basic Templates (Classic theme only)', included: true },
          { text: 'Basic QR Code', included: true },
          { text: 'No Analytics', included: false },
          { text: 'Cosma Branding Required', included: false },
          { text: 'Premium Themes', included: false },
          { text: 'Custom QR Decorations', included: false },
          { text: 'Contact Management', included: false }
        ],
        cta: 'Try Free Test Card',
        popular: false,
        note: '⚠️ Limited trial - Upgrade to unlock all features'
      },
      premium: {
        name: 'Personal Premium',
        icon: faStar,
        color: '#f59e0b',
        price: { monthly: 49000, yearly: 490000 },
        description: 'Full access for professionals',
        features: [
          { text: 'Unlimited Digital Cards', included: true },
          { text: 'All 50+ Premium Themes', included: true },
          { text: 'Advanced QR Customization', included: true },
          { text: 'Unlimited Contacts', included: true },
          { text: 'Analytics Dashboard', included: true },
          { text: 'Remove Cosma Branding', included: true },
          { text: 'Priority Support', included: true },
          { text: 'Export & API Access', included: true }
        ],
        cta: 'Upgrade to Premium',
        popular: true,
        savings: billingCycle === 'yearly' ? 'Save 100,000đ' : null
      }
    },
    business: {
      starter: {
        name: 'Business Starter',
        icon: faUsers,
        color: '#10b981',
        price: { monthly: 199000, yearly: 1990000 },
        description: 'For small teams (5 members)',
        features: [
          { text: '5 Team Members', included: true },
          { text: 'All Premium Features', included: true },
          { text: 'Team Management', included: true },
          { text: 'Centralized Contacts', included: true },
          { text: 'Company Branding', included: true },
          { text: 'Team Analytics', included: true },
          { text: 'Priority Support', included: true }
        ],
        cta: 'Start Free Trial',
        popular: false,
        trial: '14-day free trial',
        savings: billingCycle === 'yearly' ? 'Save 400,000đ' : null
      },
      enterprise: {
        name: 'Business Enterprise',
        icon: faCrown,
        color: '#8b5cf6',
        price: { monthly: 499000, yearly: 4990000 },
        description: 'For large organizations',
        features: [
          { text: 'Unlimited Team Members', included: true },
          { text: 'All Business Features', included: true },
          { text: 'Advanced Permissions', included: true },
          { text: 'White-Label Solution', included: true },
          { text: 'Custom Domain', included: true },
          { text: 'Advanced Analytics', included: true },
          { text: 'Dedicated Manager', included: true },
          { text: 'SLA 99.9% Uptime', included: true }
        ],
        cta: 'Contact Sales',
        popular: true,
        savings: billingCycle === 'yearly' ? 'Save 1,000,000đ' : null
      }
    }
  };

  // FAQ data
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and Vietnamese payment methods including Momo, ZaloPay, and VNPay.'
    },
    {
      question: 'Can I switch plans later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, your new rate will apply at the next billing cycle.'
    },
    {
      question: 'What happens to my data if I downgrade?',
      answer: 'Your data is always safe. When downgrading, features that are no longer available will be locked, but your data is preserved. If you upgrade again, everything will be restored.'
    },
    {
      question: 'Is there a free trial for Business plans?',
      answer: 'Yes! Business Starter and Enterprise plans come with a 14-day free trial. No credit card required to start the trial.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely! You can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team for a full refund.'
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleSelectPlan = (planType, tier) => {
    console.log('Selected plan:', planType, tier);
    if (onGetStarted) {
      onGetStarted(planType, tier);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#00343d' }}>
      <style jsx>{`
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
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .pricing-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pricing-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(255, 203, 102, 0.3);
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffcb66 0%, #ffd966 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10" 
        style={{ 
          backgroundColor: 'rgba(0, 52, 61, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex justify-between items-center">
          <button onClick={onBackToHome} className="flex items-center hover:opacity-80 transition-opacity">
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
          </button>

          <nav className="hidden md:flex gap-8 text-white font-medium">
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-yellow-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-yellow-400 transition-colors">FAQ</a>
          </nav>

          <button 
            onClick={onBackToHome}
            className="px-6 py-2 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-teal-900 transition-all"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-4 py-2 rounded-full border-2 border-yellow-400 text-yellow-400 text-sm font-semibold mb-4 animate-fade-in-up">
            💎 Simple, Transparent Pricing
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Choose Your Perfect Plan
          </h1>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Start with a test card or upgrade for full features. All plans include support.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className={`text-base font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 rounded-full transition-all"
              style={{ backgroundColor: billingCycle === 'yearly' ? '#ffcb66' : '#334155' }}
            >
              <div 
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-base font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-400'}`}>
                Yearly
              </span>
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Plans */}
      <section id="pricing" className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Personal Plans</h2>
            <p className="text-gray-400 text-sm">For individuals and freelancers</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {Object.entries(pricingPlans.personal).map(([key, plan]) => (
              <div
                key={key}
                className={`pricing-card relative bg-white/5 backdrop-blur-sm rounded-2xl border-2 overflow-hidden ${
                  plan.popular ? 'border-yellow-400' : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <FontAwesomeIcon icon={plan.icon} className="text-2xl" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      {plan.savings && (
                        <p className="text-xs text-green-400 font-semibold">{plan.savings}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      {plan.price[billingCycle] > 0 && (
                        <span className="text-gray-400">
                          /{billingCycle === 'monthly' ? 'month' : 'year'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                      <p className="text-sm text-gray-400 mt-2">
                        {formatPrice(Math.round(plan.price.yearly / 12))}/month billed annually
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan('personal', key)}
                    className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 mb-8"
                    style={{
                      backgroundColor: plan.popular ? '#ffcb66' : plan.color,
                      color: plan.popular ? '#000' : '#fff'
                    }}
                  >
                    {plan.cta}
                  </button>

                  {/* Note for Free Plan */}
                  {plan.note && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-400 text-center font-medium">
                        {plan.note}
                      </p>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-white font-semibold mb-4">What's included:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.included ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          <FontAwesomeIcon 
                            icon={feature.included ? faCheck : faTimes} 
                            className="text-xs text-white"
                          />
                        </div>
                        <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Plans */}
      <section className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Business Plans</h2>
            <p className="text-gray-400 text-sm">For teams and organizations</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {Object.entries(pricingPlans.business).map(([key, plan]) => (
              <div
                key={key}
                className={`pricing-card relative bg-white/5 backdrop-blur-sm rounded-2xl border-2 overflow-hidden ${
                  plan.popular ? 'border-yellow-400' : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-xs font-bold rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <FontAwesomeIcon icon={plan.icon} className="text-2xl" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      {plan.savings && (
                        <p className="text-xs text-green-400 font-semibold">{plan.savings}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">
                        {formatPrice(plan.price[billingCycle])}
                      </span>
                      <span className="text-gray-400">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-gray-400 mt-2">
                        {formatPrice(Math.round(plan.price.yearly / 12))}/month billed annually
                      </p>
                    )}
                    {plan.trial && (
                      <p className="text-sm text-green-400 font-semibold mt-2">
                        🎁 {plan.trial}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan('business', key)}
                    className="w-full py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 mb-8"
                    style={{
                      backgroundColor: plan.popular ? '#ffcb66' : plan.color,
                      color: plan.popular ? '#000' : '#fff'
                    }}
                  >
                    {plan.cta}
                  </button>

                  {/* Note if exists */}
                  {plan.note && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-xs text-yellow-400 text-center font-medium">
                        {plan.note}
                      </p>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-white font-semibold mb-4">What's included:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          feature.included ? 'bg-green-500' : 'bg-gray-600'
                        }`}>
                          <FontAwesomeIcon 
                            icon={feature.included ? faCheck : faTimes} 
                            className="text-xs text-white"
                          />
                        </div>
                        <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Common Questions</h2>
            <p className="text-gray-400 text-sm">Quick answers about pricing</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFAQ(activeFAQ === idx ? null : idx)}
                  className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-all"
                >
                  <span className="text-white font-semibold pr-8 text-sm">{faq.question}</span>
                  <FontAwesomeIcon 
                    icon={faQuestionCircle} 
                    className={`text-yellow-400 transition-transform text-sm ${activeFAQ === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {activeFAQ === idx && (
                  <div className="px-5 pb-3">
                    <p className="text-gray-400 leading-relaxed text-sm">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-black/80 text-lg mb-8">
            Join thousands of professionals using Cosma for their digital business cards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleSelectPlan('personal', 'free')}
              className="px-8 py-4 bg-white text-black rounded-lg font-bold hover:scale-105 transition-all shadow-xl"
            >
              Start Free Today
            </button>
            <button
              onClick={onBackToHome}
              className="px-8 py-4 border-2 border-black text-black rounded-lg font-bold hover:bg-black hover:text-white transition-all"
            >
              View All Features
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 Cosma E-name Card. All rights reserved. Made with ❤️ in Vietnam</p>
        </div>
      </footer>
    </div>
  );
}