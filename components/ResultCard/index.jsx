"use client"
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  StackDivider,
  Stack,
  Box,
} from "@chakra-ui/react"

export const ResultCard = ({ medID, registerBy, details, isValid }) => (
  <Card>
    <CardHeader>
      <Heading size="md">{`Medicamento ${medID}`}</Heading>
    </CardHeader>

    <CardBody>
      <Stack divider={<StackDivider />} spacing="4">
        <Box>
          <Heading size="xs" textTransform="uppercase">
            Registrado por
          </Heading>
          <Text pt="2" fontSize="sm">
            {registerBy}
          </Text>
        </Box>
        <Box>
          <Heading size="xs" textTransform="uppercase">
            Detalles
          </Heading>
          <Text pt="2" fontSize="sm">
            {details}
          </Text>
        </Box>
        <Box>
          <Heading size="xs" textTransform="uppercase">
            Verificado
          </Heading>
          <Text pt="2" fontSize="sm">
            {isValid ? "SI" : "NO"}
          </Text>
        </Box>
      </Stack>
    </CardBody>
  </Card>
)
