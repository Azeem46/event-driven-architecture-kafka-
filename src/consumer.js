// src/consumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const topic = process.env.KAFKA_TOPIC || 'photo-events';
const groupId = process.env.KAFKA_GROUP || 'photo-services';

const kafka = new Kafka({ clientId: 'photo-consumer', brokers });
const consumer = kafka.consumer({ groupId });

(async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  console.log(`📥 Consumer subscribed to "${topic}". Waiting for messages...`);
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        console.log(`\n---\nReceived event (partition ${partition}):`, payload);
        // TODO: call compress/tag/save services here (or dispatch to other microservices)
      } catch (err) {
        console.error('Failed to process message:', err);
      }
    }
  });
})();
