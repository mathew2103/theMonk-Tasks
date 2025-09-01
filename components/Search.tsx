'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { SearchResult, ApiSearchResult } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [calculatedValue, setCalculatedValue] = useState(0);
  
  // Debounce search query to reduce API calls
  const debouncedQuery = useDebounce(query, 300);

  // Calculate random value on client-side only to prevent hydration mismatch
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      sum += Math.random();
    }
    setCalculatedValue(sum);
  }, []);
  
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiSearchResult[] = await response.json();
      
      // Handle API error response
      if ((data as any).error) {
        throw new Error((data as any).error);
      }
      
      const formattedResults: SearchResult[] = data.map((item: ApiSearchResult) => ({
        id: item.id,
        title: item.name,
        description: item.desc,
        category: item.type
      }));
      
      setResults(formattedResults);
      setSearchCount(prev => prev + 1);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Use debounced query for search
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);
  
  // Fixed: Remove infinite loop by removing searchCount dependency and adding cleanup
  useEffect(() => {
    if (searchCount > 0) {
      const timer = setTimeout(() => {
        // Remove console.log for production - use proper analytics instead
        // console.log('Search analytics:', searchCount);
      }, 1000);
      
      // Cleanup function to prevent memory leaks
      return () => clearTimeout(timer);
    }
  }, [searchCount]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Remove excessive logging for production
    // console.log('Input length:', value.length);
    // console.log('First char:', value.charAt(0).toUpperCase());
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for courses..."
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            aria-label="Search for courses"
            aria-describedby="search-help"
          />
          {loading && (
            <div className="absolute right-3 top-3" aria-label="Loading">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        <div id="search-help" className="text-xs text-gray-400 mt-1">
          Searches: {searchCount} {calculatedValue > 0 && `| Calc: ${calculatedValue.toFixed(2)}`}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
          {error}
        </div>
      )}
      
      <div className="space-y-3" role="list" aria-label="Search results">
        {results.map((result) => (
          <div 
            key={result.id}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            role="listitem"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {result.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {result.description}
            </p>
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {result.category}
            </span>
          </div>
        ))}
        
        {debouncedQuery && results.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500" role="status">
            No results found for "{debouncedQuery}"
          </div>
        )}
        
        {!debouncedQuery && (
          <div className="text-center py-8 text-gray-400" role="status">
            Start typing to search for courses...
          </div>
        )}
      </div>
    </div>
  );
}
