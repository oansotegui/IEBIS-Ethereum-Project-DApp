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
  Icon,
} from "@chakra-ui/react"
import { BsCheckCircleFill, BsPerson } from "react-icons/bs"
import { MdOutlineNumbers } from "react-icons/md"
import { CgDetailsMore } from "react-icons/cg"
import { AiOutlineClose } from "react-icons/ai"
import { readContract, writeContract } from "@wagmi/core"
import Web3 from "web3"
import ABI_FILE from "@/data/abi.json"
import { BASE } from "@/constants/links"

export const asciiToHexBytes32 = string => {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(string)

  // Pad the bytes to 32 bytes with 0x00 bytes.
  const paddedBytes = Array(32).fill(0x00)
  for (let i = 0; i < bytes.length; i++) {
    paddedBytes[i] = bytes[i]
  }

  // Convert the padded bytes to a hexadecimal string.
  const hexString = Web3.utils.bytesToHex(paddedBytes)

  return hexString
}

export const FormRegisterMeds = () => {
  const [medicationID, setMedicationID] = useState("")
  const [detailsHash, setDetailsHash] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleWrite = async () => {
    setIsLoading(true)
    try {
      const bytesHash = asciiToHexBytes32(detailsHash)
      const { hash } = await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "registerMedication",
        args: [medicationID, bytesHash],
      })
      setIsLoading(false)
      console.dir(hash)
      toast({
        render: ({ onClose }) => (
          <Box
            pos={"relative"}
            color="white"
            p={3}
            bg="green.600"
            borderRadius={"md"}
          >
            <Icon
              as={AiOutlineClose}
              onClick={onClose}
              pos={"absolute"}
              right={4}
              _hover={{ cursor: "pointer" }}
            />
            <Flex flexDir={"column"} justify={"center"} align={"center"}>
              <Flex w={"100%"} gap={1.5} align={"center"}>
                <BsCheckCircleFill />
                <Text fontWeight={"bold"}>Medicamento Registrado</Text>
              </Flex>
              <a href={BASE + hash} target="_blank">
                Ver en explorador
              </a>
            </Flex>
          </Box>
        ),
        duration: 4000,
        isClosable: true,
      })
    } catch (error) {
      setIsLoading(false)
      console.log("ID", medicationID)
      console.log("details", detailsHash)
      console.dir(error)
      let errorMsg = "Desconocido"
      if (error?.shortMessage) {
        errorMsg = error.shortMessage
      } else if (error?.cause.reason) {
        errorMsg = error?.cause.reason
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
  return (
    <Flex align="center" justify="center" id="contact">
      <Box
        borderRadius="lg"
        m={{ base: 5, md: 16, lg: 10 }}
        p={{ base: 5, lg: 16 }}
      >
        <Box>
          <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
            <Heading
              fontSize={{
                base: "4xl",
                md: "5xl",
              }}
              textAlign={"center"}
            >
              Registrar Un Medicamento
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
                        onChange={e => setMedicationID(e.target.value)}
                        placeholder="ID Del Medicamento"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Detalles</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <CgDetailsMore />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="details"
                        value={detailsHash}
                        onChange={e => setDetailsHash(e.target.value)}
                        placeholder="Detalles del Medicamento"
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
                    Registrar
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  )
}
