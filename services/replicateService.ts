const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string[] | string;
  error?: string;
}

export const generateImageWithReplicate = async (
  prompt: string,
  aspectRatio: string
): Promise<string> => {
  if (!REPLICATE_API_KEY) {
    throw new Error('REPLICATE_API_KEY is not configured');
  }

  const width = aspectRatio === '1:1' ? 1024 : aspectRatio === '16:9' ? 1344 : aspectRatio === '9:16' ? 768 : 1024;
  const height = aspectRatio === '1:1' ? 1024 : aspectRatio === '16:9' ? 768 : aspectRatio === '9:16' ? 1344 : 1024;

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      'Prefer': 'wait'
    },
    body: JSON.stringify({
      version: 'ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4',
      input: {
        prompt,
        width,
        height,
        num_outputs: 1,
        guidance_scale: 7.5,
        num_inference_steps: 50
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Replicate API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const prediction: ReplicatePrediction = await response.json();

  if (prediction.status === 'failed') {
    throw new Error(prediction.error || 'Image generation failed');
  }

  if (prediction.status === 'succeeded' && prediction.output) {
    const imageUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;

    const imageResponse = await fetch(imageUrl);
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
  }

  let pollAttempts = 0;
  const maxPollAttempts = 60;

  while (pollAttempts < maxPollAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to check prediction status: ${statusResponse.status}`);
    }

    const updatedPrediction: ReplicatePrediction = await statusResponse.json();

    if (updatedPrediction.status === 'succeeded' && updatedPrediction.output) {
      const imageUrl = Array.isArray(updatedPrediction.output)
        ? updatedPrediction.output[0]
        : updatedPrediction.output;

      const imageResponse = await fetch(imageUrl);
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
    }

    if (updatedPrediction.status === 'failed') {
      throw new Error(updatedPrediction.error || 'Image generation failed');
    }

    pollAttempts++;
  }

  throw new Error('Image generation timed out');
};
