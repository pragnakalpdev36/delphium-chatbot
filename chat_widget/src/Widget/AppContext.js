import { createContext } from "react";

const AppContext = createContext({
  showTimestamp:"",
  rasaServerUrl: "",
  bgofInput:"",
  bottombgcolor:"",
  widgetbgColor:"",
  bgImage:"",
  timecolor:"",
  initialPayload: "/greet",
  metadata: {},
  botAvatar: "",
  widgetColor: "",
  botTitle: "",
  botSubTitle: "",
  userId: null,
  textColor: "",
  bgTheme:"",
  userMsgBackgroundColor: "",
  botMsgBackgroundColor: "",
  botMsgColor: "",
  userMsgColor: "",
  botResponseDelay: "",
  buttonsCss: {},
  chatHeaderCss: {},
  errorMessages: [],
  paddingaround:true,
  embedded:false,
  agentId:"",
});

export default AppContext;
