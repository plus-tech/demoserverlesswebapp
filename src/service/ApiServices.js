import React, { useState, useEffect, Component } from 'react';
import {
  get,
  post,
} from 'aws-amplify/api';

import { getCurrentUser } from 'aws-amplify/auth';
import { fetchAuthSession } from 'aws-amplify/auth';
import { getUrl } from 'aws-amplify/storage';

/*
Retrieve the current user info
*/
async function currentAuthenticatedUser() {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(`The username: ${username}`);
    console.log(`The userId: ${userId}`);
    console.log(`The signInDetails: ${signInDetails}`);

    return { username, userId, signInDetails };
  } catch (err) {
    console.log(err);
  }
}

/*
Get the URL of a public image that is stored in Amplify Storage
*/
async function getImageurl(imgname){
  const getUrlResult = await getUrl({ key: imgname, });

  return getUrlResult.url.toString();
}

/*
Compare products by the productid
*/
function CompareProduct(a, b){
  if ( a['productid']['S'] > b['productid']['S'] ) {
    return 1;
  }
  else if ( a['productid']['S'] < b['productid']['S'] ) {
    return -1;
  }
  return 0;
}

/*
Get the full list of products from Product table

table name: Product
partition key: productid: String,
name: String,
badges: String Set
desctext: String,
imgurl: String (image file name)
*/
async function GetProduct(){
  const items = [];
  try {
    const restOperation = get({
      apiName: 'DemoSWAApi',
      path: '/product/items',
      options: {
        queryParams: {
          table: "Product"
        }
      }
    })
    const { body }= await restOperation.response;
    const products = await body.json();
    console.log('GetProduct call succeeded: ', products);

    if (products['Count'] != null && products['Count'] > 0) {

      //
      // Sort the array of products by productid
      let arrprod = products['Items']
      arrprod.sort(CompareProduct);

      for ( let [key, prod] of Object.entries(arrprod) ) {
        //
        // get the image's URL
        let imgname = prod['imgurl']['S'];
        const imgurl = await getImageurl(imgname);

        items.push({
          productid: prod['productid']['S'],
          name: prod['name']['S'],
          badges: prod['badges']['SS'],
          desctext: prod['desctext']['S'],
          imgurl: imgurl
        });
      }
    }
  } catch (error) {
    console.log('GetProduct call failed: ', error);
  }

  return items;
}
/*
Get the product info from Product table
productid is unique in Product table, so only one record is returned
for a specific productid.

Example:
queryStringParameters: productid=producta
*/
async function GetProductItem(productid) {
  const item = [];
  try {
    const restOperation = get({
      apiName: 'DemoSWAApi',
      path: '/product/items/',
      options: {
        queryParams: {
          table: "Product",
          productid: productid,
        }
      }
    });
    const {body} = await restOperation.response;
    const products = await body.json();
    console.log('GetProductItem call succeeded: ', products);

    if (products['Count'] != null && products['Count'] > 0) {
        let key, product = products['Items'][0];
        //
        // get the image's URL
        let imgname = product['imgurl']['S'];
        const imgurl = await getImageurl(imgname);

        item.push({
          productid: product['productid']['S'],
          name: product['name']['S'],
          badges: product['badges']['S'],
          desctext: product['desctext']['S'],
          imgurl: imgurl
        });
    }
  } catch (error) {
    console.log('GetProductItem call failed: ', error);
  }
  return item;
}

/*
Fetch booked products from the cart

table name: UserCart
partitionkey: cartid, String
sort key: productid, String
quantity: Number
*/
async function GetCart() {
  const items = [];
  try {
    const { username, userId, signInDetails } = await currentAuthenticatedUser();
    console.log(`GetCart userID: ${userId}`);
    // const userId = 'test';

    const restOperation = get({
      apiName: 'DemoSWAApi',
      path: '/cart/items',
      options: {
        queryParams: {
          table: "UserCart",
          cartid: userId
        }
      }
    });
    const {body} = await restOperation.response;
    const cartitems = await body.json();
    console.log('GetCart call succeeded: ', cartitems);

    /*
    The product data is not included in UserCart table, the below process
    is to fetch product related data from Product table.
    DynamoDB is a Non-SQL database, without supporting table join feature.
    Although we can use HiveQL to join DynamoDB tables, the join doesn't take
    place in DynamoDB.
    https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EMRforDynamoDB.Querying.html
    */
    if (cartitems['Count'] != null && cartitems['Count'] > 0) {
      //
      // Sort cart items by productid
      let arrCartitems = cartitems['Items'];
      arrCartitems.sort(CompareProduct);

      for ( let [key, cartitem] of Object.entries(arrCartitems) ) {

        let cartid = cartitem['cartid']['S'];
        let productid = cartitem['productid']['S'];
        let quantity = cartitem['quantity']['N'];

        let product = await GetProductItem(productid);

        items.push({
          cartid: cartid,
          productid: productid,
          name: product[0]['name'],
          desctext: product[0]['desctext'],
          imgurl: product[0]['imgurl'],
          quantity: quantity
        });
      }
    }
  } catch (error) {
    console.log('GetCart call failed: ', error);
  }

  return items;
}

/*
Get the item from the cart specified by cartid and productid

Example:
queryStringParameters: cartid=test&productid=producta
*/
async function GetCartItem(cartid, productid) {
  const item = [];
  try {
    // const { username, userId, signInDetails } = currentAuthenticatedUser();
    // const userId = 'test';

    const restOperation = get({
      apiName: 'DemoSWAApi',
      path: '/cart/items/',
      options: {
        queryParams: {
          table: "UserCart",
          cartid: cartid,
          productid: productid,
        }
      }
    });
    const {body} = await restOperation.response;
    const cartitems = await body.json();
    console.log('GetCartItem call succeeded: ', cartitems);

    if (cartitems['Count'] != null && cartitems['Count'] > 0) {
      let key, cartitem = cartitems['Items'][0];

      item.push({
        cartid: cartitem['cartid']['S'],
        productid: cartitem['productid']['S'],
        quantity: cartitem['quantity']['N']
      });
    }
  } catch (error) {
    console.log('GetCartItem call failed: ', error);
  }

  return item;
}

/*
Add/update an item in UserCart table
cartid: current user's ID

Example:
body
{
    "table": "UserCart",
    "cartid": userId,
    "productid": "producta",
    "quantity": "1"
}
*/
async function AddCartItem(item) {
  const { username, userId, signInDetails } = await currentAuthenticatedUser();
  // const userId = 'test';

  try {
    console.log('addcartitem:', item)
    console.log(`userID: ${userId}`);

    let quantity = '1';
    const olditem = await GetCartItem(userId, item.productid);
    if (olditem.length > 0) {
      quantity = (parseInt(olditem[0]['quantity'])+1).toString();
    }

    const restOperation = post({
      apiName: 'DemoSWAApi',
      path: '/cart/items/',
      options: {
        body: {
          table: "UserCart",
          cartid: userId,
          productid: item.productid,
          quantity: quantity,
        }
      }
    });
    const {response} = await restOperation.response;
    console.log('AddCartItem call succeeded: ', response);

  } catch (error) {
    console.log('AddCartItem call failed: ', error);
  }
}

export { currentAuthenticatedUser,
  GetProduct, GetProductItem,
  GetCart, AddCartItem, GetCartItem, };
