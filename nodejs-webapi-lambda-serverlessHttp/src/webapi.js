// app.js
import express from 'express';
import axios from 'axios';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const app = express();

// 1. GET /outgoing-http-request
app.get('/outgoing-http-request', async (req, res) => {
  try {
    // Make an HTTP call to aws.amazon.com
    const response = await axios.get('https://aws.amazon.com');
    // Return a portion of the response or just the status
    res.json({
      message: 'Successfully fetched aws.amazon.com',
      status: response.status,
      statusText: response.statusText
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// 2. GET /aws-sdk-call
app.get('/aws-sdk-call', async (req, res) => {
  // Create an S3 client
  const s3 = new S3Client({ region: 'us-east-1' });
  try {
    // Fetch buckets
    const result = await s3.send(new ListBucketsCommand({}));
    const buckets = result.Buckets?.map((b) => b.Name) || [];
    res.json({
      message: 'Buckets listed successfully',
      buckets
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default app;
