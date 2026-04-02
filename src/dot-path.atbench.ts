import { bench } from "@ark/attest";

// baseline expression

bench("single-quoted", () => {
  const _ = "abc";
  // would be 2697 without baseline
}).types([610, "instantiations"]);

bench("keyword", () => {
  const _ = "bcd";
  // would be 2507 without baseline
}).types([356, "instantiations"]);
