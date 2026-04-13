const { pickCompliment, LS_SEEN, LS_DATE, LS_CURRENT } = require("./pick");

function makeStorage(initial = {}) {
  const store = { ...initial };
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = value; },
    _store: store,
  };
}

const COMPLIMENTS = ["A", "B", "C"];

describe("same-day caching", () => {
  test("returns the same compliment when called twice on the same day", () => {
    const storage = makeStorage();
    const first = pickCompliment(COMPLIMENTS, storage, "2026-01-01");
    const second = pickCompliment(COMPLIMENTS, storage, "2026-01-01");
    expect(second).toEqual(first);
  });
});

describe("daily progression", () => {
  test("advances to the next unseen compliment each day", () => {
    const storage = makeStorage();
    const r1 = pickCompliment(COMPLIMENTS, storage, "2026-01-01");
    const r2 = pickCompliment(COMPLIMENTS, storage, "2026-01-02");
    const r3 = pickCompliment(COMPLIMENTS, storage, "2026-01-03");

    expect(r1.text).toBe("A");
    expect(r2.text).toBe("B");
    expect(r3.text).toBe("C");
  });

  test("never repeats a compliment before all have been shown", () => {
    const storage = makeStorage();
    const shown = new Set();
    for (let i = 0; i < COMPLIMENTS.length; i++) {
      const { text } = pickCompliment(COMPLIMENTS, storage, `2026-01-0${i + 1}`);
      expect(shown.has(text)).toBe(false);
      shown.add(text);
    }
  });
});

describe("cycling after exhaustion", () => {
  test("cycles back to the first compliment after all have been shown", () => {
    const storage = makeStorage();
    pickCompliment(COMPLIMENTS, storage, "2026-01-01"); // A
    pickCompliment(COMPLIMENTS, storage, "2026-01-02"); // B
    pickCompliment(COMPLIMENTS, storage, "2026-01-03"); // C
    const { text } = pickCompliment(COMPLIMENTS, storage, "2026-01-04");
    expect(text).toBe("A");
  });
});

describe("new compliments added to the list", () => {
  test("shows new additions before cycling through old ones", () => {
    const storage = makeStorage();
    // Exhaust the original list
    pickCompliment(COMPLIMENTS, storage, "2026-01-01"); // A
    pickCompliment(COMPLIMENTS, storage, "2026-01-02"); // B
    pickCompliment(COMPLIMENTS, storage, "2026-01-03"); // C

    // Developer pushes two new compliments
    const expanded = [...COMPLIMENTS, "D", "E"];

    // Next day — should prioritize the new ones
    const r4 = pickCompliment(expanded, storage, "2026-01-04");
    expect(r4.text).toBe("D");

    const r5 = pickCompliment(expanded, storage, "2026-01-05");
    expect(r5.text).toBe("E");

    // Then cycles through the old ones
    const r6 = pickCompliment(expanded, storage, "2026-01-06");
    expect(r6.text).toBe("A");
  });

  test("shows new additions added mid-cycle before remaining unseen originals", () => {
    const storage = makeStorage();
    // Show only the first compliment
    pickCompliment(COMPLIMENTS, storage, "2026-01-01"); // A seen

    // Developer adds "D" — it should be found as unseen right away
    const expanded = [...COMPLIMENTS, "D"];

    const r2 = pickCompliment(expanded, storage, "2026-01-02");
    // "B" is next unseen original; "D" is also unseen — but B comes first (lower index)
    expect(r2.text).toBe("B");

    // Skip to after B and C are shown
    pickCompliment(expanded, storage, "2026-01-03"); // C
    const r4 = pickCompliment(expanded, storage, "2026-01-04");
    expect(r4.text).toBe("D");
  });
});

describe("corrupt / missing storage", () => {
  test("recovers gracefully from malformed seen data", () => {
    const storage = makeStorage({ [LS_SEEN]: "not-json{{" });
    expect(() => pickCompliment(COMPLIMENTS, storage, "2026-01-01")).not.toThrow();
  });

  test("starts from the beginning when storage is empty", () => {
    const storage = makeStorage();
    const { text } = pickCompliment(COMPLIMENTS, storage, "2026-01-01");
    expect(text).toBe("A");
  });
});
