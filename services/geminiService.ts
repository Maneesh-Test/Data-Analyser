import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";
import { withRetry } from "../utils/retryUtils";

let ai: GoogleGenAI;

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

const getAI = () => {
    if (!ai) {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key is not configured. Please check your environment variables.');
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

// ---- Audio / Speech ----

export const transcribeAudio = async (audioFile: File): Promise<string> => {
    trackUsage();
    const ai = getAI();
    const audioBytes = await fileToBase64(audioFile);
    const audioPart = {
        inlineData: {
            data: audioBytes,
            mimeType: audioFile.type,
        },
    };

    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [audioPart, {text: "Transcribe the following audio. Provide only the transcribed text, without any additional formatting, timestamps, or commentary."}] }
        });
        return response.text;
    });
};

export const generateSpeech = async (text: string): Promise<string> => {
    trackUsage();
    const ai = getAI();

    return withRetry(async () => {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-preview-tts",
          contents: [{ parts: [{ text }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
          },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("API did not return audio data.");
        }
        return base64Audio;
    });
};


// ---- Image ----

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    trackUsage();
    const ai = getAI();

    return withRetry(async () => {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return base64ImageBytes;
        } else {
            throw new Error("No image was generated. The prompt may have been blocked due to safety policies.");
        }
    });
};

export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
    trackUsage();
    const ai = getAI();
    const imageBytes = await fileToBase64(imageFile);

    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: { data: imageBytes, mimeType: imageFile.type },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

        if (imagePart?.inlineData?.data) {
            return imagePart.inlineData.data;
        }

        throw new Error("No image was generated. The response may have been blocked or did not contain image data.");
    });
};

// ---- Video ----

export const generateVideo = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    trackUsage();
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key is not configured. Please check your environment variables.');
    }
    const videoAI = new GoogleGenAI({ apiKey });
    
    let imagePayload: { imageBytes: string; mimeType: string; } | undefined = undefined;
    if (imageFile) {
        const base64Image = await fileToBase64(imageFile);
        imagePayload = {
            imageBytes: base64Image,
            mimeType: imageFile.type,
        };
    }

    let operation = await videoAI.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        ...(imagePayload && { image: imagePayload }),
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await videoAI.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or did not return a download link.");
    }

    const response = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    const videoUrl = URL.createObjectURL(videoBlob);
    
    return videoUrl;
};

export const analyzeVideo = async (videoFile: File): Promise<string> => {
    trackUsage();
    const ai = getAI();
    const videoBytes = await fileToBase64(videoFile);
    const videoPart = {
        inlineData: {
            data: videoBytes,
            mimeType: videoFile.type,
        },
    };

    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [videoPart, {text: "Analyze this video and describe what is happening. Provide a concise summary at the end."}] }
        });
        return response.text;
    });
};