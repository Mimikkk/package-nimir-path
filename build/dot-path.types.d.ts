type TupleKeys = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";
type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type NilOf<T> = T extends undefined | null ? T : never;
type NotNil<T> = T extends undefined | null ? never : T;
type TupleKey<T> = TupleKeys & keyof T;
type RecordKey<T> = string & keyof T;
type NumberKey = `${number}`;
type PathJoin<TKey extends string, TItem, TRoot> = TItem extends Primitive ? TKey : TItem extends TRoot ? TKey : TKey | `${TKey}.${PathImpl<TItem, TRoot>}`;
type RecordPath<TItem, TRoot, TKeys extends RecordKey<TItem>> = {
    [TKey in TKeys]: PathJoin<TKey, TItem[TKey], TRoot>;
}[TKeys];
export type PathImpl<TItem, TRoot = TItem> = TItem extends readonly unknown[] ? number extends TItem["length"] ? PathJoin<NumberKey, TItem[number], TRoot> : RecordPath<TItem, TRoot, TupleKey<TItem>> : TItem extends object ? RecordPath<TItem, TRoot, RecordKey<TItem>> : never;
type ResolvePathPart<TItem, TPart extends string> = TPart extends RecordKey<NotNil<TItem>> ? NotNil<TItem>[TPart] | NilOf<TItem> : TPart extends NumberKey ? NotNil<TItem> extends readonly unknown[] ? NotNil<TItem>[number] | NilOf<TItem> : never : never;
type ResolvePathString<TItem, TPath extends string> = TPath extends `${infer THead}.${infer TTail}` ? ResolvePathString<ResolvePathPart<TItem, THead>, TTail> : ResolvePathPart<TItem, TPath>;
export type AtImpl<TItem, TPath extends PathImpl<TItem>> = ResolvePathString<TItem, TPath>;
type WalkJoin<TKey extends string, TItem, TRoot, TExpectedType> = TItem extends Primitive ? TItem extends TExpectedType ? TKey : never : TItem extends TRoot ? never : (TItem extends TExpectedType ? TKey : never) | `${TKey}.${Walk<TItem, TRoot, TExpectedType>}`;
type WalkRecord<TItem, TRoot, TExpectedType, TKeys extends RecordKey<TItem>> = {
    [TKey in TKeys]: WalkJoin<TKey, TItem[TKey], TRoot, TExpectedType>;
}[TKeys];
type Walk<TItem, TRoot, TExpectedType> = TItem extends readonly unknown[] ? number extends TItem["length"] ? WalkJoin<NumberKey, TItem[number], TRoot, TExpectedType> : WalkRecord<TItem, TRoot, TExpectedType, TupleKey<TItem>> : TItem extends object ? WalkRecord<TItem, TRoot, TExpectedType, RecordKey<TItem>> : never;
export type OfImpl<TItem, TExpectedType> = Walk<TItem, TItem, TExpectedType>;
export {};
