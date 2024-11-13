"use client";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/app/Lib/store";

const inter = Inter({ subsets: ["latin"] });

export default function MainLayout({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
