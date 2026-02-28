export const validateCredentials = (username: unknown, password: unknown) => {
  if (typeof username !== 'string' || typeof password !== 'string') return 'Missing username or password'
  if (!username || !password) return 'Missing username or password'
  if (username.length > 25) return 'Username must be at most 25 characters'
  if (!/^[a-z0-9_]+$/.test(username)) return 'Username can only contain lowercase letters, numbers and _'
  if (password.length < 8) return 'Password must be at least 8 characters'
  if (password.length > 25) return 'Password must be at most 25 characters'
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return 'Password must contain letters and numbers'
  return ''
}