"use client";  // クライアント専用

import { RecoilRoot } from "recoil";
import { BrowserRouter } from 'react-router-dom';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>
    <BrowserRouter>
    {children}
    </BrowserRouter>
    </RecoilRoot>;
}