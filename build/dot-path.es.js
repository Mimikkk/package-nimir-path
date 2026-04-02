//#region src/dot-path.ts
function e(e, t) {
	return t.split(".").reduce((e, t) => e?.[t], e);
}
function t(e, t, n) {
	let r = t.split("."), i = e;
	for (let e = 0, t = r.length - 1; e < t; ++e) {
		let t = r[e];
		t in i || (i[t] = {}), i = i[t];
	}
	return i[r[r.length - 1]] = n, e;
}
//#endregion
export { e as get, t as set };
