
import './App.css';
import NewTask from './components/NewTask';
import SignForm from './components/SignForm';
import TodoList from './components/TodoList';
import User from './components/User';

function App() {
  return (
    <div className="App">
      <SignForm />
      <User />
      <div className="main">
        <NewTask />
        <TodoList />
      </div>
    </div>
  );
}

export default App;
