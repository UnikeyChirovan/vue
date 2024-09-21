import api from './axiosInterceptor';
 
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Tải hình ảnh thất bại:', error);
    throw error;
  }
};
