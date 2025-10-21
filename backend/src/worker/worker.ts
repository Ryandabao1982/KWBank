import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import fetch from 'node-fetch';

const connection = new IORedis(process.env.REDIS_URL || 'redis://redis:6379');

const worker = new Worker(
  'imports',
  async (job: Job) => {
    console.log('Processing import job', job.id, job.name, job.data);
    // Example: call python-nlp dedupe endpoint
    const resp = await fetch(
      (process.env.PYTHON_NLP_URL || 'http://python-nlp:8000') + '/dedupe',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        body: JSON.stringify({ importId: job.data.importId }),
      },
    );
    const result = await resp.json();
    console.log('Dedupe result', result);
    // TODO: persist results back to Postgres
  },
  { connection },
);

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err);
});

console.log('Worker started');
