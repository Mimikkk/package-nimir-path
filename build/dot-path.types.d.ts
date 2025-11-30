type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type IsEqual<T1, T2> = T1 extends T2 ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2 ? true : false : false;
type isAnyEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;
type Join<TKey extends string, TItem, TOriginalItem> = TItem extends Primitive ? TKey : true extends isAnyEqual<TOriginalItem, TItem> ? TKey : TKey | `${TKey}.${PathImpl<TItem, TOriginalItem>}`;
type NumberKey = `${number}`;
type PathArray<T extends readonly unknown[], TType> = Join<NumberKey, T[number], TType>;
type IsTuple<T extends readonly unknown[]> = number extends T['length'] ? false : true;
type TupleKeys = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16';
type TupleKey<T extends readonly unknown[]> = TupleKeys & keyof T;
type PathTuplePaths<T extends readonly unknown[], TKeys extends TupleKey<T>, TType> = {
    [K in TKeys]: Join<K, T[K], TType>;
}[TKeys];
type PathTuple<T extends readonly unknown[], TType> = PathTuplePaths<T, TupleKey<T>, TType>;
type ObjectKey<T> = Exclude<keyof T, symbol>;
type PathObjectPaths<T, TKeys extends ObjectKey<T>, TType> = {
    [K in TKeys]: Join<K extends string ? K : `${K}`, T[K], TType>;
}[TKeys];
type PathObject<T, TType> = PathObjectPaths<T, ObjectKey<T>, TType>;
export type PathImpl<TItem, TOriginalItem = TItem> = TItem extends readonly unknown[] ? IsTuple<TItem> extends true ? PathTuple<TItem, TOriginalItem> : PathArray<TItem, TOriginalItem> : PathObject<TItem, TOriginalItem>;
type SplitPath<TPath extends string> = TPath extends `${infer K}.${infer R}` ? [K, ...SplitPath<R>] : [TPath];
type ResolvePathPart<TItem, TPart extends string> = TItem extends null | undefined ? NonNullable<TItem>[TPart] | undefined : TItem[Extract<TPart, keyof TItem>];
type ResolvePathParts<TItem, TParts extends readonly string[]> = TParts extends [infer TPart extends string] ? ResolvePathPart<TItem, TPart> : TParts extends [infer TPart extends string, ...infer TRest extends readonly string[]] ? ResolvePathParts<ResolvePathPart<TItem, TPart>, TRest> : never;
export type AtImpl<TItem, TPath extends PathImpl<TItem>> = ResolvePathParts<TItem, SplitPath<TPath>>;
type OfImplPaths<TItem, TPaths extends PathImpl<TItem>, TExpectedType> = {
    [K in TPaths]: AtImpl<TItem, K> extends TExpectedType ? K : never;
}[TPaths];
export type OfImpl<TItem, TExpectedType> = OfImplPaths<TItem, PathImpl<TItem>, TExpectedType>;
export {};
