import './App.css';
import TasksComponent from './modules/container';

function App() {
  return (
    <div style={{padding:20}}>
      <h1 style={{textAlign:'center'}}>Todo App</h1>
      <TasksComponent />
    </div>
  );
}

export default App;
