import { NextRequest } from 'next/server';
import coursesData from '../../../data/courses.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
    
    if (!query.trim()) {
      return Response.json([]);
    }
    
    const filtered = coursesData.filter(course => 
      course.title.includes(query) || 
      course.description.includes(query) ||
      course.category.includes(query)
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
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
