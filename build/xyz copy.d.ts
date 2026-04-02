import { AtImpl, OfImpl, PathImpl } from './xyz.js';
/**
 * Typ reprezentujący wszystkie ścieżki w obiekcie.
 *
 * @example
 * type T = { a: { b: { c: number } }, b: number };
 *
 * type P = Path<T>;
 * >> "a" | "a.b" | "a.b.c" | "b"
 */
export type Path<T> = PathImpl<NoInfer<T>>;
/**
 * Typ reprezentujący typ wartości w obiekcie w danej ścieżce o danym typie.
 *
 * @example
 * type T = [1, { a: number }];
 *
 * PathAt<T, '0'>;
 * >> 1
 * PathAt<T, '1.a'>;
 * >> number
 */
export type PathAt<T, P extends Path<NoInfer<T>>> = AtImpl<NoInfer<T>, NoInfer<P>>;
/**
 * Typ reprezentujący wszystkie ścieżki w obiekcie, które prowadzą do wartości danego typu.
 *
 * @example
 * type T = { a: { b: { c: number } }, b: number };
 *
 * PathOf<T, number>;
 *
 * >> "a.b.c" | "b"
 */
export type PathOf<T, E> = OfImpl<NoInfer<T>, NoInfer<E>>;
/**
 * Pobiera wartość w danej ścieżce w obiekcie.
 *
 * @param item obiekt z którego pobieramy wartość.
 * @param path ścieżka do wartości w obiekcie.
 *
 * @returns Wartość w danej ścieżce w obiekcie.
 *
 * @example
 * const item = { a: { b: { c: 1 } } };
 *
 * getPath(item, 'a.b.c');
 * >> 1
 */
export declare function getPath<TItem, TPath extends Path<TItem>>(item: TItem, path: TPath): PathAt<NoInfer<TItem>, NoInfer<TPath>>;
/**
 * Zapisz wartość w danej ścieżce w obiekcie.
 *
 * @param item obiekt z którego pobieramy wartość.
 * @param path ścieżka do wartości w obiekcie.
 * @param value Wartość do zapisania w obiekcie.
 *
 * @returns obiekt z przypisana wartością w danej ścieżce.
 *
 * @example
 * const item = { a: { b: { c: 1 } } };
 *
 * setPath(item, 'a.b.c', 2);
 * >> { a: { b: { c: 2 } } }
 */
export declare function setPath<TItem, TPath extends Path<TItem>>(item: TItem, path: TPath, value: PathAt<TItem, TPath>): TItem;
