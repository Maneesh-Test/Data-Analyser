// Fix: Import `Type` for creating a response schema.
import { GoogleGenAI, Type } from "@google/genai";
import { fileToBase64 } from '../utils/fileUtils';
import { LLM_PROVIDERS } from '../lib/models';

let googleAI: GoogleGenAI;

const trackUsage = () => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('apiUsageDate');

    if (stored !== today) {
        localStorage.setItem('apiUsageCount', '1');
        localStorage.setItem('apiUsageDate', today);
    } else {
        const count = parseInt(localStorage.getItem('apiUsageCount') || '0');
        localStorage.setItem('apiUsageCount', (count + 1).toString());
    }
};

const getGoogleAI = () => {
    if (!googleAI) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured. Please check your environment variables.');
        }
        googleAI = new GoogleGenAI({ apiKey });
    }
    return googleAI;
};

interface AnalysisResult {
  analysis: string;
  providerName: string;
  modelName: string;
}

const getProviderAndModel = (modelId: string) => {
    for (const provider of LLM_PROVIDERS) {
        const model = provider.models.find(m => m.id === modelId);
        if (model) {
            return { provider, model };
        }
    }
    throw new Error(`Model with ID "${modelId}" not found.`);
}

const getApiKey = (providerId: string): string => {
    // For Google, the key is handled by the environment.
    if (providerId === 'google') {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured. Please check your environment variables.');
        }
        return apiKey;
    }

    // For other providers, get the user-provided key from local storage.
    const key = localStorage.getItem(`${providerId.toUpperCase()}_API_KEY`);
    if (!key) {
        throw new Error(`API key for ${providerId} is missing. Please add it in the API Keys settings.`);
    }
    return key;
}

// Fix: Create a dedicated function to generate a prompt and response schema for Google Gemini, following best practices for JSON output.
const createGooglePromptAndSchema = (file: File, withReasoning: boolean) => {
  let promptIntro: string;
  let responseSchema: any;

  if (file.type.startsWith('image/')) {
    promptIntro = 'Analyze this image and provide a detailed analysis.';
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        description: { type: Type.STRING, description: "A detailed, paragraph-form description of the image." },
        main_subject: { type: Type.STRING, description: "The primary subject or focal point of the image." },
        elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of key elements or objects present in the image." },
        mood_style: { type: Type.STRING, description: "The overall mood, style, or artistic quality (e.g., vibrant, melancholic, photorealistic)." },
        ...(withReasoning && { reasoning: { type: Type.STRING, description: "A step-by-step explanation of how the analysis was derived." } })
      },
      required: ['description', 'main_subject', 'elements', 'mood_style']
    };
  } else { // text or pdf
    promptIntro = 'Analyze this document and provide a concise summary of its key points, main arguments, and any conclusions.';
    responseSchema = {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "A concise summary of the document's key points." },
        key_points: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the most important takeaways from the document." },
        ...(withReasoning && { reasoning: { type: Type.STRING, description: "A step-by-step explanation of how the analysis was derived." } })
      },
      required: ['summary', 'key_points']
    };
  }

  return { prompt: promptIntro, schema: responseSchema };
};

// Fix: Rename original prompt function to be specific for non-Google providers.
const createLegacyPrompt = (file: File, withReasoning: boolean): string => {
  let promptIntro: string;
  let jsonStructure: string;

  if (file.type.startsWith('image/')) {
    promptIntro = 'Analyze this image and provide a detailed analysis.';
    let structure = {
      description: "A detailed, paragraph-form description of the image.",
      main_subject: "The primary subject or focal point of the image.",
      elements: ["A list of key elements or objects present in the image."],
      mood_style: "The overall mood, style, or artistic quality (e.g., vibrant, melancholic, photorealistic).",
      ...(withReasoning && { reasoning: "A step-by-step explanation of how the analysis was derived." })
    };
    jsonStructure = JSON.stringify(structure, null, 2);

  } else { // text or pdf
    promptIntro = 'Analyze this document and provide a concise summary of its key points, main arguments, and any conclusions.';
    let structure = {
      summary: "A concise summary of the document's key points.",
      key_points: ["A list of the most important takeaways from the document."],
      ...(withReasoning && { reasoning: "A step-by-step explanation of how the analysis was derived." })
    };
    jsonStructure = JSON.stringify(structure, null, 2);
  }

  return `${promptIntro}\n\nIMPORTANT: Your response MUST be only a single, valid JSON object that follows this structure. Do not include markdown, code blocks, or any extra text or explanations.\n${jsonStructure}`;
};

