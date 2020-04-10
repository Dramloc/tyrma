import React, { Fragment } from "react";
import styled from "@emotion/styled";

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

const EditorWrapper = styled.div({
  display: "inline-block",
  fontFamily: ["Lucida Console", "Monaco", "monospace"].join(","),
  fontSize: "0.75rem",
  lineHeight: 2,
  backgroundColor: "#1e1e1e",
  borderRadius: 5,
  padding: "0.5rem",
});

const TokenString = styled.span({
  color: "#9cdcfe",
});

const TokenPunctuation = styled.span({
  color: "#f8f8f2",
});

const Indented = styled.div({
  paddingLeft: "1rem",
});

const FieldWrapper = styled.label<{ as: React.ElementType }>({
  display: "block",
});

const FieldInput = styled.input({
  color: "#b5cea8",
  background: "rgba(0,0,0,0.1)",
  padding: "0.25rem 0.5rem",
  border: 0,
  fontFamily: "inherit",
  fontSize: "inherit",
  borderRadius: 5,
  minWidth: "auto",
  width: "auto",
});

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
