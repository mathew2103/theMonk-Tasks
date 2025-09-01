import { NextRequest } from 'next/server';
import coursesData from '../../../data/courses.json';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  // Input validation
  if (typeof query !== 'string') {
    return { isValid: false, error: 'Query must be a string' };
  }
  
  if (query.length > 100) {
    return { isValid: false, error: 'Query too long (max 100 characters)' };
  }
  
  // Basic XSS prevention - remove potentially dangerous characters
  const sanitizedQuery = query.replace(/[<>\"'&]/g, '');
  if (sanitizedQuery !== query) {
    return { isValid: false, error: 'Invalid characters in query' };
  }
  
  return { isValid: true };
}

export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' }, 
        { status: 429 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    // Validate input
    const validation = validateSearchQuery(query);
    if (!validation.isValid) {
      return Response.json(
        { error: validation.error }, 
        { status: 400 }
      );
    }
    
    // Simulate network delay (remove in production)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
    
    if (!query.trim()) {
      return Response.json([]);
    }
    
    // Case-insensitive search with proper escaping
    const searchTerm = query.toLowerCase().trim();
    const filtered = coursesData.filter(course => 
      course.title.toLowerCase().includes(searchTerm) || 
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm)
    );
    
    const results = filtered.map(course => ({
      id: course.id,
      name: course.title,
      desc: course.description,
      type: course.category
    }));
    
    return Response.json(results);
    
  } catch (error) {
    console.error('Search API error:', error);
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
