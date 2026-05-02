export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, amount, description, redirect_url, callback_url } = req.body;

  const BILLPLZ_API_KEY    = process.env.BILLPLZ_API_KEY;
  const BILLPLZ_COLLECTION = process.env.BILLPLZ_COLLECTION_ID;
  const BILLPLZ_BASE = 'https://www.billplz-sandbox.com/api/v3'; // Sandbox

  const credentials = Buffer.from(`${BILLPLZ_API_KEY}:`).toString('base64');

  try {
    const response = await fetch(`${BILLPLZ_BASE}/bills`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type':  'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        collection_id: BILLPLZ_COLLECTION,
        name,
        email,
        phone,
        amount:       String(amount),
        description,
        redirect_url,
        callback_url,
      }),
    });

    const bill = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: bill });
    }

    return res.status(200).json({ url: bill.url });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
