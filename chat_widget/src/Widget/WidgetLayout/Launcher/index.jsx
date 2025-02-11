import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppContext from "../../AppContext";
import { setToggleWidget } from "../../widgetSlice";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const Launcher = () => {
  const dispatch = useDispatch();
  const toggleWidget = useSelector((state) => state.widgetState.toggleWidget);
  console.log("toggleWidget--->",toggleWidget)

  useEffect(() => {
    // Dispatch an action to set toggleWidget to false when the component mounts
    dispatch(setToggleWidget(false));
    console.log("setToggleWidget")
  }, []);

  const appContext = useContext(AppContext);
  const { widgetColor, botAvatar, textColor } = appContext;

  const handleToggle = (e) => {
    e.preventDefault();
    // Toggle the widget state
    dispatch(setToggleWidget(!toggleWidget));
  };

  return (
    <motion.div
      animate={{
        scale: [0, 1.1, 1],
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`fixed right-5 bottom-2 mr-2 inline-flex cursor-pointer items-center rounded-full p-2 text-center text-sm font-medium xs:right-0`}
      style={{ backgroundColor: widgetColor, color: textColor }}
      onClick={handleToggle}
    >
      <AnimatePresence>
        {toggleWidget ? (
          <motion.div
            animate={{
              rotate: [0, 90],
            }}
          >
            <XMarkIcon className="h-12 w-12" />
          </motion.div>
        ) : (
          <motion.div>
            <img src={botAvatar} className="h-12 w-12 rounded-full" alt="bot" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};




// import { useContext } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import AppContext from "../../AppContext";
// import { setToggleWidget } from "../../widgetSlice";
// import { motion, AnimatePresence } from "framer-motion";
// import { XMarkIcon } from "@heroicons/react/24/solid";

// export const Launcher = () => {
//   const dispatch = useDispatch();
//   const toggleWidget = useSelector((state) => state.widgetState.toggleWidget);
//   const appContext = useContext(AppContext);
//   const { widgetColor, botAvatar, textColor } = appContext;

//   const handleToggle = (e) => {
//     e.preventDefault();
//     dispatch(setToggleWidget(!toggleWidget));
//   };

//   return (
//     <motion.div
//       animate={{
//         scale: [0, 1.1, 1],
//       }}
//       transition={{ type: "spring", stiffness: 400, damping: 17 }}
//       className={`fixed right-5 bottom-2 mr-2 inline-flex cursor-pointer items-center rounded-full p-2 text-center text-sm font-medium xs:right-0`}
//       style={{ backgroundColor: widgetColor, color: textColor }}
//       onClick={handleToggle}
//     >
//       <AnimatePresence>
//         {toggleWidget ? (
//           <motion.div
//             key="close"
//             initial={{ rotate: 0 }}
//             animate={{ rotate: 90 }}
//             exit={{ rotate: 0 }}
//           >
//             <XMarkIcon className="h-12 w-12" />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="open"
//             initial={{ rotate: 0 }}
//             animate={{ rotate: 0 }}
//             exit={{ rotate: 0 }}
//           >
//             <img src={botAvatar} className="h-12 w-12 rounded-full" alt="bot" />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };
