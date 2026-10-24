import { calculateNewValues } from "../src/mainState/calculateNewValues";
import { maximumIcons } from "../src/mainState/maximumIcons";
import { parseQrCodeString } from "../src/scannerScreen/parseQrCodeString";

const initial = { flames: 0, hearts: 0, percentage: 20 };

const applyCode = (code: string, values = initial) => {
  const parsed = parseQrCodeString(code);
  if (parsed === undefined) {
    throw new Error(`Test code was unexpectedly rejected: ${code}`);
  }
  return calculateNewValues(values, parsed);
};

describe("printed Skoleglæde codes and existing rules", () => {
  test.each([0, 5, 10, 15, 20, 25, 30, 40, 50, 100, 999])(
    "accepts both signs for %i percentage points without a whitelist",
    amount => {
      const digits = amount.toString().padStart(3, "0");
      expect(parseQrCodeString(`+${digits}pp`)).toEqual({
        amount: amount,
        type: "percentage",
      });
      expect(parseQrCodeString(`-${digits}pp`)).toEqual({
        amount: -amount,
        type: "percentage",
      });
    },
  );

  test.each(["heart", "flame"])("accepts both signs for %s", type => {
    expect(parseQrCodeString(`+${type}`)).toEqual({ amount: 1, type: type });
    expect(parseQrCodeString(`-${type}`)).toEqual({ amount: -1, type: type });
  });

  test.each([
    undefined,
    "",
    "https://skoleglaede.nu",
    "+smiley",
    "+20pp",
    "+1000pp",
    "20pp",
  ])("rejects unrelated or malformed input %s", input =>
    expect(parseQrCodeString(input)).toBeUndefined(),
  );

  test("100 percent does not award a heart", () => {
    expect(applyCode("+020pp", { ...initial, percentage: 80 })).toEqual({
      newFlames: 0,
      newHearts: 0,
      newPercentage: 100,
    });
  });

  test("crossing 100 awards one heart and preserves overflow", () => {
    expect(applyCode("+025pp", { ...initial, percentage: 80 })).toEqual({
      newFlames: 0,
      newHearts: 1,
      newPercentage: 5,
    });
  });

  test("large accepted codes preserve the existing single-heart calculation", () => {
    expect(applyCode("+999pp")).toEqual({
      newFlames: 0,
      newHearts: 1,
      newPercentage: 919,
    });
  });

  test("battery loss stops at zero and preserves earned hearts", () => {
    expect(
      applyCode("-020pp", { ...initial, hearts: 1, percentage: 10 }),
    ).toEqual({
      newFlames: 0,
      newHearts: 1,
      newPercentage: 0,
    });
  });

  test("full heart row caps overflow at 100 percent", () => {
    expect(
      applyCode("+050pp", { ...initial, hearts: maximumIcons, percentage: 80 }),
    ).toEqual({
      newFlames: 0,
      newHearts: maximumIcons,
      newPercentage: 100,
    });
  });

  test.each(["heart", "flame"])(
    "symbol changes stay within the existing limits: %s",
    type => {
      const emptyResult = applyCode(`-${type}`);
      expect(emptyResult.newHearts).toBe(0);
      expect(emptyResult.newFlames).toBe(0);
      const fullResult = applyCode(`+${type}`, {
        ...initial,
        hearts: maximumIcons,
        flames: maximumIcons,
      });
      expect(fullResult.newHearts).toBe(maximumIcons);
      expect(fullResult.newFlames).toBe(maximumIcons);
    },
  );
});
