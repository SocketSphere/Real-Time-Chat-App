// frontend/src/components/BlogList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../services/blogApi';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getBlogPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing stories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 bg-red-100 mx-auto flex items-center justify-center">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Oops! Something went wrong</h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-indigo-700 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Blog
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            Thoughts, stories, and ideas from our team
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blog posts</h3>
            <p className="mt-1 text-sm text-gray-500">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              const { title, excerpt, slug, publishedAt, coverImage, author } = post.attributes;
              const imageUrl = coverImage?.data?.attributes?.url 
                ? `${import.meta.env.REACT_APP_STRAPI_URL}${coverImage.data.attributes.url}`
                : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';

              return (
                <article
                  key={post.id}
                  className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
                >
                  <Link to={`/blog/${slug}`} className="flex-shrink-0">
                    <img
                      className="h-48 w-full object-cover"
                      src={imageUrl}
                      alt={title}
                    />
                  </Link>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-indigo-600">
                        {author?.data?.attributes?.name || 'Anonymous'}
                      </div>
                      <Link to={`/blog/${slug}`} className="block mt-2">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                          {title}
                        </h3>
                        <p className="mt-3 text-base text-gray-500">
                          {excerpt || 'Click to read more...'}
                        </p>
                      </Link>
                    </div>
                    
                    <div className="mt-6 flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {author?.data?.attributes?.name?.charAt(0) || 'A'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {author?.data?.attributes?.name || 'Anonymous'}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={publishedAt}>
                            {new Date(publishedAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                          <span aria-hidden="true">&middot;</span>
                          <span>5 min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;