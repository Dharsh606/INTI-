import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  if (!source) return '';
  return builder.image(source).url();
}

// Queries for page rendering
export const fetchHomepageContent = async () => {
  const query = `*[_type == "homepageContent"][0]`;
  return await sanityClient.fetch(query);
};

export const fetchHeritageStats = async () => {
  const query = `*[_type == "heritageStats"][0]`;
  return await sanityClient.fetch(query);
};

export const fetchAllProjects = async () => {
  const query = `*[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    subtitle,
    category,
    year,
    type,
    area,
    materials,
    headline,
    body1,
    body2,
    quote,
    author,
    "slug": slug.current,
    heroImg,
    gallery
  }`;
  return await sanityClient.fetch(query);
};

export const fetchProjectBySlug = async (slug) => {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    title,
    subtitle,
    category,
    year,
    type,
    area,
    materials,
    headline,
    body1,
    body2,
    quote,
    author,
    heroImg,
    gallery,
    "prevSlug": *[_type == "project" && _createdAt < ^._createdAt] | order(_createdAt desc)[0].slug.current,
    "prevTitle": *[_type == "project" && _createdAt < ^._createdAt] | order(_createdAt desc)[0].title,
    "nextSlug": *[_type == "project" && _createdAt > ^._createdAt] | order(_createdAt asc)[0].slug.current,
    "nextTitle": *[_type == "project" && _createdAt > ^._createdAt] | order(_createdAt asc)[0].title
  }`;
  return await sanityClient.fetch(query, { slug });
};
