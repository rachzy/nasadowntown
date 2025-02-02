import { NASA_API_KEY, NASA_DEFAULT_ROUTE } from '../api/api.routes';

export const nasaAPIRequestBuilder = (
  args: string,
  apiKey: string = NASA_API_KEY
): string =>
  `${NASA_DEFAULT_ROUTE}${args}${
    args.includes('?') ? '' : '?'
  }&api_key=${apiKey}`;
