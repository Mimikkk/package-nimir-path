import { get, set, type Path, type PathAt } from "@nimir/dot-path";
import { describe, expect, it } from "vitest";

describe("@nimir/dot-path - package", () => {
  it("get retrieves nested values", () => {
    const item = { a: { b: { c: 42 } }, x: "hello" };
    const value = get(item, "a.b.c");

    expect(value).toBe(42);
  });

  it("get retrieves top-level values", () => {
    const item = { a: { b: { c: 42 } }, x: "hello" };
    const value = get(item, "x");

    expect(value).toBe("hello");
  });

  it("set updates existing nested values", () => {
    const item = { a: { b: { c: 42 } }, x: "hello" };
    const updated = set(item, "a.b.c", 100);

    expect(get(updated, "a.b.c")).toBe(100);
    expect(updated).toBe(item); // mutates in place
  });

  it("set creates new nested paths", () => {
    const empty = {} as any;
    set(empty, "x.y.z", "created");

    expect(get(empty, "x.y.z")).toBe("created");
  });

  it("type exports are accessible", () => {
    const item = { a: { b: { c: 42 } }, x: "hello" } as const;

    type itPath = Path<typeof item>;
    type itValue = PathAt<typeof item, "a.b.c">;

    const path: itPath = "a.b.c";
    const value: itValue = 42;

    expect(path).toBe("a.b.c");
    expect(value).toBe(42);
  });
});
