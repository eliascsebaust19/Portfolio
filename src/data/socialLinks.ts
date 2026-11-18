export interface SocialConfig {
  githubUsername: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  location: string;
  siteUrl: string;
}

export const socialLinks: SocialConfig = {
  githubUsername:
    import.meta.env.VITE_GITHUB_USERNAME || "eliascsebaust19",
  githubUrl: `https://github.com/${
    import.meta.env.VITE_GITHUB_USERNAME || "eliascsebaust19"
  }`,
  linkedinUrl:
    import.meta.env.VITE_LINKEDIN_URL ||
    "https://www.linkedin.com/in/md-elias-ahmad-a66825323/",
  email: import.meta.env.VITE_CONTACT_EMAIL || "eliascse19@gmail.com",
  location: "Bangladesh",
  siteUrl: import.meta.env.VITE_SITE_URL || "https://eliasahmad.dev",
};
