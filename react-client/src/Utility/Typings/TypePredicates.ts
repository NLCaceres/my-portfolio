/** Centralizes common type predicates into a convenient spot for easy type narrowing when needed */

export function IsString(value: unknown): value is string {
  return typeof value === "string" || value instanceof String;
}

//* Narrows a value to a plain Typescript object, i.e. an object with string keys and some unknown values (like a Record<K,V>)
//* HOWEVER, it requires further narrowing to actually be useful (since Typescript's object type doesn't allow property access)
//* SO, it's true purpose is as a catch-all for funcs like `json()` that return `any` or `unknown` where the expected true type of the
//* the returned value is NOT your typical JS primitive, class or func BUT some JS object we can narrow into our own type later
export function IsPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype || value.constructor === Object;
}