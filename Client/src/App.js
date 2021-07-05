import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './components/Home';
import NewPlan from './components/NewPlan';
import MyPlans from './components/MyPlans';
import Plan from './components/Plan';
import Axios from 'axios';
import serverUrl from './lib/serverInfo';

function App() {
  const [planPid, setPlanPid] = useState(-1);
  const [planName, setPlanName] = useState('');
  const [planDesc, setPlanDesc] = useState('');
  const [planVision, setPlanVision] = useState('');
  const [planDate, setPlanDate] = useState(new Date().getTime());
  const [toUpdatePlan, setToUpdatePlan] = useState(false);

  const planUpdater = () => {
    console.log('Sending request to update plan...');
    const apiUrl = `${serverUrl}/plans/${planPid}`;
    Axios.put(apiUrl, {
      description: planDesc,
      vision: planVision,
    }).then(res => {
      if (res.data.success) {
        console.log('Plan updated!');
        setToUpdatePlan(false);
      } else {
        console.log('Update failed!');
        console.log('Plan update err: ' + res.data.err);
        setToUpdatePlan(false);
      }
    }).catch(err => {
      console.log('Axios PUT request err:' + err);
    });
  }

  useEffect(() => {
    if(toUpdatePlan) {
      planUpdater();
    }
  }, [toUpdatePlan]);

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
            descSetter={setPlanDesc}
            visionSetter={setPlanVision}
            updateWatcher={setToUpdatePlan}
          />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
