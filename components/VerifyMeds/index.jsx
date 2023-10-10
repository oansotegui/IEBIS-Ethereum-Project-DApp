"use client"

import { useState, useRef } from "react"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
  useColorModeValue,
  Radio,
  RadioGroup,
  VStack,
  useToast,
} from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { MdOutlineNumbers } from "react-icons/md"
import { CgDetailsMore } from "react-icons/cg"
import { readContract, writeContract } from "@wagmi/core"
import Web3 from "web3"
import ABI_FILE from "@/data/abi.json"
import { SiEthereum } from "react-icons/si"
import { ResultCard } from "../ResultCard"

export const FormVerifyMeds = () => {
  const [medicationID, setMedicationID] = useState("")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleWrite = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const med = await readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "verifyMedication",
        args: [medicationID],
      })
      setIsLoading(false)
      console.dir(med)
      setResult({
        registerBy: med[0],
        details: Web3.utils.hexToAscii(med[1]),
        isValidated: med[2],
      })
    } catch (error) {
      setResult(null)
      setIsLoading(false)
      console.log("ID", medicationID)
      console.dir(error)
      let errorMsg = "Desconocido"
      if (error?.shortMessage) {
        errorMsg = error.shortMessage
      } else if (error?.cause?.reason) {
        errorMsg = error?.cause?.reason
      }
      toast({
        title: "Transacción Fallida",
        description: errorMsg,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const handleChange = e => {
    setResult(null)
    setMedicationID(e.target.value)
  }

  return (
    <Flex
      m={{ base: 5, md: 16, lg: 10 }}
      flexDir={"column"}
      align="center"
      justify="center"
      id="contact"
    >
      <Box borderRadius="lg" p={{ base: 5, lg: 16 }}>
        <Box>
          <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
            <Heading
              fontSize={{
                base: "4xl",
                md: "5xl",
              }}
              textAlign={"center"}
            >
              Verificar la Trazabilidad de un Medicamento
            </Heading>

            <Stack
              spacing={{ base: 4, md: 8, lg: 20 }}
              direction={{ base: "column", md: "row" }}
            >
              <Box
                bg={"white"}
                borderRadius="lg"
                p={8}
                color={"gray.700"}
                shadow="base"
              >
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel>Med ID</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <MdOutlineNumbers />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="medicationID"
                        value={medicationID}
                        onChange={handleChange}
                        placeholder="ID Del Medicamento"
                      />
                    </InputGroup>
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Enviando..."
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: "blue.500",
                    }}
                    width="full"
                    onClick={handleWrite}
                  >
                    Verificar
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </VStack>
        </Box>
      </Box>
      {result && (
        <ResultCard
          medID={medicationID}
          registerBy={result?.registerBy}
          details={result?.details}
          isValid={result?.isValidated}
        />
      )}
    </Flex>
  )
}
