import './App.css';
import TasksComponent from './modules/container';

function App() {
  return (
    <div id="root">
      <header className="animate-in" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <p style={{ fontSize: '1.2rem', opacity: 0.6 }}>
          Organize your life, one task at a time.
        </p>
      </header>
      <TasksComponent />
    </div>
  );
}

export default App;
