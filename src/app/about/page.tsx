'use client';

import Image from 'next/image';
import { Award, Users, TrendingUp, Shield, Target, Heart, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Ahmed Hassan',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'With over 15 years in Pakistan\'s real estate market, Ahmed founded Zameen Khatta to revolutionize the property buying experience.',
      specialties: ['Luxury Properties', 'Market Analysis', 'Client Relations']
    },
    {
      name: 'Fatima Khan',
      role: 'Head of Sales',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Fatima brings exceptional negotiation skills and deep knowledge of Pakistan\'s property market to help clients secure their dream properties.',
      specialties: ['Negotiations', 'Commercial Properties', 'Investment Strategy']
    },
    {
      name: 'Sara Ali',
      role: 'Marketing Director',
      image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Sara crafts compelling property presentations and marketing strategies that showcase Pakistani properties in their best light.',
      specialties: ['Property Marketing', 'Digital Strategy', 'Brand Development']
    },
    {
      name: 'Muhammad Tariq',
      role: 'Senior Agent',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      bio: 'Muhammad specializes in residential properties and has helped hundreds of Pakistani families find their perfect homes.',
      specialties: ['Residential Sales', 'First-Time Buyers', 'Relocation Services']
    }
  ];

  const companyValues = [
    {
      icon: <Shield className="h-8 w-8 text-gray-900" />,
      title: 'Integrity',
      description: 'We conduct business with the highest ethical standards, ensuring transparency and honesty in every transaction.'
    },
    {
      icon: <Heart className="h-8 w-8 text-gray-900" />,
      title: 'Client-Centric',
      description: 'Our clients\' needs come first. We listen, understand, and deliver personalized solutions that exceed expectations.'
    },
    {
      icon: <Target className="h-8 w-8 text-gray-900" />,
      title: 'Excellence',
      description: 'We strive for perfection in every aspect of our service, from property selection to closing day support.'
    },
    {
      icon: <Users className="h-8 w-8 text-gray-900" />,
      title: 'Collaboration',
      description: 'We work as a unified team, combining our expertise to provide comprehensive real estate solutions.'
    }
  ];

  const achievements = [
    {
      number: '1000+',
      label: 'Properties Sold',
      description: 'Successfully closed transactions'
    },
    {
      number: '15+',
      label: 'Years Experience',
      description: 'In Pakistan\'s real estate market'
    },
    {
      number: '98%',
      label: 'Client Satisfaction',
      description: 'Based on customer reviews'
    },
    {
      number: 'PKR 50B+',
      label: 'Total Sales Volume',
      description: 'In property transactions'
    }
  ];

  const milestones = [
    {
      year: '2009',
      title: 'Company Founded',
      description: 'Ahmed Hassan established Zameen Khatta with a vision to transform Pakistan\'s real estate experience.'
    },
    {
      year: '2012',
      title: 'First Major Expansion',
      description: 'Opened our Karachi office and expanded our team to serve clients across major Pakistani cities.'
    },
    {
      year: '2016',
      title: 'Digital Innovation',
      description: 'Launched our cutting-edge online platform and virtual tour technology for Pakistani properties.'
    },
    {
      year: '2020',
      title: 'Market Leadership',
      description: 'Became the leading real estate agency in Pakistan\'s major metropolitan areas.'
    },
    {
      year: '2024',
      title: 'Continued Growth',
      description: 'Celebrating 15 years of excellence with over 1000 successful transactions across Pakistan.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative gradient-dark py-20">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1920)'
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            About Zameen Khatta
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto">
            Transforming dreams into addresses since 2009. We're more than real estate agents – we're your partners in finding home across Pakistan.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Founded in 2009 by Ahmed Hassan, Zameen Khatta began with a simple yet powerful vision: to revolutionize Pakistan's real estate experience by putting clients first and delivering unparalleled service in the property market.
                </p>
                <p>
                  What started as a boutique agency in Lahore has grown into Pakistan's most trusted name in real estate. Our success stems from our unwavering commitment to excellence, deep market expertise, and genuine care for our clients' dreams and aspirations.
                </p>
                <p>
                  Today, we're proud to have helped over 1000 Pakistani families find their perfect homes, facilitated billions in property transactions, and built lasting relationships that extend far beyond the closing table.
                </p>
              </div>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                  <Link href="/contact">
                    Start Your Journey With Us
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Luxury property in Pakistan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our clients across Pakistan every day.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover-lift border border-gray-200 bg-white">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Numbers that reflect our commitment to excellence and client satisfaction across Pakistan.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-xl font-semibold text-gray-300 mb-1">
                  {achievement.label}
                </div>
                <div className="text-gray-400 text-sm">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to making your Pakistani real estate dreams a reality.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift border border-gray-200">
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-gray-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-gray-900">Specialties:</h4>
                    {member.specialties.map((specialty, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 text-gray-900 mr-2" />
                        {specialty}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key milestones that have shaped Zameen Khatta into Pakistan's leading real estate company.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-300 hidden lg:block"></div>
            
            <div className="space-y-8 lg:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 lg:pr-8 lg:pl-8">
                    <Card className={`p-6 border border-gray-200 ${index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'}`}>
                      <div className="flex items-center mb-3">
                        <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {milestone.year}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-900 rounded-full border-4 border-white shadow-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 gradient-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let our experienced team guide you through every step of your real estate journey in Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-gray-900 hover:bg-gray-100">
              <Link href="/listings">
                Browse Properties
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Link href="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}