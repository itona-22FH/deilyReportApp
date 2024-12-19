"use client";  // クライアント専用
import {Provider} from 'jotai'
import { BrowserRouter } from "react-router-dom";

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
  );
}