export const analyzeFile = async (
  file: File,
  modelId: string,
  withReasoning: boolean,
  useThinkingMode: boolean = false,
): Promise<AnalysisResult> => {
    trackUsage();
    const { provider, model } = getProviderAndModel(modelId);
    const apiKey = getApiKey(provider.id);
    
    let analysis = '';

    try {
        // Fix: Use the appropriate prompt generation method based on the provider.
        switch (provider.id) {
            case 'google': {
                const { prompt, schema } = createGooglePromptAndSchema(file, withReasoning);
                analysis = await analyzeWithGoogle(file, model.id, prompt, schema, useThinkingMode);
                break;
            }
            case 'openai': {
                const prompt = createLegacyPrompt(file, withReasoning);
                analysis = await analyzeWithOpenAI(file, model.id, prompt, apiKey);
                break;
            }
            case 'anthropic': {
                const prompt = createLegacyPrompt(file, withReasoning);
                analysis = await analyzeWithAnthropic(file, model.id, prompt, apiKey);
                break;
            }
            case 'perplexity': {
                const prompt = createLegacyPrompt(file, withReasoning);
                analysis = await analyzeWithPerplexity(file, model.id, prompt, apiKey);
                break;
            }
            default:
                throw new Error(`Provider ${provider.name} is not supported for analysis.`);
        }
    } catch (error) {
        console.error(`Error analyzing file with ${provider.name} (${model.name}):`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Analysis with ${model.name} failed. Reason: ${errorMessage}`);
    }

    if (!analysis) {
      throw new Error('API returned an empty analysis.');
    }

    return {
      analysis,
      providerName: provider.name,
      modelName: model.name,
    };
};

export const generateReport = async (topic: string, keyPoints: string, audience: string): Promise<string> => {
    trackUsage();
    const prompt = `Generate a well-structured report on the following topic: "${topic}".
    The target audience is: ${audience}.
    Incorporate these key points:
    ${keyPoints}

    The report should have a title, an introduction, several sections with headings, and a conclusion. Format the output in clean markdown.`;

    const response = await getGoogleAI().models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt
    });
    return response.text;
};

export const generateVegaSpec = async (csvData: string, prompt: string): Promise<string> => {
    trackUsage();
    const systemInstruction = `You are a data visualization expert. Your task is to generate a valid Vega-Lite JSON specification based on the user's request and the provided CSV data. Only output the JSON specification, with no extra text or markdown. The CSV data has the following headers and first few rows:\n\n${csvData.split('\n').slice(0, 4).join('\n')}`;

    const response = await getGoogleAI().models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json'
        }
    });

    return response.text;
};


export const cleanCsvData = async (csvData: string, instructions: string): Promise<string> => {
    trackUsage();
    const prompt = `Here is a raw CSV file:\n\n\`\`\`csv\n${csvData}\n\`\`\`\n\nPlease clean this data based on the following instructions: "${instructions}".\n\nYour response MUST be a single JSON object with two keys: "summary_of_changes" (a markdown string detailing the changes you made) and "cleaned_csv" (a string containing only the cleaned data in CSV format).`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary_of_changes: { type: Type.STRING, description: "A markdown-formatted summary of the data cleaning steps taken." },
            cleaned_csv: { type: Type.STRING, description: "The resulting data in raw CSV format, including the header." }
        },
        required: ['summary_of_changes', 'cleaned_csv']
    };
    
    const response = await getGoogleAI().models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema,
        },
    });
    return response.text;
};


// --- Provider-Specific Analysis Functions ---

const analyzeWithGoogle = async (file: File, modelId: string, prompt: string, schema: any, useThinkingMode: boolean): Promise<string> => {
    // This unified approach sends the file as a base64 string for all types (image, text, pdf).
    // This prevents embedding large text content directly into the prompt, fixing token limit errors.
    const base64Data = await fileToBase64(file);
    const contents = {
        parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: prompt }
        ]
    };

    const response = await getGoogleAI().models.generateContent({ 
      model: modelId, 
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        ...(useThinkingMode && { thinkingConfig: { thinkingBudget: 32768 }})
      }
    });
    return response.text;
};

const analyzeWithOpenAI = async (file: File, modelId: string, prompt: string, apiKey: string): Promise<string> => {
    const isText = file.type.startsWith('text/') || file.type === 'application/pdf';
    const messages: any[] = [{ role: 'user', content: [] }];

    if (isText) {
        const textContent = await file.text();
        messages[0].content.push({ type: 'text', text: `Document to Analyze: "${file.name}"\n\n---\n${textContent}\n---\n\nTask: ${prompt}` });
    } else {
        const base64Data = await fileToBase64(file);
        messages[0].content.push({ type: 'text', text: prompt });
        messages[0].content.push({ type: 'image_url', image_url: { url: `data:${file.type};base64,${base64Data}` } });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: modelId, messages, max_tokens: 4000, response_format: { type: "json_object" } }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'OpenAI API request failed');
    return data.choices[0]?.message?.content || '';
};

const analyzeWithAnthropic = async (file: File, modelId: string, prompt: string, apiKey: string): Promise<string> => {
    const isText = file.type.startsWith('text/') || file.type === 'application/pdf';
    const content: any[] = [];

    if (isText) {
        const textContent = await file.text();
        content.push({ type: 'text', text: `Document to Analyze: "${file.name}"\n\n---\n${textContent}\n---\n\nTask: ${prompt}` });
    } else {
        const base64Data = await fileToBase64(file);
        content.push({ type: 'image', source: { type: 'base64', media_type: file.type, data: base64Data } });
        content.push({ type: 'text', text: prompt });
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content }], max_tokens: 4000 }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Anthropic API request failed');
    return data.content[0]?.text || '';
};

const analyzeWithPerplexity = async (file: File, modelId: string, prompt: string, apiKey: string): Promise<string> => {
    const isText = file.type.startsWith('text/') || file.type === 'application/pdf';
    if (!isText) {
        throw new Error('Perplexity API currently only supports text and PDF file analysis in this application.');
    }
    
    const textContent = await file.text();
    const fullPrompt = `Document to Analyze: "${file.name}"\n\n---\n${textContent}\n---\n\nTask: ${prompt}`;

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: fullPrompt }] }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Perplexity API request failed');
    return data.choices[0]?.message?.content || '';
};