"use client";
import { NumberInput } from "intl-number-input";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite } from "wagmi";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

export default function Home() {
  const [referralCode, setReferralCode] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const account = useAccount({
    onConnect: ({ address }) => {
      setReferralCode(address as string);
      setIsConnected(true);
    },
    onDisconnect: () => {
      setIsConnected(false);
    }
  });
  const [isApproved, setIsApproved] = useState(false);

  const usdInput = useRef<HTMLInputElement>(null);
  const rapidInput = useRef<HTMLInputElement>(null);

  const [rapidTokenEl, setRapidTokenEl] = useState<any>(null);
  const [usdInputEl, setUsdInput] = useState<any>(null);

  const router = useRouter();
  const [refer, setRefer] = useState(
    "0xc0841C87cbe8F7bB3B6626F99977A88426336070"
  );

  useEffect(() => {
    let _rapidTokenEl = new NumberInput({
      el: rapidInput.current as any,
      options: {
        exportValueAsInteger: true,
        precision: 0,
      },
    });

    let _usdInputEl = new NumberInput({
      el: usdInput.current as any,
      options: {
        exportValueAsInteger: true,
        precision: 0,
        valueRange: {
          min: 50,
          max: 2000,
        },
      },
      onInput: (value) => {
        _rapidTokenEl.setValue((value.number || 10) * 5.55);
      },
    });

    setRapidTokenEl(_rapidTokenEl);
    setUsdInput(_usdInputEl);

    initMouseFollow();
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.refer) {
        setRefer(router.query.refer as string);
      }
    }

  }, [router.isReady])

  function initMouseFollow() {
    const effect = document.getElementById("effect") as HTMLElement;

    window.onpointermove = (event) => {
      const { clientX, clientY } = event;

      effect.animate(
        {
          top: clientY + "px",
          left: clientX + "px",
        },
        {
          duration: 3000,
          fill: "forwards",
        }
      );
    };
  }

  const approveContract = useContractWrite({
    abi: [
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address: "0x55d398326f99059ff775485246999027b3197955",
    functionName: "approve",
    mode: "recklesslyUnprepared" as any,
    value: BigInt(0),
  });

  async function handleApproveClick(e: any) {
    e.preventDefault();

    if (!approveContract.writeAsync) {
      return;
    }

    try {
      const result = await approveContract.writeAsync({
        args: [
          "0x754918F7ca3Bf3B4217961FE128bF25c9CF83422",
          BigInt(usdInputEl.getValue().number * 10 ** 18),
        ],
      });

      setTimeout(() => {
        if (result.hash) {
          setIsApproved(true);

          Swal.fire({
            title: "Approved successfully",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          setIsApproved(false);

          Swal.fire({
            title: "Failed",
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }, 3000);
    } catch (e) {}
  }

  const buyContract = useContractWrite({
    abi: [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "totalPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "referralAddress",
            type: "address",
          },
        ],
        name: "buyTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    address: "0xe72aa31AdbB0Da7C950e2F400B2697d663a4B655",
    functionName: "buyTokens",
    mode: "recklesslyUnprepared" as any,
    value: BigInt(0),
  });

  async function handleBuyClick(e: any) {
    e.preventDefault();

    if (!buyContract.writeAsync) {
      return;
    }

    try {
      const result = await buyContract.writeAsync({
        args: [BigInt(usdInputEl.getValue().number), refer],
      });

      if (result.hash) {
        Swal.fire({
          title: "Rapid token bought successfully",
          icon: "success",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "Failed",
          icon: "error",
          showCancelButton: false,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (e) {}
  }

  function handleReferralCodeChange(e: any) {
    setReferralCode(e.target.value);
  }

  const [isCopied, setIsCopied] = useState(false);
  function handleCopyClick(e: any) {
    e.preventDefault();

    const url = window.location.href;

    const str = url + "?refer=" + referralCode;

    navigator.clipboard.writeText(str);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  return (
    <>
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

        <div className="max-w-screen-xl w-full mx-auto flex flex-col z-50">
          <div className="flex md:flex-row flex-col gap-6">
            <div className="bg-gray-100/50 backdrop-blur-3xl shadow px-8 py-6 rounded my-12 w-full md:w-1/4 shrink-1 grow-0">
              <div className="mb-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Token:
                </h3>
                <div className="flex items-center gap-2 pt-8 text-center justify-center font-semibold text-xl">
                  RAPID
                </div>
              </div>
              <hr />
              <div className="mb-4 mt-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Chain:
                </h3>
                <div className="flex items-center gap-2 pt-8 text-center justify-center font-semibold text-xl">
                  BEP20
                </div>
              </div>
              <hr />
              <div className="mb-4 mt-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Total:
                </h3>
                <div className="flex flex-col items-center gap-2 pt-8 text-center justify-center font-semibold text-xl">
                  4,232,443,213
                </div>
              </div>
              <hr />
              <div className="mb-4 mt-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Price:
                </h3>
                <div className="flex flex-col items-center gap-2 pt-8 text-center justify-center font-semibold text-xl">
                  $1 = 1 RAPID
                </div>
              </div>
              <hr />
              <div className="mb-4 mt-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Token Address:
                </h3>
                <div className="flex items-center pt-8 text-center justify-center overflow-hidden">
                  <p className="font-semibold truncate whitespace-nowrap group pt-2 relative">
                    0xb33a0119315E03f8B53b24A688283423557A71b7
                    <button className="transition opacity-0 group group-hover:opacity-100 absolute p-1.5 top-1/2 transform -translate-y-1/2 right-0 h-8 w-8 rounded bg-black text-white text-lg">
                      <svg
                        className="fill-white group-focus:hidden block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M7 4V2H17V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7ZM7 6H5V20H19V6H17V8H7V6ZM9 4V6H15V4H9Z"></path>
                      </svg>
                      <svg
                        className="group-focus:block hidden fill-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"></path>
                      </svg>
                    </button>
                  </p>
                </div>
              </div>
              <hr />
              <div className="h-full p-8">
                <img
                  className="aspect-square grayscale opacity-50"
                  src="/logo_transparent.png"
                ></img>
              </div>
            </div>
            <section className="bg-gray-100/50 backdrop-blur-3xl shadow px-8 py-6 rounded my-12 w-full md:w-3/4 shrink-1 grow-0">
              <div>
                <h2 className="text-xl text-semibold">
                  RAPIDCHAIN Privatesale #1
                </h2>
                <p className="text-light mt-2 text-sm text-black/60">
                  To earn a spot on the WhiteList, you must have a minimum of
                  100 GLI tokens in your BSC wallet. The minimum purchase amount
                  is 50 USDT, and the maximum purchase amount is 2000 USDT. Once
                  you make a purchase, your RAPID tokens will be sent to your
                  wallet immediately. This transaction is irreversible.
                </p>
              </div>

              <div className="mt-12 flex flex-col">
                <div className="w-3/4 mx-auto relative">
                  <input
                    value="50"
                    className="px-8 py-4 rounded shadow w-full text-medium outline-emerald-500"
                    placeholder="USD Amount"
                    ref={usdInput}
                  ></input>
                  <img
                    src="/usdt.png"
                    className="w-8 h-8 absolute right-4 translate-y-1/2 bottom-1/2 text-bold text-xl"
                  />
                </div>

                <div className="my-4 mx-auto">
                  <div className="h-8 w-8">
                    <svg
                      className="fill-black"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M11.9498 7.94975L10.5356 9.36396L8.00079 6.828L8.00004 20H6.00004L6.00079 6.828L3.46451 9.36396L2.05029 7.94975L7.00004 3L11.9498 7.94975ZM21.9498 16.0503L17 21L12.0503 16.0503L13.4645 14.636L16.0008 17.172L16 4H18L18.0008 17.172L20.5356 14.636L21.9498 16.0503Z"></path>
                    </svg>
                  </div>
                </div>

                <div className="w-3/4 mx-auto relative">
                  <input
                    disabled
                    ref={rapidInput}
                    className="px-8 py-4 rounded shadow w-full text-medium outline-emerald-500"
                    placeholder="Rapid Token Amount"
                  ></input>
                  <img
                    src="/logo.png"
                    className="w-8 h-8 absolute right-4 translate-y-1/2 bottom-1/2 text-bold text-xl"
                  />
                </div>
              </div>

              <div className="mt-3 w-3/4 mx-auto flex gap-2">
                <button
                  disabled={
                    !account.isConnected &&
                    account.isDisconnected &&
                    !isApproved
                  }
                  onClick={handleApproveClick}
                  className={
                    "bg-black disabled:opacity-20 w-full hover:bg-white hover:text-black text-white px-6 py-3 rounded text-md text-semibold transition " +
                    (isApproved ? "hidden" : "")
                  }
                >
                  Approve
                </button>
                <button
                  disabled={
                    !account.isConnected && account.isDisconnected && isApproved
                  }
                  onClick={handleBuyClick}
                  className={
                    "bg-black  disabled:opacity-20 w-full hover:bg-white hover:text-black text-white px-6 py-3 rounded text-md text-semibold transition " +
                    (!isApproved ? "hidden" : "")
                  }
                >
                  Buy
                </button>
              </div>
              <div className="mx-auto text-center mt-4 text-black/50 text-sm">
                RAPID Token contract address:{" "}
                <b>0x228580Db7A5E713755526B49eBec6f68F98cf4b8</b>
                <p className="mt-2">
                  For this exclusive sale only, 1 RAPID is valued at 0.13 USDT.
                  The price will increase during Private Sale #2 and Public Sale
                  stages.
                </p>
                <br />
                This presale will be open from{" "}
                <b className="text-black">June 28th to June 28th, 2023.</b>
              </div>
              <div className="mb-4 mt-4 relative">
                <h3 className="text-sm text-black/50 absolute top-0 left-0">
                  Funded:
                </h3>
                <div className="flex flex-col items-center gap-2 pt-8 text-center justify-center font-semibold text-xl">
                  <div className="text-xs text-black/50">
                    0 / 300.000
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div className="w-0 h-full rounded-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                  </div>
                  <div className="text-xs text-black/50 ml-auto">0%</div>
                </div>
              </div>

              {isConnected && <div>
                <h3 className="text-xl text-semibold">
                  Use your reference code and won RAPID!
                </h3>
                <p className="text-light mt-2 text-sm text-black/60">
                  Share your reference code with your friends and earn 5% of
                  their purchase amount in RAPID tokens. Your friends will also
                  receive a 5% bonus on their purchase amount.
                </p>

                <div className="mt-4 flex flex-col">
                  <div className="flex md:flex-row flex-col w-3/4 mx-auto relative">
                    <input
                      value={referralCode}
                      disabled
                      className="px-8 py-4 rounded shadow w-full text-medium outline-emerald-500"
                      placeholder="Reference Code"
                      onChange={(e) => setReferralCode(e.target.value)}
                    ></input>

                    <button
                      onClick={handleCopyClick}
                      className="h-full px-4 bg-black py-4 text-white rounded-r text-md font-semibold"
                    >
                      {
                        isCopied ? "Copied" : "Copy"
                      }
                    </button>
                  </div>
                </div>
              </div>}
            </section>
          </div>
        </div>

        <footer className="mt-auto py-6 z-50">
          <div className="max-w-screen-xl w-full mx-auto text-center">
            All right reserved &copy; 2023 Rapid Chain
          </div>
        </footer>
      </main>
      <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none">
        <div
          id="effect"
          className="follower pointer-events-none spinner z-20"
        ></div>
      </div>
    </>
  );
}
