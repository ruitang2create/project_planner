const express = require('express');
const router = express.Router();
const pool = require('../lib/dbpool');

// INSERT posted new plan into DB.plans
router.post('/', (req, res) => {
  console.log('Incoming post request...');
  const { name, description, vision } = req.body;
  console.log(name, description, vision);
  const dateline = Math.floor(new Date().getTime() / 1000);
  if (name && description && vision) {
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
        let queryStatement = `INSERT INTO plans (name, description, vision, create_date) VALUES ('${name}', '${description}', '${vision}',${dateline});`;
        queryStatement += `SELECT LAST_INSERT_ID();`;
        connection.query(queryStatement, (insertErr, insertData) => {
          if (insertErr) {
            console.log('failed at insertion into plans table, err: ' + err);
            res.json({
              success: false,
              err: err,
            });
            connection.destroy();
          } else {
            const pid = (insertData[1][0]['LAST_INSERT_ID()']);
            console.log('Plan ' + pid + ' inserted...');
            res.json({
              success: true,
              pid: pid,
            });
          }
        });
      }
    });
  }
});

// Update the description and vision statement of a plan in DB.plans
router.put('/:pid', (req, res) => {
  console.log('Incoming put request...');
  const pid = req.params.pid;
  const { description, vision } = req.body;
  console.log(description, vision);
  if (description && vision) {
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
              let queryStatement = `UPDATE plans SET description='${description}', vision='${vision}' WHERE pid=${pid};`;
              console.log('New attempt: \n' + queryStatement);
              connection.query(queryStatement, (updateErr, updateData) => {
                  if (updateErr) {
                      console.log('failed to updat plan' + pid + ', err: ' + err);
                      res.json({
                          success: false,
                          err: err,
                      });
                      connection.destroy();
                  } else {
                      console.log('Update feedback: ' + JSON.stringify(updateData));
                      console.log('Plan' + pid + ' updated...');
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

// Fetch all plans from DB.plans
router.get('/', (req, res) => {
  console.log('Incoming get request for all plans...');
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
      let queryStatement = `SELECT * FROM plans;`;
      connection.query(queryStatement, (selectErr, selectData) => {
        if (selectErr) {
          console.log('failed at selecting all plans from plans table, err: ' + err);
          res.json({
            success: false,
            err: err,
          });
          connection.destroy();
        } else {
          const plansData = selectData;
          console.log('Retrieved Plans: ' + plansData);
          res.json({
            success: true,
            plans: plansData,
          });
          connection.destroy();
        }
      });
    }
  });
});


module.exports = router;
