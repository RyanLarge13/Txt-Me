class NotifHdlr {
 constructor(setState) {
  this.setState = setState;
 }

 closeNotif() {
  this.setState({
   show: false,
   title: "",
   text: "",
   color: "",
   hasCancel: false,
   actions: []
  });
 }

 setNotif(title, text, hasCancel, actions) {
  this.setState({
   show: true,
   title,
   text,
   color: "bg-tri",
   hasCancel,
   actions: [
    {
     text: "close",
     func: (): void => this.closeNotif()
    },
    ...actions
   ]
  });
 }
}

export default NotifHdlr;
