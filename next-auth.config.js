const nextAuthConfig = {
  providers: [
    {
      id: "google",
      name: "Google",
      type: "oauth",
      version: "2.0",
      scope: "openid profile email",
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
      authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
      profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
  ],
};

export { nextAuthConfig as default };
