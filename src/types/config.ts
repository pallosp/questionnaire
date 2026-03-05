export interface Question {
  question: string;
  validation: string;
  'follow-up-options': string[];
}

export interface QuestionnaireConfig {
  id: string;
  color: string;
  'background-type': string;
  title: string;
  description: string;
  questions: Question[];
}

export interface HomepageConfig {
  title: string;
  description: string;
}

export interface FooterLink {
  name: string;
  url: string;
}

export interface FooterConfig {
  copyright: string;
  links: FooterLink[];
}

export interface ResultsConfig {
  title: string;
  description: string;
}

export interface QuestionnairePageConfig {
  'sup-title': string;
  description: string;
  results: ResultsConfig;
  // TODO: This should go to the root config
  footer: FooterConfig;
}

export interface Config {
  questionnaires: QuestionnaireConfig[];
  homepage: HomepageConfig;
  // TODO: Rename to 'questionnaire-page'
  questionnaire: QuestionnairePageConfig;
}
