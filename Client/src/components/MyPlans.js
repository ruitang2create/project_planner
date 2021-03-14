import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './MyPlans.css';

const PlanThumbnail = withRouter((props) => {
    const clickHandler = () => {
        props.planPageSetter(props.pid, props.name, props.desc, props.vision, props.dateline);
        props.history.push('/plan');
    }

    return (
        <div className="plansCol" key={props.pid} onClick={clickHandler}>
            <div className='planThumbnailContainer'>
                {props.name}
            </div>
        </div>
    );
});

function MyPlans(props) {
    Axios.defaults.withCredentials = true;
    const [isLoading, setIsLoading] = useState(true);
    const [plansList, setPlansList] = useState([]);

    const getPlans = () => {
        console.log('Fetching plans from server...');
        const apiUrl = `${host}/plans`;
        Axios.get(apiUrl)
            .then(res => {
                if (res.data.success) {
                    setPlansList(res.data.plans);
                    setIsLoading(false);
                } else {
                    console.log('Failed to load plans: ' + res.data.err);
                }
            });
    }

    useEffect(() => getPlans(), []);

    const renderPlans = () => {
        // const plansPerRow = 3;
        // const numRows = Math.ceil(plansList.length / plansPerRow);
        // const plansRows = [];
        // for (let i = 0; i < numRows; i++) {
        //     let plansListThisRow = plansList.slice(i * plansPerRow, (i + 1) * plansPerRow);
        //     let plansCols = plansListThisRow.map(plan =>
        //         <div className="plansCol" key={plan.pid}>
        //             <div className='planThumbnailContainer'>
        //                 {plan.name}
        //             </div>
        //         </div>
        //     );
        //     plansRows.push(<div className="plansRow" key={i}>{plansCols}</div>);
        // }
        const plansRows = plansList.map(plan =>
            <PlanThumbnail
                key={plan.pid}
                pid={plan.pid}
                name={plan.name}
                desc={plan.description}
                vision={plan.vision}
                dateline={plan.create_date}
                planPageSetter={props.planPageSetter}
            />
        );
        return (
            <div className='plansListContainer'>
                {plansRows}
            </div>
        );
    }

    return (
        <div className='MyPlansPage'>
            <h1 className='myPlansPageTitle'>My Plans</h1>
            {!isLoading && renderPlans()}
            <div className='plansBackground'></div>
        </div>
    );
}

export default withRouter(MyPlans);