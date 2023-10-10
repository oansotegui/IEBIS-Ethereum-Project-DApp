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

export const FormGetMed = () => {
  const [medID, setMedID] = useState("")
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleClick = async () => {
    setIsLoading(true)
    setResult(null)
    try {
      const med = await readContract({
        address: process.env.NEXT_PUBLIC_CONTRACT,
        abi: ABI_FILE,
        functionName: "medications",
        args: [medID],
      })
      console.dir(med)
      setIsLoading(false)
      if (med[1] === "0x0000000000000000000000000000000000000000") {
        toast({
          title: "ERROR",
          description: "El Medicamento no esta registrado",
          status: "error",
          duration: 4000,
          isClosable: true,
        })
      } else {
        //show info
        setResult({
          id: med[0],
          registeredBy: med[1],
          currentHolder: med[2],
          details: Web3.utils.hexToAscii(med[3]),
          isValid: med[4] ? "SI" : "NO",
        })
      }
    } catch (error) {
      setResult(null)
      setIsLoading(false)
      console.dir(error)
      let errorMsg = "Desconocido"
      if (error?.shortMessage) {
        errorMsg = error.shortMessage
      } else if (error?.cause?.reason) {
        errorMsg = error?.cause?.reason
      }
      toast({
        title: "Error",
        description: errorMsg,
        status: "error",
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const handleChange = e => {
    setResult(null)
    setMedID(e.target.value)
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
              Buscar Medicamento
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
                    <FormLabel>Medicamento ID</FormLabel>

                    <InputGroup>
                      <InputLeftElement>
                        <MdOutlineNumbers />
                      </InputLeftElement>
                      <Input
                        type="text"
                        name="medID"
                        value={medID}
                        w={"60vw"}
                        minW={"350px"}
                        maxW={"500px"}
                        onChange={handleChange}
                        placeholder="ID del Medicamento"
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
            <Heading size="md">{`Medicamento ${result.id}`}</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Registrado Por
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.registeredBy}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Poseedor Actual
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.currentHolder}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Detalles
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.details}
                </Text>
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Validado
                </Heading>
                <Text pt="2" fontSize="sm">
                  {result?.isValid}
                </Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      )}
    </Flex>
  )
}
