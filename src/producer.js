// src/producer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const topic = process.env.KAFKA_TOPIC || 'photo-events';

const kafka = new Kafka({ clientId: 'photo-producer', brokers });
const producer = kafka.producer();

(async () => {
  await producer.connect();
  const message = {
    event: 'PhotoUploaded',
    file: `photo-${Date.now()}.jpg`,
    meta: { uploadedBy: 'user123' },
    timestamp: new Date().toISOString()
  };

  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }]
  });

  console.log('📤 Sent event:', message);
  await producer.disconnect();
})();
