const fontWidthList = [];

const isFontWeightAvailableFunc = (fontName, fontWeight) => {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const baseFont = "sans-serif";
    const testString = "abcdefghi0123456789";

    context.font = `${fontWeight} 40px ${baseFont}`;

    const baseWidth = context.measureText(testString).width;

    context.font = `${fontWeight} 40px ${fontName}, ${baseFont}`;
    const testWidth = context.measureText(testString).width;

    console.log(fontName, fontWeight, baseWidth, testWidth);

    if (fontWidthList.includes(testWidth)) {
      return false;
    }
    fontWidthList.push(testWidth);

    return testWidth !== baseWidth;
  } catch (error) {
    console.log(error);
  }
};

export const isFontWeightAvailable = (fontName, fontWeight) => {
  return !fontWeight
    .map((item) => isFontWeightAvailableFunc(fontName, item))
    .includes(false);
};

export const isChromeBrowser = () => {
  const userAgent = navigator.userAgent;
  return (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  );
};
