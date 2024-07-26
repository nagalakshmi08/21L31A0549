const axios = require('axios');
const express = require('express');

const app = express();
const TIMEOUT = 500; 
const WINDOW_SIZE = 10;
const PORT = 9876;

let storage = [];

const CREDENTIALS = {
    "companyName": "goMart",
    "clientID": "c86b813f-0762-405a-b92f-18fc25260b88",
    "clientSecret": "AtthmYkoLasChKjA",
    "ownerName": "Rahul",
    "ownerEmail": "21l31a0549@vignaniit.edu.in",
    "rollNo": "21L31A0549"
};

let accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxOTcxMTU1LCJpYXQiOjE3MjE5NzA4NTUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM4NmI4MTNmLTA3NjItNDA1YS1iOTJmLTE4ZmMyNTI2MGI4OCIsInN1YiI6IjIxbDMxYTA1NDlAdmlnbmFuaWl0LmVkdS5pbiJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiYzg2YjgxM2YtMDc2Mi00MDVhLWI5MmYtMThmYzI1MjYwYjg4IiwiY2xpZW50U2VjcmV0IjoiQXR0aG1Za29MYXNDaEtqQSIsIm93bmVyTmFtZSI6IlJhaHVsIiwib3duZXJFbWFpbCI6IjIxbDMxYTA1NDlAdmlnbmFuaWl0LmVkdS5pbiIsInJvbGxObyI6IjIxTDMxQTA1NDkifQ.vH4O5XDWmbVltrk0SfhjWGASYW18jg1zKBE5CnisjTA";

const apiEndPoints = {
    p: 'http://20.244.56.144/test/primes',
    f: 'http://20.244.56.144/test/fibo',
    e: 'http://20.244.56.144/test/even',
    r: 'http://20.244.56.144/test/rand'
};

const getAccessToken = async () => {
    try {
        const response = await axios.post('http://20.244.56.144/test/auth', {
            companyName: CREDENTIALS.companyName,
            clientID: CREDENTIALS.clientID,
            clientSecret: CREDENTIALS.clientSecret,
            ownerName: CREDENTIALS.ownerName,
            ownerEmail: CREDENTIALS.ownerEmail,
            rollNo: CREDENTIALS.rollNo
        });
        accessToken = response.data.access_token;
    } catch (e) {
        console.error(e.message);
    }
};

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(apiEndPoints[type], {
            headers: { 'Authorization': `Bearer ${accessToken}` },
            timeout: TIMEOUT
        });
        return response.data.numbers;
    } catch (e) {
        console.e(e.message);
        return [];
    }
};

app.get('/numbers/:numberid', async (req, res) => {
    const numberid = req.params.numberid;
    if (!['p', 'f', 'e', 'r'].includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const start = Date.now();
    const newNumbers = await fetchNumbers(numberid);
    const end = Date.now();

    if (end - start > TIMEOUT) {
        return res.status(504).json({ error: 'Timeout exceeded while fetching numbers' });
    }

    const uniqueNewNumbers = [...new Set(newNumbers)];

    const windowPrevState = [...storage];

    uniqueNewNumbers.forEach(number => {
        if (!storage.includes(number)) {
            if (storage.length >= WINDOW_SIZE) {
                storage.shift(); 
            }
            storage.push(number);
        }
    });

    const windowCurrState = [...storage];
    const avg = (storage.length === 0) ? 0 : storage.reduce((a, b) => a + b, 0) / storage.length;

    res.json({
        windowPrevState,
        windowCurrState,
        numbers: uniqueNewNumbers,
        avg: avg.toFixed(2)
    });
});

app.listen(PORT, async () => {
    await getAccessToken();
    console.log(`Server is running on http://localhost:${PORT}`);
});
