"use client"

import InputField from "@/components/ui/InputField"
import { useState, useMemo } from "react"
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants"
import { useChainId, useConfig, useAccount, useWriteContract } from 'wagmi'
import { readContract, waitForTransactionReceipt } from "@wagmi/core"
import { calculateTotal } from "@/utils"


export default function AirdropForm() {
    const [tokenAddress, setTokenAddress] = useState("")
    const [recipients, setRecipients] = useState("")
    const [amounts, setAmounts] = useState("")
    const chainId = useChainId()
    const config = useConfig()
    const account = useAccount()
    const total: number = useMemo(() => calculateTotal(amounts), [amounts])
    const { data: hash, isPending, writeContractAsync } = useWriteContract()


    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if (!tSenderAddress) {
            alert("No address found, please use a supported chain")
            return 0
        }
        // read from the chain to see if we have approved enough token
        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "allowance",
            args: [account.address, tSenderAddress as `0x${string}`]
        })
        // token.allowance(account,tsender)
        return response as number

    }

    async function handleSubmit() {
        // 1a. If already approved, moved to step 2
        // 1b. Approve our tsender contract to send our tokens
        // 2. Call the airdrop function on the tsender contract
        // 3. Wait for the transaction to be mined
        const tSenderAddress = chainsToTSender[chainId]["tsender"]
        const approvedAmount = await getApprovedAmount(tSenderAddress)

        if (approvedAmount < total) {
            const approvalHash = await writeContractAsync({
                abi: erc20Abi,
                address: tokenAddress as `0x${string}`,
                functionName: "approve",
                args: [tSenderAddress as `0x${string}`, BigInt(total)],
            })
            const approvalReceipt = await waitForTransactionReceipt(config, {
                hash: approvalHash
            })
            console.log("Approval confirmed", approvalReceipt)

            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tSenderAddress as `0x${string}`,
                functionName: "airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amounts.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            })
        }
    }

    return (
        <div>
            <InputField
                label="Token Address"
                placeholder="0x"
                value={tokenAddress}
                onChange={e => setTokenAddress(e.target.value)}
            />
            <InputField
                label="Recipients"
                placeholder="0x12314,0x12342342"
                value={recipients}
                onChange={e => setRecipients(e.target.value)}
                large={true}
            />
            <InputField
                label="Amount"
                placeholder="100,200,300,..."
                value={amounts}
                onChange={e => setAmounts(e.target.value)}
                large={true}
            />
            <button onClick={handleSubmit} className="
    px-6 py-3 
    bg-blue-600 hover:bg-blue-700 
    text-white font-semibold 
    rounded-lg 
    shadow-sm 
    transition-colors duration-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed">
                Send tokens
            </button>
        </div>
    )
}