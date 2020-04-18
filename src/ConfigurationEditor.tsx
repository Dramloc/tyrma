import React, { Fragment } from "react";
import styled from "./ui/styled";

type TextFieldSpecification = {
  type: "text";
  default: string;
};

type NumberFieldSpecification = {
  type: "number";
  default: number;
  min?: number;
  max?: number;
  step?: number;
};

type ObjectFieldSpecification<T> = {
  type: Specification<T>;
};

type FieldSpecification<T> = T extends string
  ? TextFieldSpecification
  : T extends number
  ? NumberFieldSpecification
  : ObjectFieldSpecification<T>;

export type Specification<T extends { [key: string]: any }> = {
  [P in keyof T]: FieldSpecification<T[P]>;
};

function isTextFieldSpecification<T>(
  fieldSpecification: FieldSpecification<unknown>
): fieldSpecification is TextFieldSpecification {
  return fieldSpecification.type === "text";
}

function isNumberFieldSpecification<T>(
  fieldSpecification: FieldSpecification<unknown>
): fieldSpecification is TextFieldSpecification {
  return fieldSpecification.type === "number";
}

function isObjectFieldSpecification<T>(
  fieldSpecification: FieldSpecification<unknown>
): fieldSpecification is ObjectFieldSpecification<T> {
  return typeof fieldSpecification.type === "object";
}

function getDefaultFieldConfiguration<T>(fieldSpecification: FieldSpecification<T>) {
  if (isNumberFieldSpecification(fieldSpecification) || isTextFieldSpecification(fieldSpecification)) {
    return fieldSpecification.default;
  }
  if (isObjectFieldSpecification(fieldSpecification)) {
    const objectFieldSpecification = fieldSpecification.type as Specification<{ [key: string]: any }>;
    return getDefaultConfiguration(objectFieldSpecification);
  }
  return undefined;
}

export function getDefaultConfiguration<T>(specification: Specification<T>): T {
  return Object.fromEntries(
    Object.entries<FieldSpecification<unknown>>(specification)
      .map(([key, fieldSpecification]) => {
        return [key, getDefaultFieldConfiguration(fieldSpecification)];
      })
      .filter(Boolean)
  );
}

const EditorWrapper = styled.div(({ theme }) => ({
  position: "fixed",
  display: "none",
  right: 0,
  top: 0,
  height: "100%",
  width: 300,
  padding: theme.spacing[2],

  backgroundColor: "#2b2b45",
  boxShadow: theme.boxShadow.lg,

  fontFamily: theme.fontFamily.mono,
  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.loose,

  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    display: "block",
  },
}));

const TokenString = styled.span({
  color: "#9cdcfe",
});

const TokenPunctuation = styled.span({
  color: "#f8f8f2",
});

const Indented = styled.div(({ theme }) => ({
  paddingLeft: theme.spacing[4],
}));

const FieldWrapper = styled.label<{ as: React.ElementType }>(({ theme }) => ({
  display: "block",
  marginBottom: theme.spacing[1],
  "&:last-child": {
    marginBottom: 0,
  },
}));

const FieldInput = styled.input(({ theme }) => ({
  minWidth: "auto",
  width: "auto",
  paddingTop: theme.spacing[1],
  paddingRight: theme.spacing[2],
  paddingBottom: theme.spacing[1],
  paddingLeft: theme.spacing[2],

  backgroundColor: "rgba(0, 0, 0, 0.1)",
  border: "none",
  borderRadius: 5,

  fontSize: theme.fontSize.xs,
  lineHeight: theme.lineHeight.none,
  color: "#b5cea8",

  transitionProperty: theme.transitionProperty.default,
  transitionDuration: theme.transitionDuration[150],
  transitionTimingFunction: theme.transitionTimingFunction["in-out"],

  "&:hover": {
    backgroundColor: "rgba(0, 167, 255, 0.05)",
    boxShadow: "0 0 0 2px rgba(0, 167, 255, 0.15)",
  },
  "&:focus": {
    outline: "none",
    backgroundColor: "rgba(0, 167, 255, 0.1)",
    boxShadow: "0 0 0 2px rgba(0, 167, 255, 0.25)",
  },
}));

export type ConfigurationEditorProps<T> = {
  value: T;
  specification: Specification<T>;
  onChange: (configuration: T) => void;
  Wrapper?: React.FC<{}>;
};
export function ConfigurationEditor<T extends { [key: string]: any }>({
  value,
  specification,
  onChange,
  Wrapper = EditorWrapper,
}: ConfigurationEditorProps<T>) {
  return (
    <Wrapper>
      <TokenPunctuation>{`{`}</TokenPunctuation>
      <Indented>
        {Object.entries<FieldSpecification<unknown>>(specification).map(([key, fieldSpecification], index, entries) => {
          return (
            <FieldWrapper
              as={
                isNumberFieldSpecification(fieldSpecification) || isTextFieldSpecification(fieldSpecification)
                  ? "label"
                  : "span"
              }
              key={key}
            >
              <TokenString>{`"${key}"`}</TokenString>
              <TokenPunctuation>{`: `}</TokenPunctuation>
              <>
                {(isNumberFieldSpecification(fieldSpecification) || isTextFieldSpecification(fieldSpecification)) && (
                  <FieldInput
                    {...fieldSpecification}
                    value={value[key]}
                    onChange={(e) => {
                      onChange({
                        ...value,
                        [key]: e.target.value,
                      });
                    }}
                  />
                )}
                {isObjectFieldSpecification(fieldSpecification) && (
                  <ConfigurationEditor
                    value={value[key]}
                    specification={fieldSpecification.type}
                    onChange={(subConfiguration) => {
                      onChange({
                        ...value,
                        [key]: subConfiguration,
                      });
                    }}
                    Wrapper={Fragment}
                  />
                )}
              </>
              {index < entries.length - 1 && <TokenPunctuation>{`, `}</TokenPunctuation>}
            </FieldWrapper>
          );
        })}
      </Indented>
      <TokenPunctuation>{`}`}</TokenPunctuation>
    </Wrapper>
  );
}
