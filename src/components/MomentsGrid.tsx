import React from 'react'
import { useI18n } from '../shared/i18n/useI18n'
import Card from '../shared/ui/Card'
import Button from '../shared/ui/Button'
import { useMomentsStore } from '../hooks/useMomentsStore'
import { pickOrCapture } from '../services/camera'
import { uploadFromDataUrl } from '../services/storage'
import { generateId } from '../shared/utils/format'
import { Moment } from '../shared/types'

const MomentsGrid: React.FC = () => {
  const { t } = useI18n()
  const { moments, addMoment } = useMomentsStore()

  const handleAddPhoto = async () => {
    try {
      const photo = await pickOrCapture()
      if (photo) {
        const filename = `moment-${Date.now()}.${photo.format}`
        const uploadResult = await uploadFromDataUrl(photo.dataUrl, filename)

        if (uploadResult) {
          const newMoment: Moment = {
            id: generateId(),
            couple_id: 'demo',
            caption: '',
            image_path: [],
            created_by: 'demo-user',
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
        <h3 className="text-lg font-semibold text-text mb-2">{t('moments.emptyTitle')}</h3>
        <p className="text-textMuted mb-4">{t('moments.emptyDescription')}</p>
        <Button onClick={handleAddPhoto}>{t('moments.addPhoto')}</Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <Button onClick={handleAddPhoto} className="w-full">
          {t('moments.addPhoto')}
        </Button>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {moments.map((moment) => (
          <Card key={moment.id} className="overflow-hidden p-0">
            <div className="relative aspect-square">
              <img
                src={moment.image_path[0]}
                alt={moment.caption || t('moments.imageAlt')}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                <Button size="sm" variant="ghost" className="text-white">
                  {t('moments.view')}
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
