import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/Home';
import NewPlan from './components/NewPlan';
import MyPlans from './components/MyPlans';
import Plan from './components/Plan';

function App() {
  const [planPid, setPlanPid] = useState(-1);
  const [planName, setPlanName] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planVision, setPlanVision] = useState('');
  const [planDate, setPlanDate] = useState(new Date().getTime());

  const planPageSetter = (pid, name, desc, vision, date) => {
    setPlanPid(pid);
    setPlanName(name);
    setPlanDesc(desc);
    setPlanVision(vision);
    setPlanDate(date);
  }

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
          <MyPlans
            planPageSetter={planPageSetter}
          />
        </Route>
        <Route path='/plan' exact>
          <Plan
            pid={planPid}
            name={planName}
            desc={planDesc}
            vision={planVision}
            date={planDate}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
