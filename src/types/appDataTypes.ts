export type AppSettingsType = {
  initialized: boolean;
  authToken: string;
  locked: boolean;
  passwordType: string;
  showOnline: boolean;
  webPushSubscription: {
    subscription: null | PushSubscription;
    subscribed: boolean;
  };
};

export type ThemeType = {
  darkMode: boolean;
  accent: string;
  background: string;
  animations: {
    speed: number;
    spring: boolean;
  };
};

export type UserType = {
  userId: string;
  authToken: string;
  username: string;
  email: string;
  phoneNumber: string;
  RSAKeyPair: {
    private: ArrayBuffer;
    public: ArrayBuffer;
    expiresAt: Date;
  };
};
