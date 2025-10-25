import { supabase } from './supabase'

export interface UploadResult {
  url: string
  path: string
}

export const uploadPhoto = async (
  file: File,
  path: string
): Promise<UploadResult | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('moments')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    const { data: urlData } = supabase.storage
      .from('moments')
      .getPublicUrl(data.path)

    return {
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    console.error('Error uploading photo:', error)
    return null
  }
}

export const uploadFromDataUrl = async (
  dataUrl: string,
  filename: string
): Promise<UploadResult | null> => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    
    // Create file from blob
    const file = new File([blob], filename, { type: blob.type })
    
    // Generate unique path
    const timestamp = Date.now()
    const path = `moments/${timestamp}-${filename}`
    
    return await uploadPhoto(file, path)
  } catch (error) {
    console.error('Error uploading from data URL:', error)
    return null
  }
}

export const deletePhoto = async (path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from('moments')
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting photo:', error)
    return false
  }
}

export const getPublicUrl = (path: string): string => {
  const { data } = supabase.storage
    .from('moments')
    .getPublicUrl(path)
  
  return data.publicUrl
}
