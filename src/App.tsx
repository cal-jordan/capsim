import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import Quiz from './components/Quiz';
import ReportComponent from './components/Report';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container py-5">
          <nav className="mb-4 d-flex justify-content-between align-items-center">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  to="/"
                >
                  Quiz
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  to="/report"
                >
                  Report
                </NavLink>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Quiz />} />
            <Route path="/report" element={<ReportComponent />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
