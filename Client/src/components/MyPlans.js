import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import host from '../lib/serverConfig';
import './MyPlans.css';
import TopNav from './TopNav';
import Helmet from 'react-helmet';
import { IoAddOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';

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
                <Link to='/new' className='homePortalLink'>
                    <div className='plansCol plansPageAddPlanBtn'>
                        <IoAddOutline />
                    </div>
                </Link>
            </div>
        );
    }

    return (
        <div className='MyPlansPage'>
            <Helmet>
                <title>Project Plans</title>
                <meta name="description" content="Project plans that've been created" />
            </Helmet>
            <TopNav />
            <div className='MyPlansMain'>
                <div className='myPlansPageTitle'>My Projects</div>
                {!isLoading && renderPlans()}
            </div>
        </div>
    );
}

export default withRouter(MyPlans);