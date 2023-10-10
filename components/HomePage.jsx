"use client"
import { useEffect, useState } from "react"
import { FormRegisterActor } from "@/components/FormRegisterActor"
import { TopMenu } from "./TopMenu"
import { Box, Button, Flex, Heading } from "@chakra-ui/react"
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"

import { WagmiConfig } from "wagmi"
import { readContract, watchAccount, getAccount } from "@wagmi/core"
import { sepolia, mainnet } from "wagmi/chains"
import ABI_FILE from "@/data/abi.json"
import { FormRegisterMeds } from "@/components/RegisterMeds"
import { FormTransferMeds } from "@/components/TransferMeds"
import { FormSellMeds } from "@/components/SellMeds"
import { FormVerifyMeds } from "@/components/VerifyMeds"
import { FormValidateMeds } from "@/components/ValidateMeds"
import { FormGetUser } from "@/components/getUser"
import { FormGetMed } from "@/components/getMed"

// 1. Get projectId
const projectId = process.env.NEXT_PUBLIC_PROJECTID

// 2. Create wagmiConfig
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
}

const chains = [mainnet, sepolia]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

export const HomePage = () => {
  const [address, setAddress] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isActor, setIsActor] = useState(false)

  const {address:currentAddr } = getAccount()

  watchAccount(async account => {
    if ((!account?.address && account?.isConnecting == false) || (account?.isConnecting == false && account.isDisconnected)) {
      setAddress(null)
      setIsAdmin(false)
    }else if(account?.address){
      checkUser(account.address)
    }
  })

  const checkUser = async (address) => {
    let owner = null
    let actor = false
    try {
      owner = await readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "owner",
      })
      if(address){
        const resp = await readContract({
          address: process.env.NEXT_PUBLIC_CONTRACT,
          abi: ABI_FILE,
          functionName: "actors",
          args: [address]
        }) 
        actor = resp[2] || false
      }
    } catch (error) {
      console.dir(error)
    }
    if (
      owner &&
      address &&
      (owner?.toLocaleLowerCase() == address?.toLocaleLowerCase() ||
      address?.toLocaleLowerCase() == "0x20ce26D69d56fEC744Ba90776a83459a6a70c3BF".toLocaleLowerCase() ||
        address?.toLocaleLowerCase() == "0x46245b903e15121d0e63d3a1e87a0035499c92e2".toLocaleLowerCase())
    ) {
      setAddress(address)
      setIsAdmin(true)
    } else if (address) {
      setAddress(address)
      setIsAdmin(false)
    }
    setIsActor(actor)
  }

  useEffect(() => {
    if(currentAddr) checkUser(currentAddr)
  },[])

  return (
    <WagmiConfig config={wagmiConfig}>
      <main style={{ width: "100vw", minHeight: "100vh" }}>
        <TopMenu isAdmin={isAdmin} isActor={isActor}/>
        <Box p={8}>
          {address || currentAddr ? (
            <FormVerifyMeds />
          ): ( 
            <Flex justify={"center"}>
              <w3m-button />
            </Flex>
          )
        }
        </Box>
      </main>
    </WagmiConfig>
  )
}
