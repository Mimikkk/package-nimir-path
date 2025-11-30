import type { AtImpl, OfImpl, PathImpl } from './dot-path.types.js';

/**
 * Type representing all possible paths in an object.
 *
 * @example
 * type T = { a: { b: { c: number } }, b: number };
 *
 * type P = Path<T>;
 * >> "a" | "a.b" | "a.b.c" | "b"
 */
export type Path<TItem> = PathImpl<TItem>;

/**
 * Type that represents the value type at a given path in an object.
 *
 * @example
 * type T = [1, { a: number }];
 *
 * Path.At<T, '0'>;
 * >> 1
 * Path.At<T, '1.a'>;
 * >> number
 */
export type PathAt<TItem, TPath extends Path<TItem>> = AtImpl<TItem, TPath>;

/**
 * Type that represents all paths in an object that lead to a value of a given type.
 *
 * @example
 * type T = { a: { b: { c: number } }, b: number };
 *
 * Path.Of<T, number>;
 *
 * >> "a.b.c" | "b"
 */
export type PathOf<TItem, TExpectedType> = OfImpl<TItem, TExpectedType>;

/**
 * Retrieves the value at the given path within an object.
 *
 * @param item The object from which to retrieve the value.
 * @param path The path to the value in the object.
 *
 * @returns The value at the given path within the object.
 *
 * @example
 * const item = { a: { b: { c: 1 } } };
 *
 * Path.get(item, 'a.b.c');
 * >> 1
 */
export function get<const TItem, TPath extends Path<TItem>>(
  item: TItem,
  path: TPath,
): PathAt<NoInfer<TItem>, NoInfer<TPath>> {
  try {
    const segments = path.split('.');

    let result = item as never;
    for (let i = 0, it = segments.length; i < it; ++i) {
      result = result[segments[i]];
    }
    return result;
  } catch (error) {
    if (error instanceof TypeError) {
      return undefined!;
    }

    throw error;
  }
}

/**
 * Sets the value at the given path within an object.
 *
 * @param item The object in which to set the value.
 * @param path The path to the value in the object.
 * @param value The value to set at the specified path.
 *
 * @returns The object with the value set at the specified path.
 *
 * @example
 * const item = { a: { b: { c: 1 } } };
 * Path.set(item, 'a.b.c', 2);
 * >> { a: { b: { c: 2 } } }
 *
 * const item = { };
 * Path.set(item, 'a.b.c', 2);
 * >> { a: { b: { c: 2 } } }
 */
export function set<const TItem, TPath extends Path<TItem>>(
  item: TItem,
  path: TPath,
  value: PathAt<NoInfer<TItem>, NoInfer<TPath>>,
): TItem {
  const segments = path.split('.');

  let target = item as any;
  for (let i = 0, it = segments.length - 1; i < it; ++i) {
    const key = segments[i];

    if (!(key in target)) target[key] = {};

    target = target[key];
  }

  target[segments[segments.length - 1]] = value;

  return item;
}
