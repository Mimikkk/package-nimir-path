import { attest } from "@ark/attest";
import { describe, expect, expectTypeOf, it } from "vitest";
import { Path, PathAt, PathOf, get, set } from "./dot-path.js";

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };

describe("dot-path", () => {
  type Item = { a: { b: { c: number } }; b: number };
  type Tuple = [string, [first: Item, second: Item]];
  type Array = Item[];

  const item: Item = { a: { b: { c: 1 } }, b: 2 };
  const tuple: Tuple = ["a", [structuredClone(item), structuredClone(item)]];
  const array: Array = [structuredClone(item), structuredClone(item)];

  describe("Typescript - utility types", () => {
    describe("Path<T>", () => {
      it("should get path from object", () => {
        expectTypeOf<Path<Item>>().toEqualTypeOf<"a" | "b" | "a.b" | "a.b.c">();
      });

      it("should get path from tuple", () => {
        expectTypeOf<Path<Tuple>>().toEqualTypeOf<
          | "0"
          | "1"
          | "1.0"
          | "1.1"
          | "1.0.a"
          | "1.0.b"
          | "1.0.a.b"
          | "1.0.a.b.c"
          | "1.1.a"
          | "1.1.b"
          | "1.1.a.b"
          | "1.1.a.b.c"
        >();
      });

      it("should get path from array", () => {
        expectTypeOf<Path<Array>>().toEqualTypeOf<
          `${number}` | `${number}.a` | `${number}.b` | `${number}.a.b` | `${number}.a.b.c`
        >();
      });

      it("should get path from nested object", () => {
        type Item = { a: number; b: { c: Item } };

        expectTypeOf<Path<Item>>().toEqualTypeOf<"a" | "b" | "b.c">();
      });

      it("should get path from simplify nested object", () => {
        type Item = { a: number; b: { a: number; b: Item } };

        expectTypeOf<Path<Item>>().toEqualTypeOf<"a" | "b">();
      });
    });

    describe("Of<T, R>", () => {
      it("should list all number paths in an object", () => {
        expectTypeOf<PathOf<Item, number>>().toEqualTypeOf<"b" | "a.b.c">();
      });

      it("should list all object paths in an object", () => {
        expectTypeOf<PathOf<Item, { c: number }>>().toEqualTypeOf<"a.b">();
      });

      it("should list all number paths in an array", () => {
        expectTypeOf<PathOf<Array, number>>().toEqualTypeOf<`${number}.b` | `${number}.a.b.c`>();
      });

      it("should list all object paths in an array", () => {
        expectTypeOf<PathOf<Array, { c: number }>>().toEqualTypeOf<`${number}.a.b`>();
      });

      it("should list all number paths in a tuple", () => {
        expectTypeOf<PathOf<Tuple, number>>().toEqualTypeOf<"1.0.b" | "1.0.a.b.c" | "1.1.b" | "1.1.a.b.c">();
      });

      it("should list all object paths in a tuple", () => {
        expectTypeOf<PathOf<Tuple, { c: number }>>().toEqualTypeOf<"1.0.a.b" | "1.1.a.b">();
      });
    });

    describe("At<T, P>", () => {
      it("should get type of value at path in object", () => {
        expectTypeOf<PathAt<Item, "a.b.c">>().toEqualTypeOf<number>();
        expectTypeOf<PathAt<Item, "a.b">>().toEqualTypeOf<{ c: number }>();
      });

      it("should get type of value at path in array", () => {
        expectTypeOf<PathAt<Array, `${number}.b` | `${number}.a.b.c`>>().toEqualTypeOf<number>();
      });

      it("should get type of value at path in tuple", () => {
        expectTypeOf<PathAt<Tuple, "0">>().toEqualTypeOf<string>();
        expectTypeOf<PathAt<Tuple, "1.0" | "1.1">>().toEqualTypeOf<Item>();
      });

      it("should get type of an optional value at path in object", () => {
        expectTypeOf<PathAt<DeepPartial<Item>, "a.b.c" | "b">>().toEqualTypeOf<number | undefined>();
      });
    });

    describe("deep multi-branch nested shape", () => {
      interface Contact {
        email: string;
        slack?: string;
        org: MegaOrg;
      }

      interface Lead {
        id: number;
        contact: Contact;
      }

      interface EngDept {
        name: "eng";
        lead: Lead;
      }

      interface SalesDept {
        name: "sales";
        quota: { q1: number; q2: number; carry: { from: string; amount: number } };
      }

      interface Prefs {
        theme: "light" | "dark";
        notify: { email: boolean; push: boolean };
      }

      interface Profile {
        displayName: string;
        prefs: Prefs;
      }

      interface UserNode {
        profile: Profile;
        lastSeen: string;
        reputation: number;
      }

      interface MegaOrg {
        id: string;
        meta: {
          region: string;
          scoring: { internal: number; external: { vendor: string; score: number } };
        };
        departments: [EngDept, SalesDept];
        roster: UserNode[];
        orphans: {
          misc: [string, { nested: { token: symbol; ok: true } }];
        };
      }

      it("accepts known deep paths as Path<MegaOrg>", () => {
        attest("id" satisfies Path<MegaOrg>);
        attest("meta.region" satisfies Path<MegaOrg>);
        attest("meta.scoring.internal" satisfies Path<MegaOrg>);
        attest("meta.scoring.external.vendor" satisfies Path<MegaOrg>);
        attest("meta.scoring.external.score" satisfies Path<MegaOrg>);
        attest("departments" satisfies Path<MegaOrg>);
        attest("departments.0" satisfies Path<MegaOrg>);
        attest("departments.0.lead" satisfies Path<MegaOrg>);
        attest("departments.0.lead.contact" satisfies Path<MegaOrg>);
        attest("departments.0.lead.contact.email" satisfies Path<MegaOrg>);
        attest("departments.0.lead.id" satisfies Path<MegaOrg>);
        attest("departments.1.quota.q1" satisfies Path<MegaOrg>);
        attest("departments.1.quota.carry.amount" satisfies Path<MegaOrg>);
        attest("roster" satisfies Path<MegaOrg>);
        attest("roster.0.profile.prefs.theme" satisfies Path<MegaOrg>);
        attest("orphans.misc.1.nested.token" satisfies Path<MegaOrg>);
      });

      it("resolves PathAt for deep leaves", () => {
        attest(42 satisfies PathAt<MegaOrg, "meta.scoring.external.score">);
        attest("x" satisfies PathAt<MegaOrg, "departments.0.lead.contact.email">);
        attest("x" satisfies PathAt<MegaOrg, "departments.1.quota.carry.from">);
        attest(true satisfies PathAt<MegaOrg, "orphans.misc.1.nested.ok">);
        attest("x" satisfies PathAt<MegaOrg, "roster.0.profile.displayName">);
      });

      it("PathOf finds expected leaves", () => {
        attest("meta.scoring.internal" satisfies PathOf<MegaOrg, number>);
        attest("meta.scoring.external.score" satisfies PathOf<MegaOrg, number>);
        attest("departments.0.lead.id" satisfies PathOf<MegaOrg, number>);
        attest("departments.1.quota.q1" satisfies PathOf<MegaOrg, number>);
        attest("departments.1.quota.carry.amount" satisfies PathOf<MegaOrg, number>);
        attest("roster.0.reputation" satisfies PathOf<MegaOrg, number>);

        attest("orphans.misc.1.nested.ok" satisfies PathOf<MegaOrg, true>);
      });

      it("get/set round-trip deep paths", () => {
        const contact: Contact = { email: "lead@x.test", slack: "@lead", org: {} as MegaOrg };
        const mega: MegaOrg = {
          id: "org-1",
          meta: {
            region: "eu",
            scoring: { internal: 1, external: { vendor: "acme", score: 42 } },
          },
          departments: [
            { name: "eng", lead: { id: 9, contact } },
            { name: "sales", quota: { q1: 10, q2: 20, carry: { from: "fy23", amount: 5 } } },
          ],
          roster: [
            {
              lastSeen: "today",
              reputation: 100,
              profile: {
                displayName: "A",
                prefs: { theme: "dark", notify: { email: true, push: false } },
              },
            },
          ],
          orphans: { misc: ["x", { nested: { token: Symbol("t"), ok: true as const } }] },
        };

        expect(get(mega, "meta.scoring.external.score")).toEqual(42);
        expect(get(mega, "departments.0.lead.contact.email")).toEqual("lead@x.test");
        expect(get(mega, "roster.0.profile.prefs.theme")).toEqual("dark");

        const editable: MegaOrg = {
          ...mega,
          meta: structuredClone(mega.meta),
          departments: structuredClone(mega.departments),
          roster: structuredClone(mega.roster),
          orphans: mega.orphans,
        };
        const next = set(editable, "departments.1.quota.carry.amount", 99);
        attest(next satisfies MegaOrg);
        expect(get(next, "departments.1.quota.carry.amount")).toEqual(99);
        expect(get(next, "departments.1.quota.carry.from")).toEqual("fy23");
        expect(get(next, "departments.1.quota.carry.amount")).toEqual(99);
        expect(get(next, "departments.1.quota.carry.amount")).toEqual(99);
      });
    });
  });

  describe("get", () => {
    it("should get value from object at path", () => {
      const value = get(item, "a.b.c");

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it("should get value from array at path", () => {
      const value = get(array, "0.a.b.c");

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it("should get value from tuple at path", () => {
      const value = get(tuple, "1.0.a.b.c");

      expectTypeOf(value).toEqualTypeOf<number>();
      expect(value).toEqual(1);
    });

    it("should get optional value from object at path", () => {
      const item: DeepPartial<Item> = {};

      const value = get(item, "a.b.c");

      expectTypeOf(value).toEqualTypeOf<number | undefined>();
      expect(value).toEqual(undefined);
    });
  });

  describe("set", () => {
    it("should set value from object at path", () => {
      const result = set(structuredClone(item), "a.b.c", 2);

      expectTypeOf(result).toEqualTypeOf<Item>();
      expect(result).toEqual({ a: { b: { c: 2 } }, b: 2 });
    });

    it("should set value from array at path", () => {
      const result = set(structuredClone(array), "0.a.b.c", 2);

      expectTypeOf(result).toEqualTypeOf<Array>();
      expect(result).toEqual([{ a: { b: { c: 2 } }, b: 2 }, item]);
    });

    it("should set value from tuple at path", () => {
      const result = set(structuredClone(tuple), "1.0.a.b.c", 2);

      expectTypeOf(result).toEqualTypeOf<Tuple>();
      expect(result).toEqual(["a", [{ a: { b: { c: 2 } }, b: 2 }, item]]);
    });

    it("should set optional value from object at path", () => {
      const item: DeepPartial<Item> = {};

      const result = set(structuredClone(item), "a.b.c", 2);

      expectTypeOf(result).toEqualTypeOf<DeepPartial<Item>>();
      expect(result).toEqual({ a: { b: { c: 2 } } });
    });
  });

  describe("error handling", () => {
    it("should return undefined for access errors", () => {
      const item: DeepPartial<Item> = {};

      const value = get(item, "a.b.c");

      expectTypeOf(value).toEqualTypeOf<number | undefined>();
      expect(value).toEqual(undefined);
    });

    it("should throw for other errors", () => {
      const item = {
        a: {
          get b(): number {
            throw new Error("test");
          },
        },
      } as const;

      expect(() => {
        const value = get(item, "a.b");

        expectTypeOf(value).toEqualTypeOf<number>();
      }).toThrow("test");
    });
  });
});
