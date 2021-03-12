import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/Home';
import NewPlan from './components/NewPlan';
import MyPlans from './components/MyPlans';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home 
            username={'Rui Tang'}
          />
        </Route>
        <Route path='/new' exact>
          <NewPlan />
        </Route>
        <Route path='/myplans' exact>
          <MyPlans />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
