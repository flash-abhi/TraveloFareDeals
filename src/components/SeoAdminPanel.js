import React, { useState } from 'react';

const SeoAdminPanel = () => {
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [seoResult, setSeoResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSEO = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSeoResult('');
    try {
      const response = await fetch('/api/seo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, url })
      });
      const data = await response.json();
      if (data.seo) {
        setSeoResult(data.seo);
      } else {
        setError('No SEO data returned.');
      }
    } catch (err) {
      setError('Error generating SEO: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>AI-Powered SEO Generator</h2>
      <form onSubmit={handleGenerateSEO}>
        <div style={{ marginBottom: 16 }}>
          <label>Page URL:</label><br />
          <input type="text" value={url} onChange={e => setUrl(e.target.value)} style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Page Content:</label><br />
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} required />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 24px' }}>
          {loading ? 'Generating...' : 'Generate SEO'}
        </button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
      {seoResult && (
        <div style={{ marginTop: 24 }}>
          <h3>AI-Generated SEO Data:</h3>
          <pre style={{ background: '#f8f8f8', padding: 16, borderRadius: 4 }}>{seoResult}</pre>
        </div>
      )}
    </div>
  );
};

export default SeoAdminPanel;
