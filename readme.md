# @nimir/dot-path - Typescript friendly object/tuple path resolve

<a href="https://www.npmjs.com/package/@nimir/dot-path">
  <img alt="minzipped size" src="https://flat.badgen.net/bundlephobia/minzip/@nimir/dot-path" />
</a>
<a href="https://www.npmjs.com/package/@nimir/dot-path">
  <img alt="npm version" src="https://img.shields.io/npm/v/@nimir/dot-path.svg?style=flat-square" />
</a>
<a href="https://www.npmjs.com/package/@nimir/dot-path">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/@nimir/dot-path.svg?style=flat-square" />
</a>
<a href="https://www.npmjs.com/package/@nimir/dot-path">
  <img alt="dependency count" src="https://flat.badgen.net/bundlephobia/dependency-count/@nimir/dot-path" />
</a>
<a href="https://www.npmjs.com/package/@nimir/dot-path">
  <img alt="treeshakable" src="https://flat.badgen.net/bundlephobia/tree-shaking/@nimir/dot-path" />
</a>

Full thanks to [gmarkov](https://github.com/g-makarov) and his [dot-path-value](https://github.com/g-makarov/dot-path-value).

This library allows for performant extraction and setting of nested elements via a typesafe dot-path.

## Install

```bash
pnpm install @nimir/dot-path
```

```bash
npm install @nimir/dot-path
```

```bash
yarn add @nimir/dot-path
```

```bash
deno install npm:@nimir/dot-path
```

```bash
bun install npm:@nimir/dot-path
```

## Features

- `Path<T>` - Get all paths of T in dotted string format.
- `PathAt<T, Y>` - Get the type of value at path Y of T.
- `PathOf<T, Y>` - Get all paths with type Y of T in dotted string format.
- `get(item, path)` - Get value by path with type-safety.
- `set(item, path, value)` - Set value by path with type-safety.
- Supports object, array, tuple and recursive types.

## Usage

### Usage of Path utilities

```ts
import type { Path } from '@nimir/dot-path';
type Item = {
  a: { b: { c: string } };
  b: number;
  c: string;
};

Path<Item>;
//   ^? "a.b.c" | "b" | "a.b" | "a"

PathOf<Item, string>;
//   ^? "a.b.c" | "c"

PathOf<Item, number | string>;
//   ^? "a.b.c" | "b" | "c"

PathOf<Item, { c: number }>;
//   ^? "a.b"

PathAt<Item, 'a.b.c'>;
//   ^? string

PathAt<Item, 'a.b'>;
//   ^? { c: string }

PathAt<Item, 'a.b.c.d'>;
//   ^? never

PathAt<Item, 'a.b.c' | 'a.b'>;
//   ^? string | { c: string }

type RecursiveItem = {
  a: RecursiveItem;
  b: number;
};

Path<RecursiveItem>;
//   ^? "a" | "b" // Does Not throw typescript lsp into an infinite loop
```

### Usage with an object

```ts
import { get, set } from '@nimir/dot-path';

type Item = {
  a: { b: { c: string } };
  b: number;
  c: string;
};

const item: Item = {
  a: { b: { c: 'hello' } },
  b: 0xbeef,
  c: 'world!',
};

get(item, 'a.b.c');
// -> string
get(item, 'a.b');
// -> number
get(item, 'himom!');
// -> undefined

set(item, 'a.b.c', 'himom!');
// valid
set(item, 'a.b.c', 0xbeef);
// invalid
set(item, 'a.b', { c: 'himom!' });
// valid
```

### Usage with a tuple

```ts
import { get, set } from '@nimir/dot-path';

type Item = {
  a: { b: { c: string } };
  b: number;
};

type Tuple = [string, [first: Item, second: Item]];

const tuple: Tuple = ['hello', [item, item]];

get(tuple, '0');
// -> string
get(tuple, '1.0.a.b.c');
// -> string
get(tuple, '1');
// -> [first: Item, second: Item]
get(tuple, 'himom!');
// -> undefined

set(tuple, '0', 'himom!');
// valid
set(tuple, '1.0.a.b.c', 'himom!');
// valid
set(tuple, '1.0.a.b.c', 0xbeef);
// invalid
set(tuple, '1.0.a.b', { c: 'himom!' });
// valid
```

### Usage with an array

```ts
import { get, set } from '@nimir/dot-path';

type Item = {
  a: { b: { c: string } };
  b: number;
  c: string;
};

const items: Item[] = [item, item];

get(items, '0');
// -> Item
get(items, '1.a.b.c');
// -> string
get(items, 'himom!');
// -> undefined

set(items, '0', { a: { b: { c: 'himom!' } }, b: 0xbeef });
// valid
set(items, '1.a.b.c', 'himom!');
// valid
set(items, '1.a.b.c', 0xbeef);
// invalid
set(items, '1.a.b', { c: 'himom!' });
// valid
```

## Caveats

- **Ergonomics first** - The library does not guard against users' type mistakes, performs no runtime checks, and swallows all access errors returning an undefined instead. Its meant for its utility value.
- **Tuple Size Limitation** - Tuple path resolution is limited to 16 elements (indices 0-16). Tuples larger than this will not have proper type inference for indices beyond 16.
- **Mutation Behavior** - The `set` function mutates the input object and returns the same reference. It does not create a deep copy.
- **Object Creation** - When creating intermediate paths, `set` always creates plain objects `{}`. This can cause type mismatches if the expected structure contains arrays.
- **No Prototype Pollution Protection** - The library does not guard against prototype pollution attacks. Avoid using untrusted input as paths.
