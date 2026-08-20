import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerInvoiceFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Poppins",
    fonts: [
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Medium.ttf",
        fontWeight: 500,
      },
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-SemiBold.ttf",
        fontWeight: 600,
      },
      {
        src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
        fontWeight: 700,
      },
    ],
  });

  Font.register({
    family: "Noto Sans Tamil",
    fonts: [
      {
        src: "https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSansTamil-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "https://raw.githubusercontent.com/openmaptiles/fonts/master/noto-sans/NotoSansTamil-Bold.ttf",
        fontWeight: 700,
      },
    ],
  });

  // react-pdf only wraps text at spaces by default. A long value typed with
  // no spaces (e.g. a GSTIN, order number, or HSN code) has nowhere to
  // break, so it overflows straight past its box border instead of
  // wrapping. This callback leaves normal words untouched (<=14 chars) but
  // chops anything longer into 14-char chunks so it has break points and
  // wraps inside its cell like everything else.
  Font.registerHyphenationCallback((word) => {
    if (word.length <= 14) return [word];

    const chunks = [];
    for (let i = 0; i < word.length; i += 14) {
      chunks.push(word.slice(i, i + 14));
    }
    return chunks;
  });
}