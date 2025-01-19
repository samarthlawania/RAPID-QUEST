import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const config = await request.json()
  
  try {
    const layout = await readFile('public/layout.html', 'utf-8')
    const renderedTemplate = layout
      .replace('{{title}}', config.title)
      .replace('{{content}}', config.content)
      .replace('{{imageUrl}}', config.imageUrl)

    return new NextResponse(renderedTemplate, {
      headers: { 
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="email_template.html"'
      },
    })
  } catch (error) {
    console.error('Error rendering template:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

