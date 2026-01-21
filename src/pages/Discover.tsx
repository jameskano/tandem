import React, { useEffect } from 'react'
import DiscoverList from '../components/DiscoverList/DiscoverList'
import { seedData } from '../shared/seed'

const Discover: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg">
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-text mb-2">Discover</h1>
          <p className="text-textMuted">Find new activities to try together</p>
        </div>

        <DiscoverList />
      </div>
    </div>
  )
}
export default Discover