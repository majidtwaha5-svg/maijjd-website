import React from 'react';
import { Users, Target, Code, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Innovation',
      description: 'We constantly push the boundaries of technology to deliver cutting-edge solutions.'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Excellence',
      description: 'We strive for excellence in every project, ensuring the highest quality standards.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Collaboration',
      description: 'We believe in the power of teamwork and close collaboration with our clients.'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: 'Integrity',
      description: 'We maintain the highest ethical standards and transparency in all our dealings.'
    }
  ];

  // Product-focused: no personal roles/titles displayed
  const team = [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-primary-600">Maijjd</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a team of passionate technologists dedicated to creating 
              innovative software solutions that transform businesses and drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To empower businesses with innovative software solutions that streamline operations, 
                enhance productivity, and drive sustainable growth in the digital age.
              </p>
              <p className="text-lg text-gray-600">
                We believe that technology should be an enabler, not a barrier. Our mission is to 
                create software that is not only powerful and efficient but also intuitive and 
                accessible to users of all technical levels.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                To be the leading provider of innovative software solutions, recognized for our 
                commitment to excellence, customer satisfaction, and technological advancement.
              </p>
              <p className="text-lg text-gray-600">
                We envision a future where businesses can seamlessly integrate technology into 
                their operations, enabling them to focus on what they do best while we handle 
                the complexities of software development and maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These values guide everything we do and shape our company culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                  <div className="text-primary-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product-first section replacing personal team profiles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Maijjd</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maijjd is product‑focused. No personal titles or profiles — all attention stays on the platform’s
              capabilities, roadmap, and reliability. This protects privacy, avoids churn updates, and presents a
              universal brand that scales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Feature‑first</h3>
              <p className="text-gray-600">Clear demos, deployable templates, and AI‑assisted workflows.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Privacy‑respecting</h3>
              <p className="text-gray-600">No personal profiles; documentation and support are always current.</p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Built to scale</h3>
              <p className="text-gray-600">Provider‑agnostic deployment (Vercel, Cloudflare, Azure, Docker, more).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">10+</div>
              <div className="text-primary-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">Support Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
