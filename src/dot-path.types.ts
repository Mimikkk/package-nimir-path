// Path<T>
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type NilOf<T> = Extract<T, undefined | null>;
type NotNil<T> = Exclude<T, undefined | null>;

type SafeJoin<TKey extends string, TItem, TRoot> = [TItem] extends [Primitive]
  ? TKey
  : [TItem] extends [TRoot]
    ? TKey
    : TKey | `${TKey}.${PathImpl<TItem, TRoot>}`;

/// Array
type NumberKey = `${number}`;
type ArrayPath<T extends readonly unknown[], TRoot> = SafeJoin<NumberKey, T[number], TRoot>;

/// Tuple
type IsTuple<T extends readonly unknown[]> = number extends T["length"] ? false : true;

type TupleKeys =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16";

type TupleKey<T> = TupleKeys & keyof T;
type TuplePath<T extends readonly unknown[], TRoot> = {
  [TKey in TupleKey<T>]: SafeJoin<TKey, T[TKey], TRoot>;
}[TupleKey<T>];

/// Record
type RecordKey<T> = keyof T & string;
type RecordPath<TItem, TRoot> = {
  [TKey in RecordKey<TItem>]: SafeJoin<TKey, TItem[TKey], TRoot>;
}[RecordKey<TItem>];

// PathAt<T>
export type PathImpl<TItem, TRoot = TItem> = TItem extends readonly unknown[]
  ? IsTuple<TItem> extends true
    ? TuplePath<TItem, TRoot>
    : ArrayPath<TItem, TRoot>
  : TItem extends object
    ? RecordPath<TItem, TRoot>
    : never;

type SplitPath<TPath extends string> = TPath extends `${infer TPart}.${infer TParts}`
  ? [TPart, ...SplitPath<TParts>]
  : [TPath];

type ResolvePathPart<TItem, TPart extends string> =
  TPart extends RecordKey<NotNil<TItem>>
    ? NotNil<TItem>[TPart] | NilOf<TItem>
    : TPart extends NumberKey
      ? NotNil<TItem> extends readonly (infer TElement)[]
        ? TElement | NilOf<TItem>
        : never
      : never;

type ResolvePathParts<TItem, TParts extends readonly string[]> = TParts extends [
  infer TPart extends string,
  ...infer TRest extends readonly string[],
]
  ? TRest extends []
    ? ResolvePathPart<TItem, TPart>
    : ResolvePathParts<ResolvePathPart<TItem, TPart>, TRest>
  : never;

export type AtImpl<TItem, TPath extends PathImpl<TItem, TItem>> = ResolvePathParts<TItem, SplitPath<TPath>>;

// PathOf<T, P>
type WalkJoin<TKey extends string, TItem, TRoot, TExpectedType> = [TItem] extends [Primitive]
  ? [TItem] extends [TExpectedType]
    ? TKey
    : never
  : [TItem] extends [TRoot]
    ? never
    : ([TItem] extends [TExpectedType] ? TKey : never) | `${TKey}.${Walk<TItem, TRoot, TExpectedType>}`;

type WalkArray<T extends readonly unknown[], TRoot, TExpectedType> = WalkJoin<
  NumberKey,
  T[number],
  TRoot,
  TExpectedType
>;

type WalkTuple<T extends readonly unknown[], TRoot, TExpectedType> = {
  [TKey in TupleKey<T>]: WalkJoin<TKey, T[TKey], TRoot, TExpectedType>;
}[TupleKey<T>];

type WalkRecord<TItem extends object, TRoot, TExpectedType> = {
  [TKey in RecordKey<TItem>]: WalkJoin<TKey, TItem[TKey], TRoot, TExpectedType>;
}[RecordKey<TItem>];

type Walk<TItem, TRoot, TExpectedType> = TItem extends readonly unknown[]
  ? IsTuple<TItem> extends true
    ? WalkTuple<TItem, TRoot, TExpectedType>
    : WalkArray<TItem, TRoot, TExpectedType>
  : TItem extends object
    ? WalkRecord<TItem, TRoot, TExpectedType>
    : never;

export type OfImpl<TItem, TExpectedType> = Walk<TItem, TItem, TExpectedType>;
