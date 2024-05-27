"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "./Lib/store";
import { PersistGate } from "redux-persist/integration/react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
