import { ContactType } from "./contactTypes";

export type MessageSessionMapType = Map<
  string,
  {
    contact: ContactType | null;
    messages: MessageType[];
    AESKey: null | CryptoKey;
  }
>;

export type MessageSessionType = {
  number: string;
  messages: MessageType[];
  contact: ContactType | null;
  AESKey: CryptoKey | null;
  receiversRSAPublicKey: CryptoKey | null;
};

export type MessageSettingsType = {
  showImg: boolean;
  showLatestMessage: boolean;
  showTimeOfLatestMessage: boolean;
  showHowManyUnread: boolean;
  sort: string;
  order: string;
  showYouAreTyping: boolean;
  showYouHaveRead: boolean;
};

export type MessageType = {
  messageid: string;
  message: string;
  sent: boolean;
  sentat: Date;
  delivered: boolean;
  deliveredat: Date | null;
  read: boolean;
  readat: Date | null;
  fromnumber: string;
  toname?: string;
  tonumber: string;
  error: boolean;
  synced: boolean;
};

export type SocketMessageType = {
  messageid: string;
  message: ArrayBuffer;
  sent: boolean;
  sentat: Date;
  delivered: boolean;
  deliveredat: Date | null;
  read: boolean;
  readat: Date | null;
  fromnumber: string;
  tonumber: string;
  error: boolean;
  synced: boolean;
  iv: BufferSource;
  encryptedAESKey: ArrayBuffer;
  toname?: string;
};

export type MessageUpdateType = {
  id: string;
  sessionNumber: string;
  delivered: boolean;
  time: Date;
};

export type MessageDeliveryErrorType = {
  messageid: string;
  reason: string;
  sessionNumber: string;
};
