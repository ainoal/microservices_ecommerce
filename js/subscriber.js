const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  // Create channel and start consuming messages
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    const exchange = 'order_created';
    // Declare the exchange
    channel.assertExchange(exchange, 'fanout', {
      durable: false
    });

    // Create a queue for this service
    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      // Bind the queue to the exchange
      channel.bindQueue(q.queue, exchange, '');

      // Consume the messages
      channel.consume(q.queue, function(msg) {
        if (msg.content) {
          console.log("Received Order Created event: %s", msg.content.toString());
        }
      }, {
        noAck: true
      });
    });
  });
});
