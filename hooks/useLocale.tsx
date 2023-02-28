import { useRouter } from "next/router";
import en from "../libs/locales/en";
import ja from "../libs/locales/ja";

export const useLocale = () => {
  const { locale } = useRouter();
  const t = locale === "en" ? en : ja;
  return { locale, t };
};
