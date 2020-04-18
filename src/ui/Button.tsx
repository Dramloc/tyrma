import React, { ElementType, forwardRef } from "react";
import styled from "./styled";

const ButtonIcon = styled<"div", { as: ElementType }>("div")(({ theme }) => ({
  height: theme.spacing["5"],
  width: theme.spacing["5"],
}));

const ButtonLeftIcon = styled(ButtonIcon)(({ theme }) => ({
  marginLeft: `-${theme.spacing[1]}`,
  marginRight: theme.spacing[2],
}));

const ButtonRightIcon = styled(ButtonIcon)(({ theme }) => ({
  marginRight: `-${theme.spacing[1]}`,
  marginLeft: theme.spacing[2],
}));

const ButtonContainer = styled("button")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  paddingLeft: theme.spacing[4],
  paddingRight: theme.spacing[4],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
  borderWidth: theme.borderWidth.default,
  borderStyle: "solid",
  borderColor: theme.colors.gray[300],

  color: theme.colors.gray[700],
  fontSize: theme.fontSize.sm,
  lineHeight: theme.lineHeight[5],
  fontWeight: theme.fontWeight.medium,

  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.md,
  boxShadow: theme.boxShadow.sm,

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:hover": {
    color: theme.colors.gray["500"],
  },
  "&:focus": {
    outline: "none",
    boxShadow: `${theme.boxShadow.sm}, ${theme.boxShadow["outline-blue"]}`,
    borderColor: theme.colors.blue["300"],
  },
  "&:active": {
    color: theme.colors.gray["800"],
    backgroundColor: theme.colors.gray["50"],
  },
}));

type ButtonProps = {
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, leftIcon, rightIcon, ...props },
  ref
) {
  return (
    <ButtonContainer ref={ref} {...props}>
      {leftIcon && <ButtonLeftIcon as={leftIcon} />}
      {children}
      {rightIcon && <ButtonRightIcon as={rightIcon} />}
    </ButtonContainer>
  );
});
