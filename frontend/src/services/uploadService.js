import { toast } from 'react-toastify';
import axios from 'axios';

export const uploadImage = async (event) => {
  let toastId = null;

  const image = await getImage(event);
  if (!image) return null;

  const formData = new FormData();
  formData.append('image', image, image.name);

  try {
    const response = await axios.post('/api/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        
        if (toastId) {
          toast.update(toastId, { progress: progress / 100 });
        } else {
          toastId = toast.info('Uploading...', { progress: progress / 100 });
        }
      },
    });

    toast.dismiss(toastId);
    toast.success('Upload successful!');
    return response.data.imageUrl;
  } catch (error) {
    toast.dismiss(toastId);
    toast.error('Upload failed. Please try again.');
    console.error('Upload error:', error);
    return null;
  }
};

const getImage = async (event) => {
  const files = event.target.files;

  if (!files || files.length <= 0) {
    toast.warning('Upload file is not selected!', 'File Upload');
    return null;
  }

  const file = files[0];

  if (file.type !== 'image/jpeg') {
    toast.error('Only JPG type is allowed', 'File Type Error');
    return null;
  }

  return file;
};
