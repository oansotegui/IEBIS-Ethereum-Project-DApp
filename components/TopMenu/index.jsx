"use client"

import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"

export const TopMenu = ({ isAdmin, isActor }) => {
  return (
    <>
      <Box bg={useColorModeValue("gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>Logo</Box>
          <Flex gap="5" w={"50%"} justify="space-around">
            <Link href="/">Inicio</Link>
            <Link href="/owner">Owner</Link>
            <Link href="/actor">Actor</Link>
          </Flex>
          <Flex alignItems={"center"}>
            <w3m-button />
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
