import { useState } from "react"
import { create } from 'ipfs-http-client'

import { nftAddress, nftMarketplaceAddress } from "./utils/options"
import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import connect from "./utils/auth"
import {useRouter} from "next/router"


export default function CreateNFT(){
    const [NFTImage, setNFTImage] = useState();
    const [NFTImagePreviz, setNFTImagepreviz] = useState();
    const [NFTMetadata, setNFTMetadata] = useState([]);
    const client = create(new URL('https://ipfs.infura.io:5001'));
    const router = useRouter()
      
    async function mintNFT(){
        alert('Minting will require 2 transactions. One to approve our dapp, and another to mint the NFT. Please be patient and wait for the Metamask popups to confirm you txn has processed.')
        if(NFTImage){
            const metadata = await uploadMetadataToIPFS()
            const {account, web3} = await connect()
            console.log(account)
            const nftContract = new web3.eth.Contract(NFT.abi, nftAddress);
            const marketplaceContract = new web3.eth.Contract(NFTMarketplace.abi, nftMarketplaceAddress);
            nftContract.methods.createToken(metadata).send({from:account}).on('receipt', confirmations => {
                const tokenId = confirmations.events.Approval.returnValues[2];  
                console.log(tokenId)
                marketplaceContract.methods.createMarketItem(tokenId, nftAddress).send({
                    from:account
                    // add gas prices
                }).on('receipt', confirmations => {
                    alert("Success, your NFT was minted with Token ID:", tokenId)
                    router.push('/profile')
                });
            })
    
        }
          
    }

    async function uploadImageToIPFS(){
        try{
            const file = await client.add(NFTImage)
            const url = `https://ipfs.infura.io/ipfs/${file.path}`;
            
            return url;
        }catch(error){
            alert(`Error upload file ${error}`)
        }
    }

    async function uploadMetadataToIPFS(){
        const {title, description} = NFTMetadata;

        if(!title || !description ){
            console.log('check your inputs')
            return
        }
        const imageURL = await uploadImageToIPFS()
        const data = JSON.stringify({title, description, image: imageURL});

        try{
            const file = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${file.path}`;
            
            return url;
        }catch(error){
            alert(`Error upload file ${error}`)
        }
    }


    return(
        <div className="flex justify-center mt-11">
            
            <div className="flex-column w-1/2  bg-black-600 px-8 py-8 rounded-t-lg text-white text-justify">
                <h1 className="block text-3xl font-bold mb-8">Mint a new NFT</h1>
                <img className="w-72 mb-8" src={NFTImage ? NFTImagePreviz : "/placeholder.jpg"}></img>
                
                <label className="block mb-10 ">
                    <h2 className="text-2xl mb-3 font-bold" >Select a file</h2>
                        <input  type='file'  onChange={e=> { 
                                setNFTImage(e.target.files[0])
                                setNFTImagepreviz(URL.createObjectURL(e.target.files[0]))
                        }}></input>
                    </label>
               
                
               <label for="Title" className="block mb-10" >
                    <h2 className="text-2xl font-bold mb-1 " >Name (Required)</h2>
                    <p className="mb-6 w-2/3">Lorem ipsum.. </p>
                    <input required name="Title" className="block border w-2/3 p-2 rounded-md text-black-600" onChange={(e)=>{
                        setNFTMetadata({...NFTMetadata, title: e.target.value })
                    }} type='text' placeholder="Title"></input>
                </label>
               
                <label for="Description">
                    <h2 className="text-2xl mb-1 font-bold">Description (Required)</h2>
                    <p className="mb-6 w-2/3">The description will be included on the item's detail card underneath its image.</p>
                    <textarea  className="block border-2 p-2 rounded-md w-full text-black-600" name="Description" cols='86' rows="6" onChange={(e)=>{
                        setNFTMetadata({...NFTMetadata, description: e.target.value})
                    }} type='text' placeholder="Description"></textarea>
                </label>
                
                <button className="block py-3 px-12 text-white rounded-md mt-8 w-full bg-green-600" onClick={mintNFT}>Mint NFT</button>
                
            </div>
        </div>
    )
}