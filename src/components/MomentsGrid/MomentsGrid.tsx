import React from 'react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { useMomentsStore } from '../../state/useMomentsStore'
import { pickOrCapture } from '../../services/camera'
import { uploadFromDataUrl } from '../../services/storage'
import { generateId } from '../../shared/utils/format'

const MomentsGrid: React.FC = () => {
  const { moments, addMoment } = useMomentsStore()

  const handleAddPhoto = async () => {
    try {
      const photo = await pickOrCapture()
      if (photo) {
        const filename = `moment-${Date.now()}.${photo.format}`
        const uploadResult = await uploadFromDataUrl(photo.dataUrl, filename)
        
        if (uploadResult) {
          const newMoment = {
            id: generateId(),
            couple_id: 'demo',
            url: uploadResult.url,
            caption: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          addMoment(newMoment)
        }
      }
    } catch (error) {
      console.error('Error adding photo:', error)
    }
  }

  if (moments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-lg font-semibold text-text mb-2">No moments yet</h3>
        <p className="text-textMuted mb-4">Start capturing your memories together</p>
        <Button onClick={handleAddPhoto}>Add Photo</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Add Photo Button */}
      <Card className="p-4">
        <Button onClick={handleAddPhoto} className="w-full">
          📸 Add Photo
        </Button>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {moments.map((moment) => (
          <Card key={moment.id} className="p-0 overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={moment.url}
                alt={moment.caption || 'Moment'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="sm" variant="ghost" className="text-white">
                  View
                </Button>
              </div>
            </div>
            {moment.caption && (
              <div className="p-3">
                <p className="text-sm text-textMuted">{moment.caption}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MomentsGrid
