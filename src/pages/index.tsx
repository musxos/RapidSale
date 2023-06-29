"use client";
import { NumberInput } from "intl-number-input";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";

export default function Home() {

  return (
    <>
      <div className="h-screen w-screen fixed overflow-hidden pointer-events-none top-0 left-0">
        <div
          id="effect"
          className="follower pointer-events-none spinner z-20"
        ></div>
      </div>

      <main className={`flex flex-col px-2 min-h-screen`}>
        <nav className="max-w-screen-xl w-full mx-auto  z-50">
          <div className="flex flex-col md:flex-row items-center justify-between py-6">
            <div className="flex gap-6">
              <h1 className="text-bold text-2xl">RAPID CHAIN</h1>
            </div>

            <div>
              <ul className="flex items-center md:mt-0 mt-4 gap-6">
                <li className="text-sm text-gray-500 hover:text-gray-900">
                  <a href="https://rapidchain.io/">Web</a>
                </li>
                <li className="text-sm text-gray-500 hover:text-gray-900">
                  <a href="https://twitter.com/RapidChain">Twitter</a>
                </li>
                <li className="text-sm text-gray-500 hover:text-gray-900">
                  <a href="https://glitoken.com/gli_lock_ui.html">$GLI Token Lock</a>
                </li>
                
                <li className="text-sm text-gray-500 hover:text-gray-900">
                  <a href="https://t.me/RapidChainOfficial">Telegram</a>
                </li>
                <li className="md:block hidden">
                  <ConnectButton />
                </li>
              </ul>

              <div className="md:hidden flex items-center justify-center mt-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-screen-xl w-full sm:h-2/3 mx-auto flex flex-col z-50">
          <section className="bg-gray-100/50 backdrop-blur-3xl shadow px-8 py-6 rounded my-6 mx-auto max-w-screen-sm w-full">
            <div>
              <h2 className="text-xl text-semibold">
                RAPIDCHAIN Privatesale #1
              </h2>
              <p className="text-light mt-2 text-sm text-black/60">
              Seed Sale has been successfully completed. A total of $69,450.00 USD was Funded.
                Thanks to all Participants
              </p>
            </div>

   
              

         
        
            <div className="mx-auto text-center mt-4 text-black/50 text-sm">
              RAPID Token contract address: 0x228580Db7A5E713755526B49eBec6f68F98cf4b8
             
              
            </div>
          </section>
        </div>

        <footer className="mt-auto py-6  z-50">
          <div className="max-w-screen-xl w-full mx-auto text-center">
            All right reserved &copy; 2023 Rapid Chain
          </div>
        </footer>
      </main>
    </>
  );
}
