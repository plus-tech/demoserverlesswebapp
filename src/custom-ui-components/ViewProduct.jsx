import React, { Component, useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';

import {
  Heading,
  Button,
  Flex,
  Grid,
  Card,
  Collection,
  Text,
  useTheme,
  View,
  Badge,
  Image,
  useAuthenticator,
  Alert,
} from '@aws-amplify/ui-react';

import {
  GetProduct,
  AddCartItem,
  GetCartItem,
} from "../service/ApiServices";

import { useToast } from '@chakra-ui/react';

const ViewProduct = () => {
    const { tokens } = useTheme();
    const toast = useToast();

    const [products, setProducts] = useState(null);

    useEffect(() => {
      GetProduct().then(response => {
        setProducts(response);
      })
    }, [])

    return (
      <Collection
        items={products}
        type="list"
        direction="row"
        gap="20px"
        wrap="wrap"
      >
        {(item, index) => (
          <View key={index}
            backgroundColor={tokens.colors.background.secondary}
            padding={tokens.space.medium}
          >
            {/* <style>{metacss}</style>*/}
            <Card key={index}
               borderRadius="medium"
               maxWidth="20rem"
               maxHeight="30rem"
               variation="outlined"
               className="custom-card-class"
              >
              <Flex direction="column" alignItems="flex-start">
                <Image
                  alt="Road to milford sound"
                  src= {item.imgurl}
                />
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  gap={tokens.space.xs}
                >
                  <Flex>
                    <Badge size="small" variation="info">
                      {item.badges[0]}
                    </Badge>
                    <Badge size="small" variation="success">
                      {item.badges[1]}
                    </Badge>
                  </Flex>

                  <Heading level={5}>
                    {item.name}
                  </Heading>

                  <Text as="span" className="styled-text"> {item.desctext} </Text>

                </Flex>
                <Button variation="primary"
                  onClick={() => {AddCartItem(item);
                    let msg = '"' + item.name + '"'  + " has been added to your cart";
                    toast({description: msg, status: 'info', duration: 3000, isClosable: true,})}
                  } isFullWidth>
                Add to cart
                </Button>
              </Flex>
            </Card>
          </View>
        )}
      </Collection>
    );
}

export { ViewProduct };
