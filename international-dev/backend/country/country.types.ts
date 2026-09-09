export type CountryCode =
  | "TR"
  | "DE"
  | "GB"
  | "NL"
  | "FR"
  | "BE"
  | "AT"
  | "CH"
  | "AZ"
  | "RU"
  | "UA";

export type SupportedUiLanguage = "TR" | "EN" | "RU" | "AR";

export type CountryName = {
  TR: string;
  EN: string;
  RU: string;
  AR: string;
};

export type Country = {
  code: CountryCode;
  name: CountryName;
  flag: string;
};