import Link from 'next/link'
import { useEffect, useState } from 'react'
import connect from '../utils/auth'
import React from "react";
import ReactDOM from "react-dom";
import { ShoppingCart, Send, Repeat, Camera } from "react-feather";
import { ExternalLink } from 'react-external-link';

export default function Nav(){
    const [account, setAccount] = useState()

    useEffect(()=>{showAccount()},[])

    async function showAccount(){
        const {account} = await connect()
        setAccount(account.substring(36,42))
        
    }

    return(
        <div className='flex space-x-4 py-4 bg-black-800 border-b  text-white'>
            <div className="flex flex-grow items-center mt-2">
            <img src='https://gateway.pinata.cloud/ipfs/QmQN9RBSpStKYWVWKNgcJteDQRt4zMCqn8D28geVDATqQ6' alt='image' height='45' width='45' />
                <Link href="/"><a className="ml-12 block mt-1"><h2>Marketplace</h2></a></Link><ShoppingCart size={15} />
                <ExternalLink className="ml-12 block mt-1" style={{color: 'white'}} href={`https://t.me/alphadao1337`}>
                {('Telegram')}
                </ExternalLink> <Send size={15} />
                <ExternalLink className="ml-12 block mt-1" style={{color: 'white'}} href={`https://swap.alphadao.money`}>
                {('Swap')}
                </ExternalLink> <Repeat size={15} />
            </div>
            <div className="mt-2 flex">
                
                <Link href="/profile"><a className="mr-3 py-2 px-8 border rounded-full">Profile</a></Link>
                <Link  href="/createnft"><a className="mr-4 py-2 px-6 bg-green-600 rounded-full">Mint NFT</a></Link>
                <p className="text-green-600 mt-2">Account: [0x...{account}]</p>
                
                
            </div>

      
        </div>
    )
}