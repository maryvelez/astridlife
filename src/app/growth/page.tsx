"use client";

import { useState, useEffect } from 'react';

export default function GrowthPage() {
  const [quote, setQuote] = useState('');
  
  useEffect(() => {
    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        const growthQuotes = data.filter(q => 
          q.text.toLowerCase().includes('grow') || 
          q.text.toLowerCase().includes('learn') ||
          q.text.toLowerCase().includes('improve')
        );
        const randomQuote = growthQuotes[Math.floor(Math.random() * growthQuotes.length)];
        setQuote(randomQuote.text);
      })
      .catch(() => {
        setQuote("Growth is the only evidence of life.");
      });
  }, []);

  return (
    <main className="min-h-screen p-4 pb-16 bg-white">
      <div className="neural-bg"></div>
      
      <div className="max-w-4xl mx-auto">
        <blockquote className="text-2xl font-light text-blue-900 italic mb-8 p-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-lg">
          {quote}
        </blockquote>
        {/* Growth tracking content will go here */}
      </div>
    </main>
  );
}
