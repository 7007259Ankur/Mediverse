import React from 'react'
import { Box, VStack, HStack, Text, Button, Badge, Icon, Divider } from "@chakra-ui/react"
import { FaCheckCircle } from 'react-icons/fa'

const Card = ({ 
  planName, 
  amount, 
  icon, 
  features, 
  bgGradient, 
  borderColor, 
  iconColor,
  buttonColor,
  checkoutHandler,
  popular = false 
}) => {
  return (
    <VStack
      bg="white"
      borderRadius="20px"
      border="2px solid"
      borderColor={borderColor}
      boxShadow="xl"
      p={8}
      spacing={6}
      position="relative"
      maxW="350px"
      w="full"
      bgGradient={bgGradient}
      transform="scale(1)"
      transition="all 0.3s ease"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "2xl"
      }}
    >
      {popular && (
        <Badge
          position="absolute"
          top="-10px"
          right="20px"
          colorScheme="orange"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
        >
          POPULAR
        </Badge>
      )}
      
      <VStack spacing={3}>
        <Box
          p={4}
          borderRadius="full"
          bg={iconColor}
          color="white"
          fontSize="2xl"
        >
          <Icon as={icon} />
        </Box>
        
        <Text fontSize="2xl" fontWeight="bold" color="gray.700">
          {planName} Plan
        </Text>
        
        <HStack spacing={1} alignItems="baseline">
          <Text fontSize="4xl" fontWeight="bold" color="gray.800">
            ₹{amount}
          </Text>
          <Text color="gray.600" fontSize="lg">
            /month
          </Text>
        </HStack>
      </VStack>

      <Divider borderColor="gray.300" />

      <VStack spacing={4} w="full">
        <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
          AI Health Monitoring Features:
        </Text>
        
        {features.map((feature, index) => (
          <HStack key={index} w="full" spacing={3}>
            <Icon as={FaCheckCircle} color="green.500" />
            <HStack spacing={2}>
              <Icon as={feature.icon} color={feature.color} />
              <Text color="gray.700" fontWeight="medium">
                {feature.name} Monitoring
              </Text>
            </HStack>
          </HStack>
        ))}
      </VStack>

      <Button
        onClick={() => checkoutHandler(amount)}
        size="lg"
        w="full"
        py={6}
        fontSize="lg"
        fontWeight="bold"
        borderRadius="full"
        bg={buttonColor}
        color="white"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "lg"
        }}
        transition="all 0.3s ease"
      >
        Subscribe Now
      </Button>
    </VStack>
  )
}

export default Card