import { type Driver } from './types';

export interface RequestOptionsWithoutBody {
  method: string;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  };
}

export interface RequestOptionsWithBody {
  method: string;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  };
  body: string;
}

export interface DriverAPIReturn {
  drivers: Driver[];
}

export interface S3ProofAPIReturn {
  url: string;
}

export interface RouteAPIReturn {
  delivery_date: string;
  delivery_map: Route;
}

export type Route = Record<string, string>;
