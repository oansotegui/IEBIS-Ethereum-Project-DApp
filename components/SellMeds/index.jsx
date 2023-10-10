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
import { SiEthereum } from "react-icons/si"
import { BASE } from "@/constants/links"

export const FormSellMeds = () => {
  const [medicationID, setMedicationID] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleWrite = async () => {
    setIsLoading(true)
    try {
      const { hash } = await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "sellMedication",
        args: [medicationID],
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
                <Text fontWeight={"bold"}>Medicamento Vendido</Text>
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
              Vender Un Medicamento
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
                    Vender
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
