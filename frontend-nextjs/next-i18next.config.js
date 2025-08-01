module.exports = {
  i18n: {
    defaultLocale: "vi",
    locales: ["vi", "en", "ja", "ko", "zh"],
    localeDetection: false,
  },
  react: {
    useSuspense: false,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
