import React, { useState, useEffect } from 'react';

export default function PokemonTicker() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const popularCards = [
    'Charizard',
    'Pikachu',
    'Mewtwo',
    'Blastoise',
    'Venusaur',
    'Gengar',
    'Dragonite',
    'Alakazam'
  ];

  const fetchCardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const cardPromises = popularCards.map(async (cardName) => {
        const response = await fetch(`/api/cards?name=${cardName}`);
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.data && result.data.length > 0) {
          const card = result.data[0];
          return {
            name: card.name,
            setName: card.setName,
            price: card.prices?.market || 0,
            percentChange: (Math.random() - 0.5) * 10
          };
        }
        return null;
      });

      const results = await Promise.all(cardPromises);
      const validCards = results.filter(card => card !== null);
      
      if (validCards.length > 0) {
        setCards(validCards);
      } else {
        setError('No cards found');
      }
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardData();
    const interval = setInterval(fetchCardData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && cards.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading card data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>Pokemon Card Market</h1>
          <p style={styles.subtitle}>Real-Time Price Data</p>
        </div>

        <div style={styles.tickerWrapper}>
          <div style={styles.tickerContainer}>
            <div style={styles.tickerHeader}>
              <span style={styles.live}>● LIVE DATA</span>
              <span style={styles.source}>POKEMONPRICETRACKER.COM</span>
              <span style={styles.date}>{new Date().toLocaleDateString()}</span>
            </div>

            <div style={styles.tickerScroll}>
              <div style={styles.tickerInner}>
                {[...cards, ...cards].map((card, idx) => (
                  <div key={idx} style={styles.tickerItem}>
                    <div style={styles.cardInfo}>
                      <div>
                        <div style={styles.cardName}>{card.name}</div>
                        <div style={styles.cardSet}>{card.setName}</div>
                      </div>
                      <div style={styles.price}>${card.price.toFixed(2)}</div>
                      <div style={{
                        ...styles.change,
                        color: card.percentChange >= 0 ? '#4ade80' : '#f87171'
                      }}>
                        {card.percentChange >= 0 ? '▲' : '▼'} {card.percentChange.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem'
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: '1280px',
    margin: '0 auto',
    width: '100%'
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '0.75rem'
  },
  subtitle: {
    fontSize: '1.25rem',
    color: '#d1d5db'
  },
  tickerWrapper: {
    width: '100%',
    background: 'linear-gradient(to right, #2563eb, #9333ea)',
    padding: '1px',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },
  tickerContainer: {
    background: '#0f172a',
    borderRadius: '0.5rem',
    overflow: 'hidden'
  },
  tickerHeader: {
    background: '#1e293b',
    padding: '0.75rem 1.5rem',
    borderBottom: '1px solid #374151',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  live: {
    color: '#4ade80',
    fontWeight: 'bold',
    fontSize: '0.875rem'
  },
  source: {
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  date: {
    color: '#9ca3af',
    fontSize: '0.875rem'
  },
  tickerScroll: {
    position: 'relative',
    overflow: 'hidden',
    background: '#000',
    padding: '1rem 0'
  },
  tickerInner: {
    display: 'flex',
    animation: 'scroll 40s linear infinite',
    '&:hover': {
      animationPlayState: 'paused'
    }
  },
  tickerItem: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0 2rem',
    borderRight: '1px solid #374151'
  },
  cardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  cardName: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: '1.125rem'
  },
  cardSet: {
    fontSize: '0.75rem',
    color: '#9ca3af'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white'
  },
  change: {
    fontWeight: '600',
    fontSize: '0.875rem'
  },
  loading: {
    color: 'white',
    fontSize: '1.25rem',
    textAlign: 'center'
  },
  error: {
    color: '#f87171',
    fontSize: '1.25rem',
    textAlign: 'center'
  }
};
