import websocket
import json
from graphql import build_ast_schema, parse, print_ast, subscribe

GRAPHQL_WS_URL = 'ws://localhost:9000/graphql'

# Create the websocket connection
ws = create_connection(GRAPHQL_WS_URL)

# Construct the subscription query
subscription = '''
subscription {
  orderCreated {
    orderID
    status
    cart
  }
}
'''

# Construct the JSON message to send
message = json.dumps({
  "type": "start",
  "id": "1",
  "payload": {
    "query": subscription,
    "variables": {}
  }
})

# Send the subscription message over the websocket
ws.send(message)

# Receive and print incoming messages
while True:
  result = ws.recv()
  print(result)
