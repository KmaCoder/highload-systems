const express = require('express');
const amqp = require('amqplib');

const app = express();
const port = process.env.PORT || 50052;

// RabbitMQ connection parameters from environment variables or defaults
const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const rabbitmqUser = process.env.RABBITMQ_USER || 'guest';
const rabbitmqPass = process.env.RABBITMQ_PASS || 'guest';
const rabbitmqUrl = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}`;
const queueName = 'lightbulb_events';

async function connectToRabbitMQ() {
  try {
    console.log(`Attempting to connect to RabbitMQ at ${rabbitmqHost}...`);
    const connection = await amqp.connect(rabbitmqUrl);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Waiting for messages from queue: ${queueName}`);
    
    // Start consuming messages
    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log('====================================');
        console.log(`Received lightbulb event: ${content.event_type}`);
        console.log('Details:', content.data);
        console.log('====================================');
        
        // Acknowledge that we've processed the message
        channel.ack(msg);
      }
    });

    // Handle connection close
    process.on('SIGINT', async () => {
      console.log('Closing RabbitMQ connection...');
      await channel.close();
      await connection.close();
      process.exit(0);
    });

    return { connection, channel };
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    // Try to reconnect after a delay
    console.log('Attempting to reconnect in 5 seconds...');
    setTimeout(connectToRabbitMQ, 5000);
    return null;
  }
}

// Express routes
app.get('/', (req, res) => {
  res.send('Lightbulb Notification Service is running!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Notification service listening on port ${port}`);
  console.log(`RabbitMQ host: ${rabbitmqHost}`);
  // Connect to RabbitMQ after server starts
  connectToRabbitMQ();
}); 