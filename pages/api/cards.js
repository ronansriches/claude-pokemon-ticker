// This is your serverless API route (no CORS issues!)
export default async function handler(req, res) {
  const { name } = req.query;
  
  if (!name) {
    return res.status(400).json({ error: 'Card name is required' });
  }

  try {
    const response = await fetch(
      `https://www.pokemonpricetracker.com/api/v2/cards?name=${name}&limit=1`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.POKEMON_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching card data:', error);
    res.status(500).json({ error: error.message });
  }
}
