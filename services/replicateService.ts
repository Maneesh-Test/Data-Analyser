export const generateImageWithReplicate = async (
  prompt: string,
  aspectRatio: string
): Promise<string> => {
  const width = aspectRatio === '1:1' ? 1024 : aspectRatio === '16:9' ? 1344 : aspectRatio === '9:16' ? 768 : aspectRatio === '4:3' ? 1024 : aspectRatio === '3:4' ? 768 : 1024;
  const height = aspectRatio === '1:1' ? 1024 : aspectRatio === '16:9' ? 768 : aspectRatio === '9:16' ? 1344 : aspectRatio === '4:3' ? 768 : aspectRatio === '3:4' ? 1024 : 1024;

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&enhance=true`;

  try {
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      throw new Error(`Failed to generate image: ${imageResponse.status}`);
    }

    const imageBlob = await imageResponse.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to generate image');
  }
};
