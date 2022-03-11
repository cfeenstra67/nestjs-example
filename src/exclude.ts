
// Exclude the given fields from the model
export function exclude<A, Key extends keyof A>(
  user: A,
  ...keys: Key[]
): Omit<A, Key> {
  for (let key of keys) {
    delete user[key]
  }
  return user
}

export default exclude;
