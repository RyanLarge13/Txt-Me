export type ContactType = {
  contactid: string;
  name: string;
  email: string;
  number: string;
  createdat: Date;
  space: string;
  nickname: string;
  address: string;
  website: string;
  avatar: null | File;
  synced: boolean;
};

export type ContactSettingsType = {
  showImage: boolean;
  showLatestMessages: boolean;
  showHowMayUnreadMessages: boolean;
  sort: string;
  order: string;
};
