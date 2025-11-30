function c(r, i) {
  try {
    const s = i.split(".");
    let e = r;
    for (let t = 0, n = s.length; t < n; ++t)
      e = e[s[t]];
    return e;
  } catch {
    return;
  }
}
function g(r, i, s) {
  const e = i.split(".");
  let t = r;
  for (let n = 0, o = e.length - 1; n < o; ++n) {
    const l = e[n];
    l in t || (t[l] = {}), t = t[l];
  }
  return t[e[e.length - 1]] = s, r;
}
export {
  c as get,
  g as set
};
