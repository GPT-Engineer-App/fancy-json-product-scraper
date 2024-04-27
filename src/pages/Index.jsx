import React, { useState, useEffect } from "react";
import { Box, Button, Input, VStack, Text, List, ListItem, Heading, useToast, Container } from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";

const Index = () => {
  const [startNumber, setStartNumber] = useState("");
  const [validProducts, setValidProducts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const storedProducts = localStorage.getItem("validProducts");
    if (storedProducts) {
      setValidProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleInputChange = (event) => {
    setStartNumber(event.target.value);
  };

  const fetchProduct = async (articleNumber) => {
    const url = `https://www.lindab.no/article/${articleNumber}`;
    try {
      const response = await fetch(url);
      if (response.ok) {
        // Simulating a valid product check
        return url;
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    }
    return null;
  };

  const handleSearch = async () => {
    if (isNaN(startNumber) || startNumber < 950 || startNumber > 1000000) {
      toast({
        title: "Invalid input",
        description: "Please enter a number between 950 and 1,000,000.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newValidProducts = [...validProducts];
    for (let i = parseInt(startNumber); i <= 1000000; i++) {
      if (!newValidProducts.includes(i)) {
        const productUrl = await fetchProduct(i);
        if (productUrl) {
          newValidProducts.push(productUrl);
          localStorage.setItem("validProducts", JSON.stringify(newValidProducts));
          setValidProducts(newValidProducts);
        }
      }
    }
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={4}>
        <Heading as="h1" size="xl" color="blue.600">
          Lindab Product Validator
        </Heading>
        <Text>Enter a starting article number to validate Lindab products:</Text>
        <Input placeholder="Start from article number..." value={startNumber} onChange={handleInputChange} color="blue.500" />
        <Button leftIcon={<FaSearch />} colorScheme="blue" onClick={handleSearch}>
          Start Search
        </Button>
        <Box w="full" p={4} bg="blue.50" borderRadius="md">
          <Text fontWeight="bold">Valid Products:</Text>
          <List spacing={2}>
            {validProducts.map((url, index) => (
              <ListItem key={index} color="blue.800">
                {url}
              </ListItem>
            ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
