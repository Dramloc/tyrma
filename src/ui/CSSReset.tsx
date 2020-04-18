import { css, Global } from "@emotion/core";
import { useTheme } from "emotion-theming";
import React from "react";
import { Theme } from "./theme";

export const CSSReset = () => {
  const theme = useTheme<Theme>();
  return (
    <Global
      styles={css({
        html: {
          lineHeight: theme.lineHeight.normal,
          WebkitTextSizeAdjust: "100%",
        },
        body: {
          margin: 0,
          fontFamily: theme.fontFamily.sans,
          WebkitFontSmoothing: "antialised",
          MozOsxFontSmoothing: "grayscale",
          color: theme.colors.gray[900],
        },
        "*, *::after, *::before": {
          boxSizing: "border-box",
        },
        "button, input, optgroup, select, textarea": {
          fontFamily: "inherit",
          fontSize: "100%",
          lineHeight: "inherit",
          margin: 0,
          padding: 0,
          color: "inherit",
        },
        "button, input": {
          overflow: "visible",
        },
        "button, select": {
          textTransform: "none",
        },
        button: {
          backgroundColor: "transparent",
          backgroundImage: "none",
          padding: 0,
        },
        "[role=button], button": {
          cursor: "pointer",
        },
        "[type=button], [type=reset], [type=submit], button": {
          WebkitAppearance: "button",
        },
      })}
    />
  );
};
