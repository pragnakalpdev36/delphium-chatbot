

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppContext from "../AppContext";
import { setUserId } from "../widgetSlice";
import { Header } from "./Header";
import { Keypad } from "./Keypad";
import { Launcher } from "./Launcher";
import { Messages } from "./Messages";
import { v4 as uuidv4 } from 'uuid';

export const WidgetLayout = (props) => {
  const dispatch = useDispatch();
  const { toggleWidget } = useSelector((state) => state.widgetState);
  // console.log("toggleWidget--->",toggleWidget)
  const { userId,embedded } = props;

  // console.log("embedded--->",embedded)
  // console.log("props....:",props)
  // console.log("userId----->>>>>",userId)
  const userIdRef = useRef(localStorage.getItem('user_id'));

  const widgetRef = useRef(null);
  console.log("userId-----????",userIdRef.current)
  dispatch(setUserId(userIdRef.current));
  useEffect(() => {
    if (userId) {
      userIdRef.current = userId;
    } else {
      // console.log("userId")
      if (!userIdRef.current) {
        if (userId == null) {
          const newUserId = uuidv4();
          localStorage.setItem('user_id', newUserId);
          userIdRef.current = newUserId;
          // userIdRef.current = localStorage.setItem('user_id',newUserId);
        // console.log("ref-----:",userIdRef.current);
        dispatch(setUserId(userIdRef.current));
        }
      }
    }
  }, [dispatch, embedded, props.userId, userId,props]);



  useEffect(() => {
    let height =75;
    let width=75;
    let radius=50;
    let position= "fixed";
    let bottom= 10;
    let right= 10; 
    let border="none";
    let background= "transparent";

  
    if ( toggleWidget) {
      
      height = 579 + 112;
      width = 400 + 20;
      radius=33;
      position= "fixed";
      bottom= 10;
      right= 10; 
      border="none";
      background= "transparent";
    }


      // console.log("Widget dimensions width :", width);
      // console.log("Widget dimensions height:", height);
      // console.log("Widget dimensions radius:", radius);

      window.parent.postMessage(
        {
          pH: `${height}px`,
          pW: `${width}px`,
          pBR:`${radius}px`,
          pB: `${background}`,
          pBO:`${border}`,
          pBOT:`${bottom}px`,
          pR:`${right}px`,
          pP:`${position}`
        },
        "*"
      );
    // }
  }, [toggleWidget]);

  if (embedded) {
    return (
      <AppContext.Provider value={{ userId:userIdRef.current, ...props }}>
        <AnimatePresence>
          <div
            className="fixed p-0 pt-0 flex h-full w-full  flex-col rounded-[1.8rem] bg-white  font-lato shadow-md"
            key="widget"
          >
            <Header />
            <Messages />
            <Keypad />
          </div>
        </AnimatePresence>
      </AppContext.Provider>
    );
  }
  
  return (
    <AppContext.Provider value={{ userId: userIdRef.current, ...props }}>
      <AnimatePresence>
        {toggleWidget && (
          <motion.div
            id="widget-container"
            className={`fixed bottom-5 right-5 z-50 flex h-[579px] w-[400px] flex-col 
              rounded-[1.8rem] bg-white font-lato ring-1 ring-black/5 xs:right-0 xs:h-[calc(100%-80px)] xs:w-full`}
            ref={widgetRef}
            animate={{ y: -60 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            key="widget"
          >
            <Header />
            <Messages />
            <Keypad />
          </motion.div>
        )}
        <Launcher />
      </AnimatePresence>
    </AppContext.Provider>
  );
};

