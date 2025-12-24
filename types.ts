export interface Scenario {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  icon: string;
}

export interface GeneratedImage {
  id: string;
  originalImageBase64: string; // The source product
  imageUrl: string; // The generated result
  scenarioName: string;
  promptUsed: string;
  timestamp: number;
  isLoading?: boolean;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  SELECT_SCENARIO = 'SELECT_SCENARIO',
  RESULTS = 'RESULTS'
}
