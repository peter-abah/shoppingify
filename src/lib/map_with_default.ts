export const DEFAULT = Symbol();
export class MapWithDefault<K, V> extends Map<K | typeof DEFAULT, V> {
  get(key: K): V {
    return super.has(key) ? (super.get(key) as V) : (super.get(DEFAULT) as V);
  }
}
