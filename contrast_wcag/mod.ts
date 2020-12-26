import * as colors from "https://deno.land/std/fmt/colors.ts";

interface RGB {
  r: number;
  g: number;
  b: number;
}

export const hex2rgb = (hex: string): RGB => {
  hex = hex.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => r + r + g + g + b + b,
  );

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
  "AA": {
    "normal": 4.5,
    "larger": 3,
  },
  // Enhanced
  "AAA": {
    "normal": 7,
    "larger": 4.5,
  },
};

export const testColors = (foreground: string[], background: string[]) => {
  for (const bg of background) {
    for (const fg of foreground) {
      const ratio = contrast(fg, bg);
      const test = Object.entries(rules).flatMap(([level, values]) =>
        Object.entries(values).map((
          [key, value],
        ) => (ratio > value ? colors.green("T") : colors.red("F")))
      );

      console.log(
        colors.bgRgb24(colors.rgb24(fg, hex2rgb(fg)), hex2rgb(bg)),
        ...test,
      );
    }
  }
};
