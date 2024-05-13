import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-black py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold">World Engine Studio</div>
          <ul className="flex space-x-4">
            <li><Link href="/">Game</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/portfolio">Development Portfolio</Link></li>
            <li><Link href="/architecture">RMT Architecture</Link></li>
            <li><Link href="/about">About</Link></li>
         
          </ul>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-4">Global Dependency on Fossil Fuels and Economic Vulnerability</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Policy Changes</h2>
          <ul className="list-disc pl-6">
            <li>Enforce Renewable Energy Mandates</li>
            <li>Implement Global Carbon Pricing</li>
            <li>Fossil Fuel Subsidy Reforms</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Image src="/image1.jpg" alt="Image 1" width={400} height={300} />
            <h3 className="text-xl font-bold mt-2">Climate Change as a Catalyst for Global Economic Recession</h3>
          </div>
          <div>
            <Image src="/image2.jpg" alt="Image 2" width={400} height={300} />
            <h3 className="text-xl font-bold mt-2">Global Economic Impact Post of Climate-induced Disasters</h3>
          </div>
          <div>
            <Image src="/image3.jpg" alt="Image 3" width={400} height={300} />
            <h3 className="text-xl font-bold mt-2">Necessity for a Global Transition to Renewable Energy</h3>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Sign up for the Official Shinjuku 2050 Newsletter!</h2>
          <div className="flex">
            <input type="email" placeholder="Enter your email" className="px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none" />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-r-md">Sign Up</button>
          </div>
        </div>
      </main>

      <footer className="bg-black py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 World Engine Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}