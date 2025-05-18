export function getGoogleAuthUrl() {
    // Redirect to your backend endpoint, which handles the OAuth flow
    return `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
}
