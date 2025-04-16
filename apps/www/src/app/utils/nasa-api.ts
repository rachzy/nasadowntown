import { ApiKeyService } from '../services/api-key.service';
import { NASA_DEFAULT_ROUTE } from '../api/api.routes';

export const nasaAPIRequestBuilder = (
  path: string,
  apiKeyService: ApiKeyService
): string => {
  const apiKey = apiKeyService.apiKey;
  if (!apiKey) {
    throw new Error('NASA API key is not available');
  }

  const unauthedURI = `${NASA_DEFAULT_ROUTE}${path}${
    path.includes('?') ? '' : '?'
  }`;

  return `${unauthedURI}${
    unauthedURI.charAt(-1) == '&' ? '' : '&'
  }api_key=${apiKey}`;
};
