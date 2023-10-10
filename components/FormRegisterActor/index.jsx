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
import { BsPerson, BsCheckCircleFill } from "react-icons/bs"
import { SiEthereum } from "react-icons/si"
import { AiOutlineClose } from "react-icons/ai"
import { readContract, writeContract } from "@wagmi/core"
import ABI_FILE from "@/data/abi.json"
import { BASE } from "@/constants/links"

export const FormRegisterActor = () => {
  const [typeVal, setTypeVal] = useState(0)
  const [address, setAddress] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleWrite = async () => {
    setIsLoading(true)
    try {
      const { hash } = await writeContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "registerActor",
        args: [address, name, typeVal],
      })
      setIsLoading(false)
      console.dir(hash)
      toast({
        title: "Usuario Registrado.",
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
                <Text fontWeight={"bold"}>Usuario Registrado</Text>
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
      console.log("type", typeVal)
      console.log("address", address)
      console.log("name", name)
      console.dir(error)
      toast({
        title: "Transacción Fallida",
        description: error?.cause?.reason,
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
              Registrar Usuario
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
                    <FormLabel>ETH Address</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <SiEthereum />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Dirección del usuario"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Nombre</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <BsPerson />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Nombre del usuario"
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl as="fieldset">
                    <FormLabel as="legend">Tipo de usuario</FormLabel>
                    <RadioGroup
                      onChange={e => setTypeVal(parseInt(e))}
                      value={typeVal}
                    >
                      <Stack spacing="24px" direction={"row"}>
                        <Radio value={0}>Productor</Radio>
                        <Radio value={1}>Distribuidor</Radio>
                        <Radio value={2}>Farmacia</Radio>
                      </Stack>
                    </RadioGroup>
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
