import { useNavigate } from 'react-router-dom';

export default function StationCreatePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 40 }}>
      <button onClick={() => navigate('/stations')}>← Retour</button>
      <h1>Créer une nouvelle station</h1>
      <p>Cette page sera complétée prochainement (formulaire).</p>
    </div>
  );
}