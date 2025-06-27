import { ContactType } from "./contactTypes";

export type Base64StringType = string;

export type MessageSessionMapType = Map<
  string,
  {
    contact: ContactType | null;
    messages: MessageType[];
    AESKey: ArrayBuffer | null;
  }
>;

export type MessageSessionType = {
  number: string;
  messages: MessageType[];
  contact: ContactType | null;
  AESKey: ArrayBuffer;
  receiversRSAPublicKey: ArrayBuffer | null;
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
  message: Base64StringType;
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
  iv: Base64StringType;
  encryptedAESKey: Base64StringType;
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
