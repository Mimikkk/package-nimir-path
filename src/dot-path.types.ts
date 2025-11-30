// Path<T>
type Primitive = null | undefined | string | number | boolean | symbol | bigint;

type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

type isAnyEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;

type Join<TKey extends string, TValue, TOriginalValue> = TValue extends Primitive
  ? TKey
  : true extends isAnyEqual<TOriginalValue, TValue>
    ? TKey
    : TKey | `${TKey}.${PathImpl<TValue, TOriginalValue>}`;

/// Array
type NumberKey = `${number}`;
type PathArray<T extends readonly unknown[], TType> = Join<NumberKey, T[number], TType>;

/// Tuple
type IsTuple<T extends readonly unknown[]> = number extends T['length'] ? false : true;

type TupleKeys =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16';

type TupleKey<T extends readonly unknown[]> = TupleKeys & keyof T;
type PathTuplePaths<T extends readonly unknown[], TKeys extends TupleKey<T>, TType> = {
  [K in TKeys]: Join<K, T[K], TType>;
}[TKeys];
type PathTuple<T extends readonly unknown[], TType> = PathTuplePaths<T, TupleKey<T>, TType>;

/// Object
type ObjectKey<T> = Exclude<keyof T, symbol>;
type PathObjectPaths<T, TKeys extends ObjectKey<T>, TType> = {
  [K in TKeys]: Join<K extends string ? K : `${K}`, T[K], TType>;
}[TKeys];
type PathObject<T, TType> = PathObjectPaths<T, ObjectKey<T>, TType>;

// Path.At<T>
export type PathImpl<TValue, TOriginalValue = TValue> = TValue extends readonly unknown[]
  ? IsTuple<TValue> extends true
    ? PathTuple<TValue, TOriginalValue>
    : PathArray<TValue, TOriginalValue>
  : PathObject<TValue, TOriginalValue>;

type SplitPath<TPath extends string> = TPath extends `${infer K}.${infer R}` ? [K, ...SplitPath<R>] : [TPath];

type ResolvePathPart<TValue, TPart extends string> = TValue extends null | undefined
  ? NonNullable<TValue>[TPart] | undefined
  : TValue[Extract<TPart, keyof TValue>];

type ResolvePathParts<TValue, TParts extends readonly string[]> = TParts extends [infer TPart extends string]
  ? ResolvePathPart<TValue, TPart>
  : TParts extends [infer TPart extends string, ...infer TRest extends readonly string[]]
    ? ResolvePathParts<ResolvePathPart<TValue, TPart>, TRest>
    : never;

export type AtImpl<T, P extends PathImpl<T>> = ResolvePathParts<T, SplitPath<P>>;

// Path.Of<T, P>
type OfImplPaths<TValue, TPaths extends PathImpl<TValue>, TExpectedType> = {
  [K in TPaths]: AtImpl<TValue, K> extends TExpectedType ? K : never;
}[TPaths];

export type OfImpl<TValue, TExpectedType> = OfImplPaths<TValue, PathImpl<TValue>, TExpectedType>;
