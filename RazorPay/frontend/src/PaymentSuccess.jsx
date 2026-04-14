import { Box, Heading, Text, VStack, Badge, Center } from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchQuery] = useSearchParams();
  const accessCode = searchQuery.get("accessCode") || searchQuery.get("reference");

  return (
    <Box>
      <VStack h="100vh" justifyContent="center" spacing={6} px={4}>
        <Heading textTransform="uppercase" color="teal.600" size="2xl">
          Order Successful
        </Heading>

        <Text fontSize="lg" color="gray.600">
          Thank you for your payment. Here is your access code:
        </Text>

        <Box
          p={4}
          border="2px dashed teal"
          borderRadius="md"
          fontSize="2xl"
          fontWeight="bold"
          color="teal.700"
          letterSpacing="wider"
          bg="teal.50"
          textAlign="center"
          w="fit-content"
        >
          {accessCode || "Not Found"}
        </Box>

        <Badge colorScheme="teal" fontSize="md" p={2} borderRadius="md">
          Keep this code safe for accessing AI Predictor
        </Badge>
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
