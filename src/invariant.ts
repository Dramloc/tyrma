export function invariant(condition: any, format?: string, ...args: any[]): asserts condition {
  if (process.env.NODE_ENV !== "production") {
    if (format === undefined) {
      throw new Error("invariant requires an error message argument");
    }
  }
  if (!condition) {
    if (format === undefined) {
      throw new Error(
        "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings."
      );
    } else {
      let argIndex = 0;
      const error = new Error(format.replace(/%s/g, () => args[argIndex++]));
      error.name = "Invariant Violation";
      throw error;
    }
  }
}
