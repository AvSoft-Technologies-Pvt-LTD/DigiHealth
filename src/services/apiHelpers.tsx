import { API } from "../config/api";

  // Helper function to get image source
export const getImageSource = (formData: any) => {
    if (!formData.photo) {
      return null;
    }
    
    // Check if it's a base64 string
    if (formData.photo.startsWith('data:image')) {
      // It's already a data URL
      return { uri: formData.photo };
    }
    
    // Check if it's a pure base64 string (without data: prefix)
    if (formData.photo.length > 100 && !formData.photo.includes('http')) {
      // Assume it's base64 and add the data URL prefix
      // Try to detect image type from the base64 string
      const isJpeg = formData.photo.startsWith('/9j/') || formData.photo.includes('JFIF') || formData.photo.includes('Exif');
      const isPng = formData.photo.startsWith('iVBORw');
      const isGif = formData.photo.startsWith('R0lGOD');
      const isWebp = formData.photo.startsWith('UklGR');
      
      let mimeType = 'image/jpeg'; // Default
      if (isPng) mimeType = 'image/png';
      else if (isGif) mimeType = 'image/gif';
      else if (isWebp) mimeType = 'image/webp';
      
      return { uri: `data:${mimeType};base64,${formData.photo}` };
    }
    
    // Check if it's a URL or filename
    if (formData.photo.startsWith('http')) {
      // It's a full URL
      return { uri: formData.photo };
    }
    
    // It's probably a filename, prepend the API base URL
    return { uri: API.PATIENT_PHOTO + formData.photo };
  };

  export const getImageSourceString = (patient: any) => {
      if (!patient || !patient.photo) {
          return null;
        }
        
        // If it's a base64 string (with or without data: prefix)
        if (typeof patient.photo === 'string') {
      console.log("RETURNING",patient.photo.startsWith('data:image'))
    // If it's already a data URL
    if (patient.photo.startsWith('data:image')) {
      return { uri: patient.photo };
    }

    // If it's a pure base64 string
    if (patient.photo.length > 100 && !patient.photo.includes('http')) {
      // Try to detect image type
      const isJpeg = patient.photo.startsWith('/9j/') || 
                    patient.photo.includes('JFIF') || 
                    patient.photo.includes('Exif');
      const isPng = patient.photo.startsWith('iVBORw');
      const isGif = patient.photo.startsWith('R0lGOD');
      const isWebp = patient.photo.startsWith('UklGR');
      
      let mimeType = 'image/jpeg'; // Default
      if (isPng) mimeType = 'image/png';
      else if (isGif) mimeType = 'image/gif';
      else if (isWebp) mimeType = 'image/webp';
      
      return { uri: `data:${mimeType};base64,${patient.photo}` };
    }

    // If it's a URL or filename
    if (patient.photo.startsWith('http')) {
      return { uri: patient.photo };
    }

    // It's probably a filename, prepend the API base URL
    return { uri: API.PATIENT_PHOTO + patient.photo };
  }

  // If it's an object with uri or base64
  if (typeof patient.photo === 'object') {
    if (patient.photo.uri) {
      return { uri: patient.photo.uri };
    }
    if (patient.photo.base64) {
      return { uri: patient.photo.base64 };
    }
  }

    // Generate initials from name
    
    
    
    return null;
};
export const getInitials = (name: string) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };