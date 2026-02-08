interface User {
  role: string
}

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log('Running admin pages middleware for route:', to.path)

    
      if (import.meta.client) {
        console.log('This middleware is running on the client, skipping auth checks.')
    return
  }
      const userCookie = useCookie('AccessToken')
    if (!userCookie.value) {
        console.log('No cookie found for admin, redirecting to login.')
        return navigateTo('/auth/login')
    }

    const headers = useRequestHeaders(['cookie'])

    const user = await $fetch<User>('/api/users/me', {
      method: 'GET',
      credentials: 'include',
      headers: headers
    }).catch(() => null)

  if (!user) {
    console.log('Invalid token for admin, redirecting to login.')
    return navigateTo('/auth/login')
  }

  if (user.role !== 'admin') {
    console.log('User is not admin, redirecting to home.')
    return navigateTo('/')
  }
})
