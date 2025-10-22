export interface Model {
  id: string;
  name: string;
  description: string;
  active: boolean;
  tags?: string[];
}

export interface LLMProvider {
  id: string;
  name: string;
  models: Model[];
  active: boolean;
}

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'google',
    name: 'Google',
    active: true,
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Advanced reasoning for complex tasks.', active: true, tags: ['max'] },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Fast and versatile for most tasks.', active: true },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    active: true,
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'The latest and most advanced model.', active: true },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    active: true,
    models: [
      { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', description: 'The new, faster, and more intelligent model.', active: true, tags: ['new'] },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful model for complex analysis.', active: true, tags: ['max'] },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    active: true,
    models: [
       { id: 'llama-3-sonar-large-32k-online', name: 'Sonar Large Online', description: 'Llama 3-based model with web access.', active: true },
    ]
  },
  {
    id: 'other',
    name: 'Other',
    active: true,
    models: [
       { id: 'grok-4', name: 'Grok 4', description: 'Model from xAI.', active: false }, // Disabled until supported
    ]
  }
];