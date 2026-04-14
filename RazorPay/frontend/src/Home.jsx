import React from 'react';
import { Box, Stack, Heading, Text, Button, Flex, Tag, Divider, useColorModeValue } from "@chakra-ui/react";
import axios from "axios";

const SubscriptionCard = ({ 
  title, 
  price, 
  features, 
  popular, 
  checkoutHandler,
  bgColor,
  borderColor
}) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const popularBg = useColorModeValue('teal.500', 'teal.200');
  const popularColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      position="relative"
      bg={cardBg}
      borderRadius="xl"
      boxShadow="xl"
      p={6}
      w="300px"
      borderWidth="2px"
      borderColor={borderColor}
      transition="all 0.3s"
      _hover={{
        transform: 'scale(1.03)',
        boxShadow: '2xl'
      }}
    >
      {popular && (
        <Tag
          position="absolute"
          top={-3}
          right={4}
          bg={popularBg}
          color={popularColor}
          fontWeight="bold"
          fontSize="sm"
          px={3}
          py={1}
          borderRadius="full"
          boxShadow="md"
        >
          MOST POPULAR
        </Tag>
      )}
      
      <Flex direction="column" h="100%">
        <Box flex="1">
          <Heading size="lg" mb={2} color={bgColor}>
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.500" mb={6}>
            AI-powered health monitoring subscription
          </Text>
          
          <Box mb={6}>
            <Text fontSize="4xl" fontWeight="bold">
              ₹{price/100}
              <Text as="span" fontSize="lg" color="gray.500">/month</Text>
            </Text>
          </Box>
          
          <Divider mb={6} />
          
          <Box>
            <Text fontWeight="semibold" mb={3}>Includes:</Text>
            {features.map((feature, index) => (
              <Flex key={index} align="center" mb={2}>
                <Box w="8px" h="8px" borderRadius="full" bg={bgColor} mr={3} />
                <Text>{feature}</Text>
              </Flex>
            ))}
          </Box>
        </Box>
        
        <Button
          mt={8}
          size="lg"
          colorScheme={title.toLowerCase()}
          bg={bgColor}
          _hover={{
            bg: `${bgColor}.600`,
            transform: 'translateY(-2px)'
          }}
          onClick={() => checkoutHandler(price)}
        >
          Subscribe Now
        </Button>
      </Flex>
    </Box>
  );
};

const Home = () => {
  const checkoutHandler = async (amount) => {
    try {
  const { data: { key } } = await axios.get("https://razorpay-backend-nzif.onrender.com/api/getkey");
  
  const { data: { order } } = await axios.post("https://razorpay-backend-nzif.onrender.com/api/checkout", {
    amount
  });

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "AI Health Monitor",
        description: "Health Subscription Plan",
        image: "https://img.icons8.com/color/96/000000/artificial-intelligence.png",
        order_id: order.id,
        callback_url: "https://razorpay-backend-nzif.onrender.com/api/paymentverification",
        prefill: {
          name: "Ankur Gupta",
          email: "user@example.com",
          contact: "9876543210"
        },
        notes: {
          "address": "AI Health Corporate Office"
        },
        theme: {
          "color": "#3182CE"
        }
      };
      
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const goldFeatures = [
    "Liver Health AI Analysis",
    "Sugar Level Monitoring",
    "Mental Wellness Tracking",
    "Basic Health Reports",
    "Weekly Health Insights"
  ];

  const diamondFeatures = [
    "All Gold Features",
    "Heart Health Monitoring",
    "Advanced AI Diagnostics",
    "24/7 Health Support",
    "Personalized Diet Plans",
    "Monthly Doctor Consultation",
    "Priority Customer Service"
  ];

  return (
    <Box minH="100vh" bgGradient="linear(to-br, gray.50, blue.50)" py={20}>
      <Box textAlign="center" mb={16}>
        <Heading size="2xl" mb={4} color="gray.800">
          AI Health Monitoring Plans
        </Heading>
        <Text fontSize="xl" color="gray.600" maxW="2xl" mx="auto">
          Choose the perfect plan for your health monitoring needs with our advanced AI technology
        </Text>
      </Box>
      
      <Flex justify="center" align="center" wrap="wrap" gap={10}>
        <SubscriptionCard
          title="Gold"
          price={2999}
          features={goldFeatures}
          checkoutHandler={checkoutHandler}
          bgColor="yellow.500"
          borderColor="yellow.300"
        />
        
        <SubscriptionCard
          title="Diamond"
          price={5999}
          features={diamondFeatures}
          popular={true}
          checkoutHandler={checkoutHandler}
          bgColor="purple.500"
          borderColor="purple.300"
        />
      </Flex>
      
      <Box textAlign="center" mt={16} px={4}>
        <Text color="gray.500">
          * All plans include secure payment and cancel anytime policy
        </Text>
      </Box>
    </Box>
  );
};

export default Home;