import React, { Component, useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';

import {
  GetCart,
} from "../service/ApiServices";

import {
  Button,
  Flex,
  Card,
  Collection,
  Text,
  useTheme,
  View,
  Image,
  Accordion,
  useAuthenticator,
} from '@aws-amplify/ui-react';

import {
  FetchCart,
  AddToCart,
} from "../service/ApiServices";


export const TourInfo = ({ tourNumber, tourName, tourCount }) => {
  return (
    <Flex gap="small">
      <View as="div" width="xxl" color="teal.80">
        {tourNumber}
      </View>
      <View width="20rem" align="left">{tourName}</View>
      <View align="left">Quantity:&nbsp;{tourCount}</View>
    </Flex>
  );
};

const ViewCart = () => {
    const { tokens } = useTheme();
    // const items = metacartitems;

    const [products, setProducts] = useState(null);

    useEffect(() => {
      GetCart().then(response => {
        setProducts(response);
      })
    }, [])

    console.log('cartitems: ', products);

    return (
      <Accordion.Container margin={tokens.space.xs}>
        <Collection
          items={products}
          type="list"
          direction="column"
          gap="0px"//{tokens.space.xs}//"small"
          wrap="nowrap"
        >
        {(item, index) => (
         <Accordion.Item value={"item-"+index} key={index} backgroundColor={index%2 == 0? "white":"silver"}>
           <Accordion.Trigger>
             <TourInfo
               tourNumber={"# " + (++index)}
               tourName={item.name}
               tourCount={item.quantity}
             />
             <Accordion.Icon />
           </Accordion.Trigger>
           <Accordion.Content>
            <Card
              borderRadius="medium"
              maxWidth="100%"
              maxHeight="30rem"
              variation="outlined"
             >
               <Flex
                 direction="row"
                 alignItems="flex-start"
                 gap={tokens.space.xs}
               >
                 <Image
                   alt="Road to milford sound"
                   src= {item.imgurl}
                   maxWidth="30%"
                 />
                 <Text as="span" className="styled-text"> {item.desctext}
                 </Text>
               </Flex>
             </Card>
            </Accordion.Content>
           </Accordion.Item>
         )}
        </Collection>
      </Accordion.Container>
    );
}

export { ViewCart };
