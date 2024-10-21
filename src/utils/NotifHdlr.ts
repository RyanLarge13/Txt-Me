import { Dispatch, SetStateAction } from "react";
import { SysNotif, Actions } from "../types/userTypes";

class NotifHdlr {
  private setState;
  constructor(setState: Dispatch<SetStateAction<SysNotif>>) {
    this.setState = setState;
  }

  closeNotif(): void {
    this.setState({
      show: false,
      title: "",
      text: "",
      color: "",
      hasCancel: false,
      actions: [],
    });
  }

  setNotif(
    title: string,
    text: string,
    hasCancel: boolean,
    actions: Actions[] | []
  ): void {
    this.setState({
      show: true,
      title,
      text,
      color: "bg-tri",
      hasCancel,
      actions: [
        {
          text: "close",
          func: (): void => this.closeNotif(),
        },
        ...actions,
      ],
    });
  }
}

export default NotifHdlr;
