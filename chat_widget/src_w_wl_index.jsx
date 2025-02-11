// import { motion, AnimatePresence } from "framer-motion";
// // import { nanoid } from "nanoid";
// import { useEffect,useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AppContext from "../AppContext";
// import { setUserId } from "../widgetSlice";
// import { Header } from "./Header";
// import { Keypad } from "./Keypad";
// import { Launcher } from "./Launcher";
// import { Messages } from "./Messages";
// import { v4 as uuidv4 } from 'uuid';

// export const WidgetLayout = (props) => {
//   const dispatch = useDispatch();
//   let { toggleWidget} = useSelector(
//     (state) => state.widgetState
//   );

//   let { userId, embedded } = props;
//   console.log(embedded);
//   // let { embedded } = props;
//   // console.log(embedded);

//   let userIdRef = useRef(localStorage.getItem('user_id'));
//   // console.log("user Ref: " , userIdRef);
  
//   useEffect(() => {
//     if (userId) {
//       userIdRef.current = userId;
//     } else {
//       if (!userIdRef.current) {
//         if(userId==null) {
//           const newUserId = uuidv4();
//           // const newUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
//           // localStorage.setItem("user_id", newUserId);
//         //   userId = newUserId;
//         //   console.log("ref-----:", newUserId);
//         // }
//         userIdRef.current = localStorage.setItem('user_id',newUserId);
//         console.log("ref-----:",userIdRef.current);
//       }
//         dispatch(setUserId(userIdRef.current));
//       }
//     }
//   }, [dispatch, embedded, props.userId, userId,props]);

//   // useEffect(() => {
//   //   const userId=localStorage.getItem('user_id')
//   //   console.log("use effect---",userId);
//   // },[embedded, props.userId, userId])

//   if (embedded) {
//     return (
//       <AppContext.Provider value={{ userId:userIdRef.current, ...props }}>
//         <AnimatePresence>
//           <div
//             className="fixed flex h-full w-full  flex-col rounded-[1.8rem] bg-white  font-lato   shadow-md"
//             key="widget"
//           >
//             <Header />
//             <Messages />
//             <Keypad />
//           </div>
//         </AnimatePresence>
//       </AppContext.Provider>
//     );
//   }
//   return (
//     <AppContext.Provider value={{ userId:userIdRef.current, ...props }}>
//       <AnimatePresence>
//         {toggleWidget && (
//           <motion.div
//             className={`fixed bottom-5 right-5 z-50 flex h-[579px] w-[400px] flex-col rounded-[1.8rem]  bg-white font-lato ring-1 ring-black/5  xs:right-0 xs:h-[calc(100%-100px)] xs:w-full`}
//             animate={{ y: -60 }}
//             exit={{ opacity: 0 }}
//             transition={{ type: "spring", stiffness: 100 }}
//             key="widget"
//           >
//             <Header />
//             <Messages />
//             <Keypad />
//           </motion.div>
//         )}
//         <Launcher />
//       </AnimatePresence>
//     </AppContext.Provider>
//   );
// };

// import { motion, AnimatePresence } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AppContext from "../AppContext";
// import { setUserId } from "../widgetSlice";
// import { Header } from "./Header";
// import { Keypad } from "./Keypad";
// import { Launcher } from "./Launcher";
// import { Messages } from "./Messages";
// import { v4 as uuidv4 } from 'uuid';

// export const WidgetLayout = (props) => {
//   const dispatch = useDispatch();
//   let { toggleWidget } = useSelector((state) => state.widgetState);
//   let { userId, embedded } = props;
//   let userIdRef = useRef(localStorage.getItem('user_id'));

//   const [Height, setHeight] = useState({});
//   const [Width, setWidth] = useState({});
//   useEffect(() => {
//     if (userId) {
//       userIdRef.current = userId;
//     } else {
//       if (!userIdRef.current) {
//         if (userId == null) {
//           const newUserId = uuidv4();
//           userIdRef.current = localStorage.setItem('user_id', newUserId);
//         }
//         dispatch(setUserId(userIdRef.current));
//       }
//     }
//   }, [dispatch, embedded, props.userId, userId, props]);

