'use client';

import Search from '../components/Search';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Course Search
        </h1>
        <p className="text-gray-600">
          Find the perfect course for your learning journey
        </p>
      </div>
      
      <Search />
    </div>
  );
}
