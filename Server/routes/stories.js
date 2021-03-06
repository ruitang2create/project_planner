const express = require('express');
const router = express.Router();
const pool = require('../lib/dbpool');

// INSERT posted new user story into DB.stories
router.post('/:pid', (req, res) => {
    console.log('Incoming post request...');
    const pid = req.params.pid;
    const { title, content, priority, hours_cost, finished } = req.body;
    console.log(title, content, priority, hours_cost, finished, pid)
    if (title && content) {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Connection failed...');
                console.log(err);
                res.json({
                    success: false,
                    err: err,
                });
            } else {
                console.log('Connection succeeded...');
                console.log(pool._allConnections.length);
                let queryStatement = `INSERT INTO stories (pid, title, content, priority, hours_cost, finished) VALUES (${pid}, "${title}", "${content}", ${priority}, ${hours_cost}, ${finished});`;
                queryStatement += `SELECT LAST_INSERT_ID();`;
                connection.query(queryStatement, (insertErr, insertData) => {
                    if (insertErr) {
                        console.log('failed at insertion into stories table, err: ' + insertErr);
                        res.json({
                            success: false,
                            err: insertErr,
                        });
                        connection.destroy();
                    } else {
                        const sid = (insertData[1][0]['LAST_INSERT_ID()']);
                        console.log('Stories ' + sid + ' inserted...');
                        res.json({
                            success: true,
                            sid: sid,
                        });
                        connection.destroy();
                    }
                });
            }
        });
    }
});

// Update an user story in DB.stories
router.put('/:sid', (req, res) => {
    console.log('Incoming put request...');
    const sid = req.params.sid;
    const { title, content, priority, hours_cost, finished } = req.body;
    console.log(title, content, priority, hours_cost, finished, sid)
    if (title && content) {
        pool.getConnection((err, connection) => {
            if (err) {
                console.log('Connection failed...');
                console.log(err);
                res.json({
                    success: false,
                    err: err,
                });
            } else {
                console.log('Connection succeeded...');
                console.log(pool._allConnections.length);
                let queryStatement = `UPDATE stories SET title="${title}", content="${content}", priority=${priority}, hours_cost=${hours_cost}, finished=${finished} WHERE sid=${sid};`;
                console.log('New attempt: \n' + queryStatement);
                connection.query(queryStatement, (updateErr, updateData) => {
                    if (updateErr) {
                        console.log('failed to updat story' + sid + ', err: ' + updateErr);
                        res.json({
                            success: false,
                            err: updateErr,
                        });
                        connection.destroy();
                    } else {
                        console.log('Update feedback: ' + JSON.stringify(updateData));
                        console.log('Story' + sid + ' updated...');
                        res.json({
                            success: true,
                        });
                        connection.destroy();
                    }
                });
            }
        });
    }
});

// Delete story with given sid from DB.stories
router.delete('/:sid', (req, res) => {
    const sid = req.params.sid;
    console.log('Incoming delete request for story' + sid + '...');
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Connection failed...\nError: ' + err);
            res.json({
                success: false,
                err: err,
            });
        } else {
            console.log('Connection succeeded...');
            console.log(pool._allConnections.length);
            let queryStatement = `DELETE FROM stories WHERE sid=${sid};`;
            connection.query(queryStatement, (deleteErr, deleteData) => {
                if (deleteErr) {
                    console.log('failed at deleting target story from stories table, err: ' + deleteErr);
                    res.json({
                        success: false,
                        err: deleteErr,
                    });
                    connection.destroy();
                } else {
                    console.log(`Story${sid}: deleted...`);
                    res.json({
                        success: true,
                    });
                    connection.destroy();
                }
            });
        }
    });
});

// Delete story with given sid from DB.stories
router.delete('/plan/:pid', (req, res) => {
    const pid = req.params.pid;
    console.log('Incoming delete request for stories of plan' + pid + '...');
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Connection failed...\nError: ' + err);
            res.json({
                success: false,
                err: err,
            });
        } else {
            console.log('Connection succeeded...');
            console.log(pool._allConnections.length);
            let queryStatement = `DELETE FROM stories WHERE pid=${pid};`;
            connection.query(queryStatement, (deleteErr, deleteData) => {
                if (deleteErr) {
                    console.log('failed at deleting target stories from stories table, err: ' + deleteErr);
                    res.json({
                        success: false,
                        err: deleteErr,
                    });
                    connection.destroy();
                } else {
                    console.log(`Stories of plan${pid}: deleted...`);
                    res.json({
                        success: true,
                    });
                    connection.destroy();
                }
            });
        }
    });
});

// Fetch all stories with given pid from DB.stories
router.get('/:pid', (req, res) => {
    const pid = req.params.pid;
    console.log('Incoming get request for all stories of project' + pid + '...');
    pool.getConnection((err, connection) => {
        if (err) {
            console.log('Connection failed...');
            console.log(err);
            res.json({
                success: false,
                err: err,
            });
        } else {
            console.log('Connection succeeded...');
            console.log(pool._allConnections.length);
            let queryStatement = `SELECT * FROM stories where pid=${pid} ORDER BY priority DESC;`;
            connection.query(queryStatement, (selectErr, selectData) => {
                if (selectErr) {
                    console.log('failed to select all stories of project' + pid + 'from stories table, err: ' + selectErr);
                    res.json({
                        success: false,
                        err: selectErr,
                    });
                    connection.destroy();
                } else {
                    const storiesData = selectData;
                    console.log('Retrieved Stories: ' + storiesData);
                    res.json({
                        success: true,
                        stories: storiesData,
                    });
                    connection.destroy();
                }
            });
        }
    });
});


module.exports = router;
