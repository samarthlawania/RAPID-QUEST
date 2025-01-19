'use client'

import { useState, useEffect } from 'react'
import EmailEditor from '../components/Emaileditor'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [layout, setLayout] = useState('')
  const [emailConfig, setEmailConfig] = useState({
    title: '',
    content: '',
    imageUrl: ''
  })

  useEffect(() => {
    fetchEmailLayout()
  }, [])

  const fetchEmailLayout = async () => {
    const response = await fetch('/api/getEmailLayout')
    const data = await response.text()
    setLayout(data)
  }

  const handleConfigChange = (key: string, value: string) => {
    setEmailConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      handleConfigChange('imageUrl', data.imageUrl)
    }
  }

  const handleSave = async () => {
    await fetch('/api/uploadEmailConfig', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailConfig)
    })
    alert('Email configuration saved!')
  }

  const handleRenderAndDownload = async () => {
    const response = await fetch('/api/renderAndDownloadTemplate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailConfig)
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'email_template.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Builder</h1>
      <EmailEditor
        layout={layout}
        config={emailConfig}
        onConfigChange={handleConfigChange}
        onImageUpload={handleImageUpload}
      />
      <div className="mt-4 space-x-2">
        <Button onClick={handleSave}>Save Configuration</Button>
        <Button onClick={handleRenderAndDownload}>Render and Download</Button>
      </div>
    </div>
  )
}

