import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// ====================================================
// PUBLIC DATA FETCHING
// ====================================================

// Submit consultation request
export const submitConsultation = async (bookingData) => {
  const { data, error } = await supabase
    .from('consultations')
    .insert([
      {
        first_name: bookingData.firstName,
        last_name: bookingData.lastName,
        email: bookingData.email,
        phone: bookingData.phone,
        project_type: bookingData.projectType,
        message: bookingData.message,
      }
    ]);
  if (error) throw error;
  return data;
};

// Fetch homepage details
export const fetchHomepageContent = async () => {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
};

// Fetch heritage stats
export const fetchHeritageStats = async () => {
  const { data, error } = await supabase
    .from('heritage_stats')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
};

// Fetch project list
export const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

// Fetch single project by its unique slug & calculate prev/next loop dynamic references
export const fetchProjectBySlug = async (slug) => {
  // Fetch all projects to calculate loop index on the client side
  const { data: allProjects, error: listError } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (listError) throw listError;
  if (!allProjects || allProjects.length === 0) return null;

  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  if (currentIndex === -1) return null;

  const currentProject = allProjects[currentIndex];
  
  // Closed loop logic
  const len = allProjects.length;
  const prevProject = allProjects[(currentIndex - 1 + len) % len];
  const nextProject = allProjects[(currentIndex + 1) % len];

  return {
    ...currentProject,
    prevSlug: prevProject.slug,
    prevTitle: prevProject.title,
    nextSlug: nextProject.slug,
    nextTitle: nextProject.title,
  };
};

// ====================================================
// AUTHENTICATED ADMIN MUTATIONS
// ====================================================

// Fetch consultations list (Admin only)
export const fetchConsultations = async () => {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

// Delete a consultation booking record
export const deleteConsultation = async (id) => {
  const { data, error } = await supabase
    .from('consultations')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};

// Update homepage copies
export const updateHomepageContent = async (updatedData) => {
  const { data, error } = await supabase
    .from('homepage_content')
    .upsert({
      id: 1,
      hero_title: updatedData.hero_title,
      hero_subtitle: updatedData.hero_subtitle,
      signature_title: updatedData.signature_title,
      signature_subtitle: updatedData.signature_subtitle,
      signature_img: updatedData.signature_img,
      signature_watch_img: updatedData.signature_watch_img,
      architecture_imgs: updatedData.architecture_imgs,
    });
  if (error) throw error;
  return data;
};

// Update heritage stats
export const updateHeritageStats = async (updatedData) => {
  const { data, error } = await supabase
    .from('heritage_stats')
    .upsert({
      id: 1,
      completed_projects: updatedData.completed_projects,
      years_experience: updatedData.years_experience,
      materials_curated: updatedData.materials_curated,
      heritage_body_1: updatedData.heritage_body_1,
      heritage_body_2: updatedData.heritage_body_2,
      heritage_img: updatedData.heritage_img,
      founder_name: updatedData.founder_name,
      founder_role: updatedData.founder_role,
      founder_desc: updatedData.founder_desc,
      founder_img: updatedData.founder_img,
    });
  if (error) throw error;
  return data;
};

// Insert a new project
export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData]);
  if (error) throw error;
  return data;
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
    .eq('id', projectId);
  if (error) throw error;
  return data;
};

// Delete a project
export const deleteProject = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  if (error) throw error;
  return data;
};

// ====================================================
// IMAGE STORAGE UPLOADS
// ====================================================

// Upload image file to Supabase Bucket 'inti-assets' and return public URL
export const uploadImage = async (file) => {
  if (!file) return null;
  
  // Create unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  // Upload file to bucket 'inti-assets'
  const { data, error } = await supabase.storage
    .from('inti-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  // Retrieve public URL
  const { data: publicUrlData } = supabase.storage
    .from('inti-assets')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

// Fetch maintenance mode flag from homepage_content singleton
export const fetchMaintenanceStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('homepage_content')
      .select('is_maintenance')
      .eq('id', 1)
      .single();
    if (error) {
      console.warn("Error fetching maintenance status from Supabase: ", error.message);
      return false;
    }
    return data?.is_maintenance || false;
  } catch (err) {
    return false;
  }
};

// Update maintenance mode flag
export const updateMaintenanceStatus = async (status) => {
  const { data, error } = await supabase
    .from('homepage_content')
    .update({ is_maintenance: status })
    .eq('id', 1);
  if (error) throw error;
  return data;
};
