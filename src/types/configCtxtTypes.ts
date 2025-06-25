/*
Txt Me - A web based messaging platform
Copyright (C) 2025 Ryan Large

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

export type AppData = {
  initialized: boolean;
  locked: boolean;
  passwordType: string;
  authToken: string;
  showOnline: boolean;
  webPushSubscription: {
    subscription: null | PushSubscription;
    subscribed: boolean;
  };
};

export type Theme = {
  darkMode: boolean;
  accent: string;
  background: string;
  animations: {
    speed: number;
    spring: boolean;
  };
};
export type User = {
  userId: string;
  authToken: string;
  username: string;
  email: string;
  phoneNumber: string;
  RSAKeyPair: {
    private: null | CryptoKey;
    public: null | CryptoKey;
    expiresAt: Date;
  };
};

export type ConfigContextType = {
  getAppData: <K extends keyof AppData>(key: K) => AppData[K];
  setAppData: React.Dispatch<React.SetStateAction<AppData>>;
  getThemeData: <K extends keyof Theme>(key: K) => Theme[K];
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  getUserData: <K extends keyof User>(key: K) => User[K];
};
