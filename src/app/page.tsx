'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Gamepad2,
  Code,
  Lock,
  Star,
  MessageCircle,
  ChevronDown,
  Activity
} from 'lucide-react'
import { toast } from 'sonner'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const faqs = [
    {
      question: 'What games does Beulrock SS support?',
      answer: 'We support over 50+ popular Roblox games including Blox Fruits, Pet Simulator 99, Da Hood, and many more. Our library is constantly expanding with new game support.'
    },
    {
      question: 'Is Beulrock SS safe to use?',
      answer: 'Yes! We use advanced anti-detection technology and regularly update our systems to ensure maximum safety. Our scripts are thoroughly tested before release.'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply create an account, redeem your license key, download our executor, and start injecting scripts into your favorite games. Our documentation provides step-by-step guides.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum for your convenience.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 7-day money-back guarantee if you are not satisfied with our service. Contact our support team for assistance.'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Fast Execution',
      description: 'Lightning-fast script execution with minimal lag and maximum performance'
    },
    {
      icon: Shield,
      title: 'Anti-Detection',
      description: 'Advanced bypass systems that keep you safe and undetected'
    },
    {
      icon: Code,
      title: 'Script Hub',
      description: 'Access to hundreds of verified scripts and tools'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of users in our active Discord community'
    },
    {
      icon: Lock,
      title: 'Secure',
      description: 'Enterprise-grade security to protect your account'
    },
    {
      icon: Activity,
      title: '24/7 Support',
      description: 'Round-the-clock support team ready to help you'
    }
  ]

  const pricing = [
    {
      name: 'Basic',
      price: '$9.99',
      period: '/month',
      features: ['10 Games Supported', 'Basic Scripts', 'Email Support', '30-Day Whitelist'],
      color: 'from-gray-700 to-gray-800'
    },
    {
      name: 'Premium',
      price: '$19.99',
      period: '/month',
      features: ['50+ Games Supported', 'Premium Scripts', 'Priority Support', '45-Day Whitelist', 'Early Access Features'],
      color: 'from-red-600 to-red-700',
      popular: true
    },
    {
      name: 'Ultimate',
      price: '$39.99',
      period: '/month',
      features: ['Unlimited Games', 'All Scripts + Custom', '24/7 Discord Support', '90-Day Whitelist', 'Private Scripts', 'API Access'],
      color: 'from-yellow-600 to-yellow-700'
    }
  ]

  const testimonials = [
    {
      name: 'Alex M.',
      role: 'Professional Gamer',
      content: 'Beulrock SS is hands down the best executor I have ever used. The script hub is amazing and the updates are frequent.'
    },
    {
      name: 'Sarah K.',
      role: 'Roblox Developer',
      content: 'As a developer, I appreciate how well-documented and reliable Beulrock SS is. The API access is a game-changer.'
    },
    {
      name: 'Mike R.',
      role: 'Content Creator',
      content: 'I have been using Beulrock SS for months now. The support team is incredibly helpful and the community is great.'
    }
  ]

  return (
    <div className="page-background min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/demon-logo.jpg" alt="Beulrock SS Logo" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xl font-bold text-white">Beulrock SS</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link>
              <Link href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-red-900/30 text-red-400 border-red-900/30 mb-6">
              <Zap className="w-3 h-3 mr-1" />
              New: Now supporting 50+ games!
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              The Most Powerful
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Roblox Executor
              </span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Execute scripts with lightning speed. Access hundreds of verified scripts. 
              Stay undetected with our advanced anti-cheat bypass.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/games">
                <Button size="lg" variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950 text-lg px-8">
                  <Gamepad2 className="mr-2 w-5 h-5" />
                  View Games
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-500" />
                <span className="font-medium">10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-red-500" />
                <span className="font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-red-500" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Beulrock SS?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built for performance, designed for ease of use
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900/50 backdrop-blur-xl hover:border-red-900/50 transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricing.map((plan, index) => (
              <Card key={index} className={`border-gray-800 bg-gray-900/50 backdrop-blur-xl relative ${plan.popular ? 'border-red-500 scale-105' : 'hover:border-red-900/50'} transition-all`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                    onClick={() => {
                      if (plan.popular) {
                        toast.info('Use code PREMIUM-2024 to activate Premium tier!')
                      } else if (plan.name === 'Ultimate') {
                        toast.info('Use code ULTIMATE-2024 to activate Ultimate tier!')
                      }
                    }}
                  >
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              See what our users are saying
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900/50 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">
              Got questions? We've got answers
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900/50 backdrop-blur-xl">
                <button
                  className="w-full text-left p-6 flex items-center justify-between"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-red-900/50 bg-gradient-to-br from-red-900/20 to-gray-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users and experience the most powerful Roblox executor
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-lg px-8">
                    Create Free Account
                  </Button>
                </Link>
                <Link href="https://discord.gg/beulrock" target="_blank">
                  <Button size="lg" variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-950 text-lg px-8">
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Join Discord
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Beulrock SS</span>
              </div>
              <p className="text-gray-400">
                The most powerful Roblox executor with lightning-fast execution and advanced anti-detection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/games" className="text-gray-400 hover:text-white">Games</Link></li>
                <li><Link href="/scripts" className="text-gray-400 hover:text-white">Scripts</Link></li>
                <li><Link href="/executor" className="text-gray-400 hover:text-white">Executor</Link></li>
                <li><Link href="/whitelist" className="text-gray-400 hover:text-white">Whitelist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/settings" className="text-gray-400 hover:text-white">Help Center</Link></li>
                <li><a href="https://discord.gg/beulrock" className="text-gray-400 hover:text-white">Discord</a></li>
                <li><a href="mailto:support@beulrock.com" className="text-gray-400 hover:text-white">Email</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Beulrock SS. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
