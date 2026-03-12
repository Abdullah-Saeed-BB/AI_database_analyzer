export default function getRandomElements<T extends Record<string, any[]>>(data: T, n: number): T {
  const keys = Object.keys(data) as (keyof T)[];
  
  if (keys.length === 0) return {} as T;
  if (n >= data[keys[0]].length) return data;

  const totalLength = data[keys[0]].length;
  const count = Math.min(n, totalLength);

  // 1. Create an array of indices [0, 1, 2, ..., totalLength - 1]
  const indices = Array.from({ length: totalLength }, (_, i) => i);

  // 2. Fisher-Yates Shuffle (more efficient & reliable than .sort())
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // 3. Take the first 'count' indices
  const selectedIndices = indices.slice(0, count);

  // 4. Construct the result object
  const result = {} as T;
  for (const key of keys) {
    result[key] = selectedIndices.map(idx => data[key][idx]) as T[keyof T];
  }

  return result;
}