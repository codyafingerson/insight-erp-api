import Redis from 'ioredis';
import { environment } from './environment';

// Create an ioredis client instance.
const redisClient = new Redis({
    host: environment.redis.host,
    port: environment.redis.port,
    password: environment.redis.password,
});

redisClient.on('connect', () => console.log('Connected to Redis'));
redisClient.on('error', (err) => console.error('Redis error:', err));

export { redisClient };