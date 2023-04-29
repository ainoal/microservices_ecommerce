const amqp = require('amqplib');

const connect = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    console.log('Connected to RabbitMQ server');
    await channel.close();
    await connection.close();
  } catch (err) {
    console.error(err);
  }
};

connect();
