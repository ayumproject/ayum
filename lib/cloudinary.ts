/**
 * Cloudinary unsigned upload helper
 * Kullanım: const url = await uploadToCloudinary(file)
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary ayarları eksik. .env.local dosyasını kontrol edin.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'ulusmeydan')

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || 'Cloudinary yükleme hatası')
  }

  const data = await res.json()
  // secure_url: https://res.cloudinary.com/cloud_name/image/upload/...
  return data.secure_url as string
}