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
  Card,
  CardHeader,
  CardBody,
  StackDivider,
} from "@chakra-ui/react"
import { BsPerson } from "react-icons/bs"
import { MdOutlineNumbers } from "react-icons/md"
import { CgDetailsMore } from "react-icons/cg"
import { readContract, writeContract } from "@wagmi/core"
import Web3 from "web3"
import ABI_FILE from "@/data/abi.json"
import { SiEthereum } from "react-icons/si"

const USER_STATUS = ["Productor", "Distribuidor", "Farmacia"]

export const shortenEthereumAddress = address => {
  // Get the first 4 characters of the address.
  const firstChars = address.substring(0, 5)

  // Get the last 4 characters of the address.
  const lastChars = address.substring(address.length - 4)

  // Combine the first and last characters with an ellipsis (...).
  const shortenedAddress = `${firstChars}...${lastChars}`

  return shortenedAddress
}

export const FormGetUser = () => {
  const [address, setAddress] = useState("")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleClick = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const data = await readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "actors",
        args: [address],
      })
      console.dir(data)
      setIsLoading(false)
      if (data[2] === false) {
        toast({
          title: "ERROR",
          description: "El usuario no esta registrado",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      } else {
        //show info
        setResult({
          name: data[0],
          type: USER_STATUS[parseInt(data[1])],
        })
      }
    } catch (error) {
      setResult(null)
      setIsLoading(false)
      console.log("address", address)
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
    setAddress(e.target.value)
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
              Buscar usuario
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
                    <FormLabel>Address</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <SiEthereum />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="address"
                        value={address}
                        w={"60vw"}
                        minW={"350px"}
                        maxW={"500px"}
                        onChange={handleChange}
                        placeholder="Dirección del usuario"
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
                    onClick={handleClick}
                  >
                    Buscar
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </VStack>
        </Box>
      </Box>
      {result && (
        <Card>
          <CardHeader>
            <Heading size="md">{`Address ${shortenEthereumAddress(
              address
            )}`}</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Nombre
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.name}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Tipo de Usuario
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.type}
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Flex>
  )
}
