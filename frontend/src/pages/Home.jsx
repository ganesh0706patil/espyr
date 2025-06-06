import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X, Code2, Code, Brain, LineChart, MessageSquare, Zap, Award, BookOpen, Laptop, ArrowRight, Github, Twitter, Linkedin, Facebook, Sparkles } from 'lucide-react';
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = "font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer";
  
  const variantStyles = {
    primary: "bg-orange-700 hover:bg-orange-800 text-white shadow-lg hover:shadow-xl focus:ring-orange-500 transform hover:scale-105 active:scale-95",
    secondary: "bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg focus:ring-gray-500 transform hover:scale-105 active:scale-95",
    outline: "border-2 border-orange-700 text-orange-700 hover:bg-orange-50 focus:ring-orange-500 transform hover:scale-105 active:scale-95",
    ghost: "text-orange-700 hover:bg-orange-50 focus:ring-orange-500"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:transform hover:-translate-y-1">
      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-700 group-hover:bg-orange-700 group-hover:text-white transition-all duration-300">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({ content, author, role, company }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
      <div className="mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="inline-block w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
      <p className="text-gray-600 mb-6 italic">"{content}"</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div className="ml-3">
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{role}, {company}</p>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(true); // Start with true to show shadow initially
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Get Started', id: 'cta' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-orange-700" />
            <span className="text-xl font-bold text-gray-900">
              DSA<span className="text-orange-700">Coach</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button 
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="text-gray-800 hover:text-orange-700 font-medium transition-colors duration-300  cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-4 ">
            <SignInButton forceRedirectUrl="/problems">
  <Button variant="primary" size="sm">
    Sign In
  </Button>
</SignInButton>

<SignUpButton forceRedirectUrl="/problems">
  <Button variant="outline" size="sm">
    Sign Up
  </Button>
</SignUpButton>
          </div>
          
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
              aria-label="Open menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.id)}
                className="block py-2 px-3 text-gray-800 hover:bg-gray-100 hover:text-orange-700 rounded-md transition-colors duration-300 w-full text-left cursor-pointer"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-4 py-4">
                <Button variant="primary" size="sm" className="w-full">
                  Sign In
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div id="hero" className="pt-24 pb-12 md:pt-32 md:pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-6 space-x-2">
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full inline-flex items-center animate-pulse">
                <Sparkles size={16} className="mr-1" />
                AI-Powered Learning
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master <span className="text-orange-700">Data Structures</span> & Algorithms
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">
              Practice coding problems, get personalized feedback, and accelerate your learning with AI-powered mentorship. Land your dream tech job faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4 ">
              <SignInButton forceRedirectUrl="/problems">
  <Button variant="primary" size="lg">
    Get Started
  </Button>
</SignInButton>
              
              <SignInButton forceRedirectUrl="/problems">
  <Button variant="outline" size="lg">
    Explore Problems
  </Button>
</SignInButton>
            </div>
            
            <div className="mt-12 flex items-center justify-center md:justify-start space-x-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="text-gray-700">4.9/5 (2,000+ reviews)</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700">5,000+ active learners</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-orange-700" />
                    <span className="font-semibold text-gray-900">Problem #42: Two Sum</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Easy</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm border border-gray-200">
                <div className="text-gray-600">// Find two numbers that add up to target</div>
                <div>function twoSum(nums, target) {'{'}</div>
                <div className="ml-4">// Your solution here</div>
                <div>{'}'}</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                <h4 className="font-semibold text-orange-800 mb-2">AI Coach Hint</h4>
                <p className="text-gray-700">
                  Consider using a hash map to store values you've seen. This can reduce the time complexity from O(n²) to O(n).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Code,
      title: "500+ Coding Problems",
      description: "Access a comprehensive library of problems ranging from easy to hard, covering all common DSA topics."
    },
    {
      icon: Brain,
      title: "AI Mentorship",
      description: "Get personalized guidance and hints when you're stuck, helping you learn at your own pace."
    },
    {
      icon: LineChart,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed statistics and performance analytics."
    },
    {
      icon: MessageSquare,
      title: "Code Reviews",
      description: "Receive detailed feedback on your solutions to improve code quality and efficiency."
    },
    {
      icon: Zap,
      title: "Mock Interviews",
      description: "Practice with realistic interview scenarios to build confidence for technical interviews."
    },
    {
      icon: Award,
      title: "Skill Certification",
      description: "Earn certificates to showcase your DSA skills to potential employers."
    },
    {
      icon: BookOpen,
      title: "Learning Paths",
      description: "Follow structured learning paths tailored to different experience levels and goals."
    },
    {
      icon: Laptop,
      title: "In-browser IDE",
      description: "Code and test your solutions directly in the browser with our feature-rich editor."
    }
  ];

  return (
    <div id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-orange-700">Master DSA</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform combines practice problems, AI coaching, and interview prep to help you excel in technical interviews.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      content: "DSA Coach helped me prepare for my Google interview in just 3 weeks. The AI hints were like having a personal mentor available 24/7.",
      author: "Alex Chen",
      role: "Software Engineer",
      company: "Google"
    },
    {
      content: "The structured learning paths and problem sets are incredibly well designed. I went from struggling with basic algorithms to confidently solving hard problems.",
      author: "Sarah Johnson",
      role: "Frontend Developer",
      company: "Meta"
    },
    {
      content: "The mock interviews feature gave me the confidence I needed. I practiced regularly and aced my Amazon technical interview!",
      author: "Michael Rodriguez",
      role: "Backend Engineer",
      company: "Amazon"
    }
  ];

  return (
    <div id="testimonials" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-800 rounded-full inline-block mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Developers Who Landed Their Dream Jobs
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of developers who have improved their DSA skills and secured positions at top tech companies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              content={testimonial.content}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const CallToAction = () => {
  return (
    <div id="cta" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-8 md:mb-0 md:mr-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  Ready to Ace Your Next <br className="hidden md:inline" />
                  Technical Interview?
                </h2>
                <p className="text-orange-100 text-lg mb-6 max-w-xl">
                  Join thousands of developers who have transformed their careers with DSA Coach. Start practicing today and get access to 500+ problems, AI mentorship, and more.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <SignUpButton forceRedirectUrl="/problems">
  <Button
    variant="primary"
    size="lg"
    className="text-orange-800 hover:bg-gray-100"
  >
    Start Free
  </Button>
</SignUpButton>
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    View Pricing <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-white mb-2">Every</div>
                <div className="text-orange-100 mb-4">Day Free </div>
                <ul className="text-left space-y-2 text-orange-100">
                  {["No credit card required", "Full platform access", "Cancel anytime"].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Problem Library", href: "#problems" },
        { name: "Mock Interviews", href: "#interviews" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Blog", href: "#blog" },
        { name: "Community", href: "#community" },
        { name: "Success Stories", href: "#stories" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
        { name: "Partners", href: "#partners" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
      ]
    }
  ];

  return (
    <footer className="bg-white pt-12 pb-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="h-8 w-8 text-orange-700" />
              <span className="text-xl font-bold text-gray-900">
                DSA<span className="text-orange-700">Coach</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Helping developers master data structures and algorithms through practice and AI mentorship.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin, Facebook].map((Icon, i) => (
                <a 
                  key={i}
                  href="#"
                  className="text-gray-500 hover:text-orange-700 transition-colors duration-300 cursor-pointer"
                  aria-label={`${Icon.name} link`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-orange-700 transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} DSA Coach. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-white border border-gray-300 rounded-md py-1 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;