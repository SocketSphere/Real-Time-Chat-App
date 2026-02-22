// frontend/src/components/BlogPost.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPost } from '../services/blogApi';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await getBlogPost(slug);
      if (!data) {
        setError('Post not found');
      } else {
        setPost(data);
      }
    } catch (err) {
      setError('Failed to load blog post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const { title, content, publishedAt, coverImage, author } = post.attributes;
  const imageUrl = coverImage?.data?.attributes?.url 
    ? `${import.meta.env.REACT_APP_STRAPI_URL}${coverImage.data.attributes.url}`
    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image */}
      <div className="relative h-96 bg-gray-800">
        <img
          className="w-full h-full object-cover opacity-60"
          src={imageUrl}
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur-sm transition-all"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Info */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            {title}
          </h1>
          
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium">
                  {author?.data?.attributes?.name?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="ml-3 text-left">
                <p className="text-sm font-medium text-gray-900">
                  {author?.data?.attributes?.name || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">
                  {author?.data?.attributes?.role || 'Author'}
                </p>
              </div>
            </div>
            
            <div className="border-l border-gray-300 h-8"></div>
            
            <div className="text-sm text-gray-500">
              <time dateTime={publishedAt}>
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <p className="text-xs mt-1">5 min read</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg prose-indigo mx-auto">
          {content ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <p className="text-gray-500 italic">No content available for this post.</p>
          )}
        </article>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Share this article</h3>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;