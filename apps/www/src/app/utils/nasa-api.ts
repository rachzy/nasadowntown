import { NASA_API_KEY, NASA_DEFAULT_ROUTE } from '../api/api.routes';

export const nasaAPIRequestBuilder = (
  args: string,
  apiKey: string = NASA_API_KEY
): string => {
  const unauthURI = `${NASA_DEFAULT_ROUTE}${args}${
    args.includes('?') ? '' : '?'
  }`;

  return `${unauthURI}${
    unauthURI.charAt(-1) == '&' ? '' : '&'
  }api_key=${apiKey}`;
};
