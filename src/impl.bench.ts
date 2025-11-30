import { bench, BenchOptions, describe } from 'vitest';

type Package = typeof import('./impl.js');

const impl_1: Package = await import('./impl.js');

const impl_2: Package = {
  get: (item, path) => {
    try {
      const segments = path.split('.');

      let result = item as any;
      for (let i = 0, it = segments.length; i < it; ++i) result = result[segments[i]];

      return result;
    } catch {
      return undefined;
    }
  },
  set: (item, path, value) => {
    const segments = path.split('.');

    let target = item as any;
    for (let i = 0, it = segments.length - 1; i < it; ++i) {
      const key = segments[i];

      if (!(key in target)) target[key] = {};
      target = target[key];
    }

    target[segments[segments.length - 1]] = value;

    return item;
  },
};

describe('Path Bench', () => {
  const options: BenchOptions = {
    warmupIterations: 1000,
    iterations: 10000,
  };

  describe('Get', () => {
    const item = { a: { b: { c: 1 } } };

    bench(
      'impl_1',
      () => {
        impl_1.get(item, 'a.b.c');
      },
      options,
    );

    bench(
      'impl_2',
      () => {
        impl_2.get(item, 'a.b.c');
      },
      options,
    );
  });

  describe('Set', () => {
    const item = { a: { b: { c: 1 } } };

    bench(
      'impl_1',
      () => {
        impl_1.set(item, 'a.b.c', Math.random());
      },
      options,
    );

    bench(
      'impl_2',
      () => {
        impl_2.set(item, 'a.b.c', Math.random());
      },
      options,
    );
  });
});
