// types.ts

export enum UploadStatus {
  UPLOADING = 'uploading',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
  previewUrl: string;
  analysis: string | null;
  providerName?: string;
  modelName?: string;
}
