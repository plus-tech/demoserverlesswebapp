#
# DemoCartLambda

import json
import boto3 as bo
import botocore as bc

def handler(event, context):
    print('receiving event')
    print(event)

    if event['queryStringParameters'] is not None:
        dictparam = event['queryStringParameters']
    elif event['body'] is not None:
        dictparam = json.loads(event['body'])
    else:
        dictparam = None
        code = 400
        msg = 'Table is not specified.'

    #
    # Rules for setting body
    # Msg:   Set for any case including exceptional ones
    # Count: Set for GET method, None for other methods
    #        For GET, None if an exception ocurred
    # Items: Set for GET method, None for other methods
    #        For GET, set a list consisting of dictionary members,
    #        None if an exception ocurred
    #
    body = dict()
    body['Msg'] = ''
    body['Count'] = None
    body['Items'] = None

    if event['path'] == '/cart/items':
        #
        # Get all items
        if event['httpMethod'] == 'GET': # dictparam is not None and event['httpMethod'] == 'GET':
            #print('dictparam')
            # print('dictparam: ', dictparam)
            try:
                tablename = 'UserCart'
                cartid = dictparam['cartid']

                client = bo.client('dynamodb')
                response = client.scan(
                    ScanFilter={
                        'cartid':{
                            'AttributeValueList':[
                                {
                                    'S': cartid,
                                },
                            ],
                            'ComparisonOperator': 'EQ'
                        }
                    },
                    TableName = tablename,
                )

                code = 200
                if 'Items' in response.keys():
                    body['Msg'] = "Succeeded"
                    body['Count'] = response['Count']
                    body['Items'] = response['Items']
                else:
                    body['Msg'] = 'Items not found'
                    body['Count'] = 0

            except bc.exceptions.ClientError as e:
                code = 500
                body['Msg'] = str(e)
            except KeyError as e:
                code = 400
                body['Msg'] = 'KeyError exception happened while using key {} to get the value.'.format(str(e))
        #
        # Undefined request
        else:
            code = 400
            body['Msg'] = 'Undefined request.'
    #
    # handler for an item
    elif '/cart/items/' in event['path'] and dictparam is not None:
        #
        # Get an item
        if event['httpMethod'] == 'GET':
            try:
                tablename = 'UserCart'
                cartid = dictparam['cartid']
                productid = dictparam['productid']

                client = bo.client('dynamodb')
                response = client.get_item(
                    Key={
                        'cartid': {
                            'S': cartid,
                        },
                        'productid': {
                            'S': productid,
                        },
                    },
                    TableName = tablename,
                )

                code = 200
                if 'Item' in response.keys():
                    body['Msg'] = 'Succeeded'
                    body['Items'] = [response['Item']]
                    body['Count'] = len(body['Items'])

                else:
                    body['Msg'] = 'Items not found'
                    body['Count'] = 0

            except bc.exceptions.ClientError as e:
                code = 500
                body['Msg'] = str(e)
            except KeyError as e:
                code = 400
                body['Msg'] = 'KeyError exception happened while using key {} to get the value.'.format(str(e))
        #
        # Add or Update an item
        elif event['httpMethod'] == 'POST':
            try:
                tablename = 'UserCart'
                cartid = dictparam['cartid']
                productid = dictparam['productid']
                quantity = dictparam['quantity']

                client = bo.client('dynamodb')
                response = client.put_item(
                    Item={
                        'cartid': {
                            'S': cartid,
                        },
                        'productid': {
                            'S': productid,
                        },
                        'quantity': {
                            'N': quantity,
                        },
                    },
                    ReturnConsumedCapacity='TOTAL',
                    TableName = tablename,
                )

                code = 200
                body['Msg'] = 'Item added'
            except bc.exceptions.ClientError as e:
                code = 500
                body['Msg'] = str(e)
            except KeyError as e:
                code = 400
                body['Msg'] = 'KeyError exception happened while using key {} to get the value.'.format(str(e))
        #
        # Undefined request
        else:
            code = 400
            body['Msg'] = 'Undefined request.'
    else:
        code = 400
        body['Msg'] = 'Undefined path.'

    return {
        'statusCode': code,
        'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(body)
    }
