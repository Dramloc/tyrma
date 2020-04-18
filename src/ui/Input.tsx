import styled from "./styled";

export const FormInput = styled("input")(({ theme }) => ({
  appearance: "none",
  paddingTop: theme.spacing[2],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[3],

  backgroundColor: theme.colors.white,
  borderWidth: theme.borderWidth.default,
  borderStyle: "solid",
  borderColor: theme.colors.gray[300],
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.boxShadow.sm,

  fontSize: theme.fontSize.base,
  lineHeight: theme.lineHeight.normal,

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&::placeholder": {
    color: theme.colors.gray[400],
  },

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight[5],
  },
}));

export const FormTextarea = styled("textarea")(({ theme }) => ({
  appearance: "none",
  paddingTop: theme.spacing[2],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[3],

  backgroundColor: theme.colors.white,
  borderColor: theme.colors.gray[300],
  borderWidth: theme.borderWidth.default,
  borderStyle: "solid",
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.boxShadow.sm,

  fontSize: theme.fontSize.base,
  lineHeight: theme.lineHeight.normal,

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&::placeholder": {
    color: theme.colors.gray[400],
    opacity: 1,
  },

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight[5],
  },
}));

export const FormMultiselect = styled("select")(({ theme }) => ({
  appearance: "none",
  paddingTop: theme.spacing[2],
  paddingRight: theme.spacing[3],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[3],

  backgroundColor: theme.colors.white,
  borderColor: theme.colors.gray[300],
  borderWidth: theme.borderWidth.default,
  borderStyle: "solid",
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.boxShadow.sm,

  fontSize: theme.fontSize.base,
  lineHeight: theme.lineHeight.normal,

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight[5],
  },
}));
FormMultiselect.defaultProps = {
  multiple: true,
};

export const FormSelect = styled("select")(({ theme }) => ({
  appearance: "none",
  colorAdjust: "exact",
  "&::-ms-expand": {
    border: "none",
    "@media not print": {
      display: "none",
    },
  },

  paddingTop: theme.spacing[2],
  paddingRight: theme.spacing[10],
  paddingBottom: theme.spacing[2],
  paddingLeft: theme.spacing[3],

  backgroundColor: theme.colors.white,
  backgroundRepeat: "no-repeat",
  backgroundPosition: `right ${theme.spacing[2]} center`,
  backgroundSize: `1.5em 1.5em`,
  backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none"><path d="M7 7l3-3 3 3m0 6l-3 3-3-3" stroke="${theme.colors.gray[400]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  )}')`,
  borderColor: theme.colors.gray[300],
  borderWidth: theme.borderWidth.default,
  borderStyle: "solid",
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.boxShadow.sm,

  fontSize: theme.fontSize.base,
  lineHeight: theme.lineHeight.normal,

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    fontSize: theme.fontSize.sm,
    lineHeight: theme.lineHeight[5],
  },
}));

export const FormCheckbox = styled("input")(({ theme }) => ({
  appearance: "none",
  colorAdjust: "exact",
  "&::-ms-check": {
    "@media not print": {
      color: "transparent",
      background: "inherit",
      borderColor: "inherit",
      borderRadius: "inherit",
    },
  },
  display: "inline-block",
  verticalAlign: "middle",
  backgroundOrigin: "border-box",
  userSelect: "none",
  flexShrink: 0,
  height: theme.spacing[4],
  width: theme.spacing[4],

  backgroundColor: theme.colors.white,
  borderColor: theme.colors.gray[300],
  borderStyle: "solid",
  borderWidth: theme.borderWidth.default,
  borderRadius: theme.borderRadius.default,
  boxShadow: theme.boxShadow.sm,

  color: theme.colors.blue[500],

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  "&:checked": {
    backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(
      `<svg viewBox="0 0 16 16" fill="${theme.colors.white}" xmlns="http://www.w3.org/2000/svg"><path d="M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z"/></svg>`
    )}')`,
    borderColor: "transparent",
    backgroundColor: "currentColor",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  "&:checked:focus": {
    borderColor: "transparent",
  },
}));
FormCheckbox.defaultProps = {
  type: "checkbox",
};

export const FormRadio = styled("input")(({ theme }) => ({
  appearance: "none",
  colorAdjust: "exact",
  "&::-ms-check": {
    "@media not print": {
      color: "transparent",
      background: "inherit",
      borderColor: "inherit",
      borderRadius: "inherit",
    },
  },
  display: "inline-block",
  verticalAlign: "middle",
  userSelect: "none",
  flexShrink: 0,
  borderRadius: "100%",
  height: theme.spacing[4],
  width: theme.spacing[4],

  backgroundOrigin: "border-box",
  backgroundColor: theme.colors.white,
  borderColor: theme.colors.gray[300],
  borderStyle: "solid",
  borderWidth: theme.borderWidth.default,
  boxShadow: theme.boxShadow.sm,

  color: theme.colors.blue[500],

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue[300],
  },

  "&:checked": {
    backgroundImage: `url('data:image/svg+xml,${encodeURIComponent(
      `<svg viewBox="0 0 16 16" fill="${theme.colors.white}" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="3"/></svg>`
    )}')`,
    borderColor: "transparent",
    backgroundColor: "currentColor",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  "&:checked:focus": {
    borderColor: "transparent",
  },
}));
FormRadio.defaultProps = {
  type: "radio",
};
