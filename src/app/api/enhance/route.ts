import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, description, audience, features, techStack, tone, apiKey } = body

    // Use user's API key if provided, otherwise use server key
    const openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are an expert prompt engineer. Your job is to take rough project ideas and transform them into detailed, well-structured prompts that will get exceptional results from AI assistants.

When creating prompts, you should:
1. Add clear structure with sections (Context, Requirements, Technical Specs, Deliverables, Guidelines, Approach)
2. Be specific and detailed - vague prompts get vague results
3. Include edge cases and error handling considerations
4. Add best practices for the technology/domain
5. Include a step-by-step approach section
6. Make the prompt self-contained (AI shouldn't need to ask follow-up questions)

Output ONLY the enhanced prompt, no explanations or meta-commentary.`

    const userPrompt = `Transform this rough project idea into a detailed, production-ready prompt:

PROJECT TYPE: ${projectType}
DESCRIPTION: ${description}
TARGET AUDIENCE: ${audience}
KEY FEATURES:
${features}
${techStack ? `TECH STACK: ${techStack}` : ''}
DESIRED TONE: ${tone}

Create a comprehensive, well-structured prompt that will help an AI assistant build this effectively.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const enhancedPrompt = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ 
      success: true, 
      prompt: enhancedPrompt,
      tokens: completion.usage?.total_tokens || 0
    })

  } catch (error: unknown) {
    console.error('Enhancement error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to enhance prompt'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
