import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Capacitor } from '@capacitor/core'

export interface PhotoResult {
  dataUrl: string
  format: string
}

export const pickOrCapture = async (): Promise<PhotoResult | null> => {
  if (!Capacitor.isNativePlatform()) {
    // Fallback to file input on web
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              dataUrl: reader.result as string,
              format: file.type
            })
          }
          reader.readAsDataURL(file)
        } else {
          resolve(null)
        }
      }
      input.click()
    })
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt, // Let user choose camera or gallery
    })

    return {
      dataUrl: image.dataUrl || '',
      format: image.format || 'jpeg'
    }
  } catch (error) {
    console.error('Error capturing photo:', error)
    return null
  }
}

export const capturePhoto = async (): Promise<PhotoResult | null> => {
  if (!Capacitor.isNativePlatform()) {
    return pickOrCapture() // Use file input fallback
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    })

    return {
      dataUrl: image.dataUrl || '',
      format: image.format || 'jpeg'
    }
  } catch (error) {
    console.error('Error capturing photo:', error)
    return null
  }
}

export const pickFromGallery = async (): Promise<PhotoResult | null> => {
  if (!Capacitor.isNativePlatform()) {
    return pickOrCapture() // Use file input fallback
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    })

    return {
      dataUrl: image.dataUrl || '',
      format: image.format || 'jpeg'
    }
  } catch (error) {
    console.error('Error picking photo:', error)
    return null
  }
}
