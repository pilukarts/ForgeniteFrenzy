import rawImages from './placeholder-images.json';
import { assetPath } from './assetPath';

function prefixAssetPaths<T>(value: T): T {
  if (typeof value === 'string') {
    return assetPath(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map(prefixAssetPaths) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, prefixAssetPaths(entry)])
    ) as T;
  }

  return value;
}

const images = prefixAssetPaths(rawImages);

export default images;
