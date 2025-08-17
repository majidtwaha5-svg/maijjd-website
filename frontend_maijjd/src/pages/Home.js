import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Database, 
  Settings, 
  Users, 
  BarChart3, 
  ArrowRight, 
  CheckCircle,
  Zap,
  Shield
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Custom Development',
      description: 'Tailored software solutions designed to meet your specific business needs.'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Database Management',
      description: 'Robust database solutions with advanced analytics and reporting capabilities.'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'System Integration',
      description: 'Seamless integration of existing systems and third-party applications.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Management',
      description: 'Comprehensive user management and access control systems.'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Analytics & Reporting',
      description: 'Advanced analytics and real-time reporting for data-driven decisions.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security First',
      description: 'Enterprise-grade security with encryption and compliance standards.'
    }
  ];

  const benefits = [
    '24/7 Technical Support',
    'Scalable Architecture',
    'Cloud-Native Solutions',
    'Agile Development Process',
    'Continuous Integration/Deployment',
    'Performance Optimization'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional
              <span className="text-primary-600"> Software Solutions</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your business with cutting-edge software solutions. 
              We specialize in creating innovative, scalable, and secure applications 
              that drive growth and efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services"
                className="btn-primary inline-flex items-center justify-center"
              >
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Maijjd?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We deliver exceptional software solutions with cutting-edge technology 
              and industry best practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                  <div className="text-primary-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Accelerate Your Business Growth
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our comprehensive software solutions are designed to streamline your operations, 
                enhance productivity, and drive measurable results for your business.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Let's discuss how our software solutions can transform your business 
                  and help you achieve your goals.
                </p>
                <Link
                  to="/contact"
                  className="btn-primary w-full text-center inline-block"
                >
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <a href="https://postimg.cc/2VSLnPDM" target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src="https://i.postimg.cc/ncvKfJwF/ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png"
                  alt="ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216"
                  className="w-full h-auto object-cover"
                />
              </a>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-800">Direct image:</span>{' '}
                <a href="https://i.postimg.cc/ncvKfJwF/ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                  https://i.postimg.cc/ncvKfJwF/ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png
                </a>
              </div>
              <div>
                <span className="font-medium text-gray-800">Post link:</span>{' '}
                <a href="https://postimg.cc/2VSLnPDM" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                  https://postimg.cc/2VSLnPDM
                </a>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-gray-700 font-medium mb-2">BBCode and Markdown examples</div>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words">
[url=https://postimg.cc/2VSLnPDM][img]https://i.postimg.cc/ncvKfJwF/ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png[/img][/url]

[![ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png](https://i.postimg.cc/ncvKfJwF/ED91-CE34-95-B6-4094-9-DE1-CC08-BEC68216.png)](https://postimg.cc/2VSLnPDM)
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have already transformed their operations 
            with our innovative software solutions.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
