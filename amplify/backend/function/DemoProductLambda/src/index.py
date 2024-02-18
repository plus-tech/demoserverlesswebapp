#
# DemoProductLambda

import json
import boto3 as bo
import botocore as bc

def handler(event, context):
    print('Receiving event')
    print(event)

    if event['queryStringParameters'] is not None:
        dictparam = event['queryStringParameters']
    elif event['body'] is not None:
        dictparam = json.loads(event['body'])
    else:
        dictparam = None
        code = 400
        msg = 'Product item is not specified.'

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

    if event['path'] == '/product/items':
        #
        # Get all items
        if event['httpMethod'] == 'GET':
            try:
                # tablename = 'Product'
                tablename = dictparam['table']

                client = bo.client('dynamodb')
                response = client.scan(
                    ExpressionAttributeNames={
                        '#PI': 'productid',
                        '#NM': 'name',
                        '#BG': 'badges',
                        '#DT': 'desctext',
                        '#IU': 'imgurl',
                    },
                    # ExpressionAttributeValues={
                    #     ':a': {
                    #         'S': 'No One You Know',
                    #     },
                    # },
                    # FilterExpression = 'Artist = :a',
                    ProjectionExpression = '#PI, #NM, #BG, #DT, #IU',
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
    elif '/product/items/' in event['path'] and dictparam is not None:
        #
        # Get an item
        if event['httpMethod'] == 'GET':
            try:
                # tablename = 'Product'
                tablename = dictparam['table']
                productid = dictparam['productid']

                client = bo.client('dynamodb')
                response = client.get_item(
                    Key={
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
