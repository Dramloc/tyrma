import React from "react";

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

export type ConfigurationEditorProps<T> = {
  value: T;
  specification: Specification<T>;
  onChange: (configuration: T) => void;
};
export function ConfigurationEditor<T extends { [key: string]: any }>({
  value,
  specification,
  onChange,
}: ConfigurationEditorProps<T>) {
  return (
    <>
      {Object.entries<FieldSpecification<unknown>>(specification).map(([key, fieldSpecification]) => {
        if (isNumberFieldSpecification(fieldSpecification) || isTextFieldSpecification(fieldSpecification)) {
          return (
            <label key={key}>
              {key}
              <input
                {...fieldSpecification}
                value={value[key]}
                onChange={(e) => {
                  onChange({
                    ...value,
                    [key]: e.target.value,
                  });
                }}
              />
            </label>
          );
        }
        if (isObjectFieldSpecification(fieldSpecification)) {
          return (
            <fieldset key={key}>
              <legend>{key}</legend>
              <ConfigurationEditor
                value={value[key]}
                specification={fieldSpecification.type}
                onChange={(subConfiguration) => {
                  onChange({
                    ...value,
                    [key]: subConfiguration,
                  });
                }}
              />
            </fieldset>
          );
        }
        return null;
      })}
    </>
  );
}
