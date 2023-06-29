"use client";
import { NumberInput } from "intl-number-input";
import { useEffect, useRef, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import Swal from "sweetalert2";
import {ethers} from "ethers";
import abi from '../assets/ABI.json';

export default function Home() {
  const account = useAccount();
  const [isApproved, setIsApproved] = useState(false);

  const usdInput = useRef<HTMLInputElement>(null);
  const rapidInput = useRef<HTMLInputElement>(null);

  const [rapidTokenEl, setRapidTokenEl] = useState<any>(null);
  const [usdInputEl, setUsdInput] = useState<any>(null);
  const [soldToken , setSoldToken] = useState<any>(0)
  const [address_ , setAddress]=useState('0x228580Db7A5E713755526B49eBec6f68F98cf4b8')

    function copy(text:any) {
    var dummyTextarea = document.createElement('textarea');
    dummyTextarea.value = text;
    document.body.appendChild(dummyTextarea);
    dummyTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(dummyTextarea);
    setAddress('Copied Address!')
  }
  
  useEffect(()=>{
    const contractAddress = "0xe72aa31AdbB0Da7C950e2F400B2697d663a4B655"
    const provider = new ethers.providers.JsonRpcProvider("https://thrumming-cool-research.bsc.discover.quiknode.pro/e4f7a81500e57cb5e3df373fd2b9455974236518/")
    const contract = new ethers.Contract(contractAddress, abi, provider);
    contract.tokensSold()
        .then((result: any) => {
          setSoldToken(result.toNumber())
            }
        )
        .catch((err: string) => {
          console.error(err);
        });
  })


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
        _rapidTokenEl.setValue((value.number || 50) * 7.7);
      },
    });

    setRapidTokenEl(_rapidTokenEl);
    setUsdInput(_usdInputEl);

    initMouseFollow();
  }, []);

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
          "0xe72aa31AdbB0Da7C950e2F400B2697d663a4B655",
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
        args: [BigInt(usdInputEl.getValue().number)],
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
             Funded: ${ Math.floor(soldToken * 0.129870)}
            </div>
            <div className="mx-auto text-center mt-4 text-black/50 text-sm">
              RAPID Token contract address:{" "}
              <a onClick={(e)=> copy('0x228580Db7A5E713755526B49eBec6f68F98cf4b8')}>
                <b >{address_}</b>
              </a>
              <p className="mt-2">
                For this exclusive sale only, 1 RAPID is valued at 0.13 USDT.
                The price will increase during Private Sale #2 and Public Sale
                stages.
              </p>
              <br />
              This presale will be open from{" "}
              <b className="text-black">June 23th to June 28th, 2023.</b>
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
