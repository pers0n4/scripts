import * as colors from "https://deno.land/std/fmt/colors.ts";
import { printf } from "https://deno.land/std/fmt/printf.ts";

interface RGB {
  r: number;
  g: number;
  b: number;
}

const rrggbb = (hex: string) =>
  hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => "#" + r + r + g + g + b + b,
  );

export const hex2rgb = (hex: string): RGB => {
  hex = rrggbb(hex);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error();

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

// LINK https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
//      https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_Colors_and_Luminance#Measuring_Relative_Luminance
export const luminance = ({ r, g, b }: RGB) => {
  const L = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return L[0] * 0.2126 + L[1] * 0.7152 + L[2] * 0.0722;
};

// LINK https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
//      https://developer.mozilla.org/en-US/docs/Web/Accessibility/Seizure_disorders#Reduce_contrast
export const contrast = (x: string, y: string) => {
  const xl = luminance(hex2rgb(x));
  const yl = luminance(hex2rgb(y));
  const L1 = Math.max(xl, yl);
  const L2 = Math.min(xl, yl);
  return (L1 + 0.05) / (L2 + 0.05);
};

// LINK https://www.w3.org/TR/WCAG21/#contrast-minimum
//      https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast
const rules = {
  // Minimum
  AA: {
    larger: 3,
    normal: 4.5,
  },
  // Enhanced
  AAA: {
    larger: 4.5,
    normal: 7,
  },
};

const colorText = (fg: string, bg: string) =>
  colors.bgRgb24(colors.rgb24(rrggbb(fg), hex2rgb(fg)), hex2rgb(bg));

const combination = (
  foreground: string[],
  background: string[],
): [string, number][][] =>
  foreground.map((fg) =>
    background.map((bg) => [colorText(fg, bg), contrast(fg, bg)])
  );

export const test = (foreground: string[], background: string[]) => {
  const rule = Object.values(rules).flatMap((o) => Object.values(o));
  for (const row of combination(foreground, background)) {
    const col = row.map((
      [text, ratio],
    ) => [
      text,
      rule.map((r) => ratio > r ? colors.cyan("T") : colors.red("F")),
    ]);

    for (const [text, result] of col) {
      printf("%s %s %s %s %s ", text, ...result);
    }
    printf("\n");
  }
};
