import { describe, expect, expectTypeOf, it } from 'vitest';
import { Path, PathAt, PathOf, get, set } from './dot-path.js';

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };

describe('dot-path', () => {
  type Item = { a: { b: { c: number } }; b: number };
  type Tuple = [string, [first: Item, second: Item]];
  type Array = Item[];

  const item: Item = { a: { b: { c: 1 } }, b: 2 };
  const tuple: Tuple = ['a', [structuredClone(item), structuredClone(item)]];
  const array: Array = [structuredClone(item), structuredClone(item)];

  describe('Typescript - utility types', () => {
    describe('Path<T>', () => {
      it('should get path from object', () => {
        expectTypeOf<Path<Item>>().toEqualTypeOf<'a' | 'b' | 'a.b' | 'a.b.c'>();
      });

      it('should get path from tuple', () => {
        expectTypeOf<Path<Tuple>>().toEqualTypeOf<
          | '0'
          | '1'
          | '1.0'
          | '1.1'
          | '1.0.a'
          | '1.0.b'
          | '1.0.a.b'
          | '1.0.a.b.c'
          | '1.1.a'
          | '1.1.b'
          | '1.1.a.b'
          | '1.1.a.b.c'
        >();
      });

      it('should get path from array', () => {
        expectTypeOf<Path<Array>>().toEqualTypeOf<
          `${number}` | `${number}.a` | `${number}.b` | `${number}.a.b` | `${number}.a.b.c`
        >();
      });

      it('should get path from nested object', () => {
        type Item = { a: number; b: { c: Item } };

        expectTypeOf<Path<Item>>().toEqualTypeOf<'a' | 'b' | 'b.c'>();
      });

      it('should get path from simplify nested object', () => {
        type Item = { a: number; b: { a: number; b: Item } };

        expectTypeOf<Path<Item>>().toEqualTypeOf<'a' | 'b'>();
      });
    });

    describe('Of<T, R>', () => {
      it('should list all number paths in an object', () => {
        expectTypeOf<PathOf<Item, number>>().toEqualTypeOf<'b' | 'a.b.c'>();
      });

      it('should list all object paths in an object', () => {
        expectTypeOf<PathOf<Item, { c: number }>>().toEqualTypeOf<'a.b'>();
      });

      it('should list all number paths in an array', () => {
        expectTypeOf<PathOf<Array, number>>().toEqualTypeOf<`${number}.b` | `${number}.a.b.c`>();
      });

      it('should list all object paths in an array', () => {
        expectTypeOf<PathOf<Array, { c: number }>>().toEqualTypeOf<`${number}.a.b`>();
      });

      it('should list all number paths in a tuple', () => {
        expectTypeOf<PathOf<Tuple, number>>().toEqualTypeOf<'1.0.b' | '1.0.a.b.c' | '1.1.b' | '1.1.a.b.c'>();
      });

      it('should list all object paths in a tuple', () => {
        expectTypeOf<PathOf<Tuple, { c: number }>>().toEqualTypeOf<'1.0.a.b' | '1.1.a.b'>();
      });
    });

    describe('At<T, P>', () => {
      it('should get type of value at path in object', () => {
        expectTypeOf<PathAt<Item, 'a.b.c'>>().toEqualTypeOf<number>();
        expectTypeOf<PathAt<Item, 'a.b'>>().toEqualTypeOf<{ c: number }>();
      });

      it('should get type of value at path in array', () => {
        expectTypeOf<PathAt<Array, `${number}.b` | `${number}.a.b.c`>>().toEqualTypeOf<number>();
      });

      it('should get type of value at path in tuple', () => {
        expectTypeOf<PathAt<Tuple, '0'>>().toEqualTypeOf<string>();
        expectTypeOf<PathAt<Tuple, '1.0' | '1.1'>>().toEqualTypeOf<Item>();
      });

      it('should get type of an optional value at path in object', () => {
        expectTypeOf<PathAt<DeepPartial<Item>, 'a.b.c' | 'b'>>().toEqualTypeOf<number | undefined>();
      });
    });
  });

  describe('get', () => {
    it('should get value from object at path', () => {
      const value = get(item, 'a.b.c');

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it('should get value from array at path', () => {
      const value = get(array, '0.a.b.c');

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it('should get value from tuple at path', () => {
      const value = get(tuple, '1.0.a.b.c');

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it('should get optional value from object at path', () => {
      const item: DeepPartial<Item> = {};

      const value = get(item, 'a.b.c');

      expectTypeOf(value).toEqualTypeOf<number | undefined>();
      expect(value).toEqual(undefined);
    });
  });

  describe('set', () => {
    it('should set value from object at path', () => {
      const result = set(structuredClone(item), 'a.b.c', 2);

      expectTypeOf(result).toEqualTypeOf<Item>();
      expect(result).toEqual({ a: { b: { c: 2 } }, b: 2 });
    });

    it('should set value from array at path', () => {
      const result = set(structuredClone(array), '0.a.b.c', 2);

      expectTypeOf(result).toEqualTypeOf<Array>();
      expect(result).toEqual([{ a: { b: { c: 2 } }, b: 2 }, item]);
    });

    it('should set value from tuple at path', () => {
      const result = set(structuredClone(tuple), '1.0.a.b.c', 2);

      expectTypeOf(result).toEqualTypeOf<Tuple>();
      expect(result).toEqual(['a', [{ a: { b: { c: 2 } }, b: 2 }, item]]);
    });

    it('should set optional value from object at path', () => {
      const item: DeepPartial<Item> = {};

      const result = set(structuredClone(item), 'a.b.c', 2);

      expectTypeOf(result).toEqualTypeOf<DeepPartial<Item>>();
      expect(result).toEqual({ a: { b: { c: 2 } } });
    });
  });
});
