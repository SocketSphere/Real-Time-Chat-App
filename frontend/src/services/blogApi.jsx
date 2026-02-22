// frontend/src/services/blogApi.js
const API_URL = import.meta.env.REACT_APP_STRAPI_URL || 'http://localhost:1338';

export const getBlogPosts = async () => {
  const response = await fetch(`${API_URL}/api/blog-posts?populate=*&sort=publishedAt:desc`);
  const data = await response.json();
  return data.data;
};

export const getBlogPost = async (slug) => {
  const response = await fetch(`${API_URL}/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`);
  const data = await response.json();
  return data.data[0];
};