'use client';
import { NumberInput } from 'intl-number-input'
import { useEffect, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';

export default function Home() {
  const account = useAccount();
  const [isApproved, setIsApproved] = useState(false);

  const usdInput = useRef<HTMLInputElement>(null);
  const rapidInput = useRef<HTMLInputElement>(null);

  const [rapidTokenEl, setRapidTokenEl] = useState<any>(null)
  const [usdInputEl, setUsdInput] = useState<any>(null)

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
          max: 2000
        }
      },
      onInput: (value) => {
        _rapidTokenEl.setValue((value.number || 50) * 5.9);
      }
    });

    setRapidTokenEl(_rapidTokenEl);
    setUsdInput(_usdInputEl);

    initMouseFollow();
  }, [])

  function initMouseFollow() {
    const effect = document.getElementById('effect') as HTMLElement;

    window.onpointermove = event => {
      const { clientX, clientY } = event;

      effect.animate({
        top: clientY + 'px',
        left: clientX + 'px',
      }, {
        duration: 3000,
        fill: 'forwards',
      })
    };
  }

  const approveContract = useContractWrite({
    abi: [
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    address: '0x55d398326f99059ff775485246999027b3197955',
    functionName: 'approve',
    mode: ('recklesslyUnprepared' as any),
    value: BigInt(0),
  })

  async function handleApproveClick(e: any) {
    e.preventDefault();

    if (!approveContract.writeAsync) {
      return;
    }

    const result = await approveContract.writeAsync({
      args: [
        '0xb33a0119315E03f8B53b24A688283423557A71b7',
        BigInt(
          usdInputEl.getValue().number * 10 ** 18
        )
      ],
    });

    setTimeout(() => {
      if (result.hash) {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
    }, 3000)
  }

  const buyContract = useContractWrite({
    abi: [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "totalPrice",
            "type": "uint256"
          }
        ],
        "name": "buyTokens",
        "outputs": [

        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ],
    address: '0xb33a0119315E03f8B53b24A688283423557A71b7',
    functionName: 'buyTokens',
    mode: ('recklesslyUnprepared' as any),
    value: BigInt(0),
  })

  async function handleBuyClick(e: any) {
    e.preventDefault();

    if (!buyContract.writeAsync) {
      return;
    }

    try {
      const result = await buyContract.writeAsync({
        args: [
          BigInt(
            usdInputEl.getValue().number
          )
        ],
      });

      if (result.hash) {
        alert('Rapid token bought successfully')
      } else {
        alert('Failed');
      }
    } catch (e) {
    }
  }

  return <>
    <div id='effect' className='follower pointer-events-none spinner z-20'></div>

    <main className={`flex flex-col px-4 min-h-screen`}>
      <nav className='max-w-screen-xl w-full mx-auto  z-50'>
        <div className='flex items-center justify-between py-6'>
          <div className='flex gap-6'>
            <h1 className='text-bold text-2xl'>RAPID CHAIN</h1>
          </div>

          <div>
            <ul className='flex items-center gap-6'>
              <li className='text-sm text-gray-500 hover:text-gray-900'>
                <a href="https://rapidchain.io/">Web</a>
              </li>
              <li className='text-sm text-gray-500 hover:text-gray-900'>
                <a href="https://twitter.com/RapidChain">Twitter</a>
              </li>
              <li className='text-sm text-gray-500 hover:text-gray-900'>
                <a href="https://t.me/RapidChainOfficial">Telegram</a>
              </li>
              <li>
                <ConnectButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className='max-w-screen-xl w-full mx-auto flex flex-col z-50'>
        <section className='bg-gray-100/50 backdrop-blur-3xl shadow px-8 py-6 rounded my-12 mx-auto max-w-screen-sm w-full'>
          <div>
            <h2 className='text-xl text-semibold'>RAPIDCHAIN Privatesale #1</h2>
            <p className='text-light mt-2 text-sm text-black/60'>To earn a spot on the WhiteList, you must have a minimum of 100 GLI tokens in your BSC wallet. The minimum purchase amount is 50 USDT, and the maximum purchase amount is 2000 USDT.
              Once you make a purchase, your RAPID tokens will be sent to your wallet immediately. This transaction is irreversible.
            </p>
          </div>

          <div className='mt-12 flex flex-col'>
            <div className='w-2/3 mx-auto relative'>
              <input value="50" className='px-8 py-4 rounded shadow w-full text-medium outline-emerald-500' placeholder='USD Amount' ref={usdInput}></input>
              <img src='/usdt.png' className='w-8 h-8 absolute right-4 translate-y-1/2 bottom-1/2 text-bold text-xl' />
            </div>

            <div className='my-4 mx-auto'>
              <div className='h-8 w-8'>
                <svg className='fill-black' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9498 7.94975L10.5356 9.36396L8.00079 6.828L8.00004 20H6.00004L6.00079 6.828L3.46451 9.36396L2.05029 7.94975L7.00004 3L11.9498 7.94975ZM21.9498 16.0503L17 21L12.0503 16.0503L13.4645 14.636L16.0008 17.172L16 4H18L18.0008 17.172L20.5356 14.636L21.9498 16.0503Z"></path></svg>
              </div>
            </div>

            <div className='w-2/3 mx-auto relative'>
              <input disabled ref={rapidInput} className='px-8 py-4 rounded shadow w-full text-medium outline-emerald-500' placeholder='Rapid Token Amount' ></input>
              <img src='/logo.png' className='w-8 h-8 absolute right-4 translate-y-1/2 bottom-1/2 text-bold text-xl' />
            </div>
          </div>

          <div className='mt-12 w-1/3 mx-auto flex gap-2'>
            <button disabled={!account.isConnected && account.isDisconnected && !isApproved} onClick={handleApproveClick} className={'bg-black disabled:opacity-20 w-full hover:bg-white hover:text-black text-white px-6 py-3 rounded text-lg text-semibold transition ' + (isApproved ? 'hidden' : '')}>Approve</button>
            <button disabled={!account.isConnected && account.isDisconnected && isApproved} onClick={handleBuyClick} className={'bg-black  disabled:opacity-20 w-64 hover:bg-white hover:text-black text-white px-6 py-3 rounded text-lg text-semibold transition ' + (!isApproved ? 'hidden' : '')}>Buy</button>
          </div>
          <div className='mx-auto text-center mt-4 text-black/50 w- text-sm'>
            RAPID Token contract address: <b>0xaE882c1b3AaE1Fc64D8dbAc7Bba10633146aA82e</b>

            <p className='mt-2'>For this exclusive sale only, 1 RAPID is valued at 0.17 USDT. The price will increase during Private Sale #2 and Public Sale stages.</p>

            <br />
            This presale will be open from <b className='text-black'>June 28th to June 28th, 2023.</b>
          </div>
        </section>
      </div>

      <footer className='mt-auto py-6  z-50'>
        <div className='max-w-screen-xl w-full mx-auto text-center'>
          All right reserved &copy; 2023 Rapid Chain
        </div>
      </footer>

    </main>
  </>
}
