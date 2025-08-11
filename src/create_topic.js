// src/create_topic.js
require('dotenv').config();
const { Kafka } = require('kafkajs');

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const topic = process.env.KAFKA_TOPIC || 'photo-events';

const kafka = new Kafka({ clientId: 'admin-client', brokers });

(async () => {
  const admin = kafka.admin();
  try {
    await admin.connect();
    const topics = await admin.listTopics();
    if (topics.includes(topic)) {
      console.log(`Topic "${topic}" already exists.`);
    } else {
      await admin.createTopics({
        topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
        waitForLeaders: true
      });
      console.log(`Created topic "${topic}".`);
    }
  } catch (err) {
    console.error('Failed to create topic:', err);
    process.exit(1);
  } finally {
    await admin.disconnect();
  }
})();
