import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toast, ToastPosition, toast } from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

type NotificationProps = {
  content: React.ReactNode;
  status: "success" | "info" | "loading" | "error" | "warning";
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

type NotificationOptions = {
  duration?: number;
  icon?: string;
  position?: ToastPosition;
};

const ENUM_STATUSES = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  loading: (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-6 h-6"
    >
      <svg className="w-6 h-6 text-[#14B8A6]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </motion.div>
  ),
  error: <ExclamationCircleIcon className="w-6 h-6 text-red-500" />,
  info: <InformationCircleIcon className="w-6 h-6 text-[#14B8A6]" />,
  warning: <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />,
};

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = "top-center";

/**
 * Custom Notification with Premium Design
 */
const Notification = ({
  content,
  status,
  duration = DEFAULT_DURATION,
  icon,
  position = DEFAULT_POSITION,
}: NotificationProps) => {
  return toast.custom(
    (t: Toast) => (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{
          opacity: t.visible ? 1 : 0,
          y: t.visible ? 0 : -50,
          scale: t.visible ? 1 : 0.95,
        }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        whileHover={{ scale: 1.02, y: -2 }}
        className="flex flex-row items-center justify-between max-w-md w-full rounded-2xl shadow-xl shadow-[#14B8A6]/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-800 p-4 space-x-3"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 10 }}
          className="flex-shrink-0"
        >
          {icon ? icon : ENUM_STATUSES[status]}
        </motion.div>

        {/* Content */}
        <div className="flex-1 overflow-x-hidden break-words whitespace-pre-line text-sm font-medium text-gray-900 dark:text-white">
          {content}
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.button>
      </motion.div>
    ),
    {
      duration: status === "loading" ? Infinity : duration,
      position,
    },
  );
};

export const notification = {
  success: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "success", ...options });
  },
  info: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "info", ...options });
  },
  warning: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "warning", ...options });
  },
  error: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "error", ...options });
  },
  loading: (content: React.ReactNode, options?: NotificationOptions) => {
    return Notification({ content, status: "loading", ...options });
  },
  remove: (toastId: string) => {
    toast.remove(toastId);
  },
};
