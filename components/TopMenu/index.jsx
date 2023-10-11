"use client"

import { Box, Flex, useColorModeValue, Image } from "@chakra-ui/react"
import Link from "next/link"

export const TopMenu = ({ isAdmin, isActor }) => {
  return (
    <>
      <Box bg={useColorModeValue("gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>MedProof: Drug Traceability</Box>
          <Flex gap="5" w={"50%"} justify="space-around">
            <Link href="/">Inicio</Link>
            <Link href="/owner">Entidad Reguladora</Link>
            <Link href="/actor">Actores Registrados</Link>
          </Flex>
          <Flex alignItems={"center"}>
            <w3m-button />
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
