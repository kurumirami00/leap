import { useContext, useState } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import Register from './components/Register.jsx';

function App() {
  const { token } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="page-container">
      {!token ? (
        isLoginView ? (
          <Login switchToRegister={() => setIsLoginView(false)} />
        ) : (
          <Register switchToLogin={() => setIsLoginView(true)} />
        )
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
