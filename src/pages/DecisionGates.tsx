import { useState } from 'react';

// Each decision gate is an either/or choice that steers the recipe.
type Gate = {
  key: string;
  label: string;
  options: [string, string];
};

const decisionGates: Gate[] = [
  { key: 'temperature', label: 'Temperature', options: ['Hot', 'Cold'] },
  { key: 'flavor', label: 'Flavor', options: ['Sweet', 'Savory'] },
  { key: 'complexity', label: 'Complexity', options: ['Simple', 'Elaborate'] },
  { key: 'time', label: 'Time', options: ['Quick', 'Slow-cooked'] }
];

type DecisionGatesProps = {
  onNavigateHome?: () => void;
};

function DecisionGates({ onNavigateHome }: DecisionGatesProps) {
  // Tracks which side of each gate the user picked, e.g. { temperature: 'Hot' }
  const [gates, setGates] = useState<Record<string, string>>({});

  const pickGate = (key: string, choice: string) => {
    setGates((prev) =>
      // Clicking the already-selected option turns it off again.
      prev[key] === choice ? { ...prev, [key]: '' } : { ...prev, [key]: choice }
    );
  };

  const summary = decisionGates
    .map((gate) => gates[gate.key] && `${gate.label}: ${gates[gate.key]}`)
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="fridge-page">
      <header className="fridge-header">
        <div className="fridge-header-content">
          <div>
            <h1>🍳 Decision gates</h1>
            <p>Steer your recipe by choosing a side. Click an option again to clear it.</p>
          </div>
          {onNavigateHome && (
            <button className="btn-back-home" onClick={onNavigateHome}>
              ← Back to home
            </button>
          )}
        </div>
      </header>

      <main className="fridge-main">
        <section className="gates-section">
          <div className="card">
            {decisionGates.map((gate) => (
              <div className="gate-row" key={gate.key}>
                <span className="gate-label">{gate.label}</span>
                <div className="gate-options">
                  {gate.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={gates[gate.key] === option ? 'gate-btn active' : 'gate-btn'}
                      onClick={() => pickGate(gate.key, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="gate-summary">
            <h2>Your choices</h2>
            <p>{summary || 'No preferences selected yet.'}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DecisionGates;
