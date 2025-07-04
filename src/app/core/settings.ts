export interface AppSettings {
  navPos?: 'side' | 'top';
  theme?: 'light' | 'dark';
  dir?: 'ltr' | 'rtl';
  showHeader?: boolean;
  headerPos?: 'fixed' | 'static' | 'above';
  showUserPanel?: boolean;
  sidenavOpened?: boolean;
  sidenavCollapsed?: boolean;
  language?: string;
}

export const defaults: AppSettings = {
  navPos: 'side',
  theme: 'dark',
  dir: 'ltr',
  showHeader: true,
  headerPos: 'fixed',
  showUserPanel: false,
  sidenavOpened: false,
  sidenavCollapsed: true,
  language: 'en-US',
};