//   useEffect(() => {
//     const widgetElement = document.getElementById("widget-container");
//     if (!widgetElement) return;

//     const resizeObserver = new ResizeObserver((entries) => {

//       for (let entry of entries) {
//         const { width, height } = entry.contentRect;
//         // const defaultMessage = []; // Replace this with your actual default message length condition
//         // const chats = []; // Replace this with your actual chat messages array

//         // const calculatedHeight = height < 80 && chats.length <= defaultMessage.length
//         const calculatedHeight = height < 80 
//           ? 80 + 16
//           : height + 112;

//         const calculatedWidth = width + 18 > 80
//           ? width + 18
//           : 80 + 16;

//           setHeight(calculatedHeight)
//           setWidth(calculatedWidth)
//         console.log("calculatedHeight----",calculatedHeight)
       
//         console.log("calculatedWidth----",calculatedWidth)
//       }
      
//       window.parent.postMessage(
//         {
//           pH: `${Height}px`,
//           pW: `${Width}px`,
//         },
//         "*"
//       );
//     });

//     resizeObserver.observe(widgetElement);

//     return () => {
//       resizeObserver.unobserve(widgetElement);
//     };
//   }, [toggleWidget]);

//   return (
//     <AppContext.Provider value={{ userId: userIdRef.current, ...props }}>
//       <AnimatePresence>
//         {toggleWidget && (
//           <motion.div
//             id="widget-container"
//             className={`fixed bottom-5 right-5 z-50 flex h-[579px] w-[400px] flex-col rounded-[1.8rem] bg-white font-lato ring-1 ring-black/5 xs:right-0 xs:h-[calc(100%-100px)] xs:w-full`}
//             animate={{ y: -60 }}
//             exit={{ opacity: 0 }}
//             transition={{ type: "spring", stiffness: 100 }}
//             key="widget"
//           >
//             <Header />
//             <Messages />
//             <Keypad />
//           </motion.div>
//         )}
//         <Launcher />
//       </AnimatePresence>
//     </AppContext.Provider>
//   );
// };



import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
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
  const { userId, embedded } = props;
  const userIdRef = useRef(localStorage.getItem('user_id'));

  const widgetRef = useRef(null);

  useEffect(() => {
    if (userId) {
      userIdRef.current = userId;
    } else {
      if (!userIdRef.current) {
        if (userId == null) {
          const newUserId = uuidv4();
          localStorage.setItem('user_id', newUserId);
          userIdRef.current = newUserId;
        }
        dispatch(setUserId(userIdRef.current));
      }
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const updateDimensions = () => {
      let height = 0;
      let width = 0;

      if (toggleWidget && widgetRef.current) {
        height = widgetRef.current.offsetHeight < 80 ? 96 : widgetRef.current.offsetHeight + 112;
        width = widgetRef.current.offsetWidth + 18 > 80 ? widgetRef.current.offsetWidth + 18 : 96;
      }

      console.log("Widget dimensions width :", width);
      console.log("Widget dimensions height:", height);

      window.parent.postMessage(
        {
          pH: `${height}px`,
          pW: `${width}px`,
        },
        "*"
      );
    };

    updateDimensions();

//     // Recalculate dimensions when the window resizes
//     window.addEventListener('resize', updateDimensions);

//     return () => {
//       window.removeEventListener('resize', updateDimensions);
//     };
  }, [toggleWidget]);

  return (
    <AppContext.Provider value={{ userId: userIdRef.current, ...props }}>
      <AnimatePresence>
        {toggleWidget && (
          <motion.div
            id="widget-container"
            className={`fixed bottom-5 right-5 z-50 flex h-[579px] w-[400px] flex-col rounded-[1.8rem] bg-white font-lato ring-1 ring-black/5 xs:right-0 xs:h-[calc(100%-100px)] xs:w-full`}
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
