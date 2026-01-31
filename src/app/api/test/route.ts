import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, provider, model, apiKey } = body

    if (!prompt || !provider || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: prompt, provider, apiKey' },
        { status: 400 }
      )
    }

    let response: string = ''

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey })
      const completion = await openai.chat.completions.create({
        model: model || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      })
      response = completion.choices[0]?.message?.content || ''
    } 
    else if (provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey })
      const message = await anthropic.messages.create({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      })
      response = message.content[0].type === 'text' ? message.content[0].text : ''
    }
    else if (provider === 'google') {
      // Google AI integration
      const googleResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
          })
        }
      )
      const googleData = await googleResponse.json()
      response = googleData.candidates?.[0]?.content?.parts?.[0]?.text || ''
    }
    else {
      return NextResponse.json(
        { success: false, error: `Unsupported provider: ${provider}` },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      output: response,
      provider,
      model: model || 'default'
    })

  } catch (error: unknown) {
    console.error('Test error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to test prompt'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
