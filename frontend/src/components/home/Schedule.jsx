import React from 'react';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
const useStyles = makeStyles({
  margin: {
    marginBottom: '13px'
  },
  color: {
    backgroundColor: 'transparent'
  },
  body: {
    maxHeight: '150px',
    overflow: 'auto'
  },
  title: {
    fontSize: '3rem',
    color: '#ffffff',
    fontFamily: 'Inter',
    fontWeight: 'bold'
  },
  schedule: {
    backgroundColor: 'transparent'
  },
  font: {
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    '&.Mui-selected': {
      color: 'rgba(255, 255, 255, 1)',
      fontWeight: 'bold'
    },
    fontSize: '15px'
  },
  divFont: {
    fontFamily: 'Inter',
    color: 'rgba(255, 255, 255, 1)',
    height: '35px',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  indicator: {
    backgroundColor: 'white'
  },
  selected: {
    color: 'rgba(255, 255, 255, 0.8)'
  }
});
export default function Schedule() {
  const classes = useStyles();
  const [day, setDay] = React.useState('fri');
  const handleChange = (event, newDay) => {
    setDay(newDay);
  };
  return (
    <Box py={2} id="schedule" marginTop={'10rem'}>
      <Typography className={classes.title} variant="h4" gutterBottom>
        Schedule
      </Typography>
      <Typography
        className={classes.divFont}
        style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 'bold', fontStyle: 'italic' }}
      >
        All times in EDT (GMT-4)
      </Typography>

      <TableContainer
        component={Paper}
        style={{ width: '100%', backgroundColor: 'transparent' }}
        align="center"
        sx={{ maxHeight: 440 }}
      >
        <Tabs
          value={day}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          fullWidth={true}
          className={classes.schedule}
          classes={{ indicator: classes.indicator, selected: classes.selected }}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'white'
          }}
          variant="fullWidth"
        >
          <Tab
            label="Fri., Sept 15th"
            value="fri"
            className={classes.font}
            style={{
              textTransform: 'none'
            }}
          />
          <Tab
            label="Sat., Sept 16th"
            value="sat"
            className={classes.font}
            style={{
              textTransform: 'none'
            }}
          />
          <Tab
            label="Sun., Sept 17th"
            value="sun"
            className={classes.font}
            style={{
              textTransform: 'none'
            }}
          />
        </Tabs>
        <Table
          className={classes.table}
          aria-label="simple table"
          style={{ backgroundColor: 'rgba(217, 217, 217, 0.1)' }}
        >
          <TableHead className={classes.schedule}>
            <TableRow>
              <TableCell className={classes.font}>Time</TableCell>
              <TableCell className={classes.font}>Event</TableCell>
              <TableCell className={classes.font}>Location</TableCell>
            </TableRow>
          </TableHead>
          {day === 'fri' && (
            <TableBody className={classes.body}>
              <TableRow className={classes.bodycolor}>
                <TableCell className={classes.font}>6:30 PM</TableCell>
                <TableCell className={classes.font}>Check-in Begins </TableCell>
                <TableCell align="left" className={classes.font}>
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  6:30 PM
                </TableCell>
                <TableCell className={classes.font}>Dinner</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (1st floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:00 PM
                </TableCell>
                <TableCell className={classes.font}>Opening Ceremony</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson 110 */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 PM
                </TableCell>
                <TableCell className={classes.font}>Team Building</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson 203 */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 PM
                </TableCell>
                <TableCell className={classes.font}>
                  {' '}
                  Sponsor Hall Opens & Hacking Begins!
                </TableCell>
                <TableCell width="40%" align="left" className={classes.font}>
                  {/* Hodson Hall */}
                  TBD
                </TableCell>
              </TableRow>
              {/* <TableRow className={classes.font}>
                <TableCell className={classes.font}>10:00 PM - 10:45 PM</TableCell>
                <TableCell className={classes.font}>uCredit Workshop </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow>
              <TableRow className={classes.font}>
                <TableCell className={classes.font}>11:30 PM</TableCell>
                <TableCell className={classes.font}>Midnight Pizza </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall (3rd floor lobby)
                </TableCell>
              </TableRow> */}
            </TableBody>
          )}
          {day === 'sat' && (
            <TableBody className={classes.body}>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 AM
                </TableCell>
                <TableCell className={classes.font}>Breakfast</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (3rd floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  10:00 AM - 11:00 AM
                </TableCell>
                <TableCell className={classes.font}>HopHacks Coding Interview Workshop</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson 316 */}
                  TBD
                </TableCell>
              </TableRow>
              {/* <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  11:00 AM - 11:45 AM
                </TableCell>
                <TableCell className={classes.font}>DigitalOcean Workshop</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow> */}
              {/* <TableRow className={classes.font}>
                <TableCell className={classes.font}>12:00 PM - 12:45 PM</TableCell>
                <TableCell className={classes.font}>Booz Allen Hamilton Workshop </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 316
                </TableCell>
              </TableRow> */}
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  1:00 PM
                </TableCell>
                <TableCell className={classes.font}>Lunch</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (3rd floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              {/* <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  2:00 PM - 3:30 PM
                </TableCell>
                <TableCell className={classes.font}>Bloomberg Workshop</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 316
                </TableCell>
              </TableRow>
              <TableRow className={classes.font}>
                <TableCell className={classes.font}>3:30 PM - 4:15 PM</TableCell>
                <TableCell className={classes.font}>Quest2Learn Workshop</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  4:15 PM - 5:00 PM
                </TableCell>
                <TableCell className={classes.font}>Accenture Consulting Workshop</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 316
                </TableCell>
              </TableRow> */}
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  6:00 PM
                </TableCell>
                <TableCell className={classes.font}>Dinner</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (3rd floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              {/* <TableRow className={classes.font}>
                <TableCell className={classes.font}>7:00 PM - 8:00 PM</TableCell>
                <TableCell className={classes.font}>JHU IT Workshop </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow> */}
              {/* <TableRow className={classes.font}>
                <TableCell className={classes.font}>9:00 PM</TableCell>
                <TableCell className={classes.font}>MLH Bob Ross Event </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 110
                </TableCell>
              </TableRow> */}
              {/* <TableRow className={classes.font}>
                <TableCell className={classes.font}>11:30 PM</TableCell>
                <TableCell className={classes.font}>Midnight Pizza</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall (3rd floor lobby)
                </TableCell>
              </TableRow> */}
            </TableBody>
          )}

          {day === 'sun' && (
            <TableBody className={classes.body}>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:30 AM
                </TableCell>
                <TableCell className={classes.font}>Submissions Due (Soft Deadline)</TableCell>
                <TableCell align="left" className={classes.font}>
                  Devpost
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:45 AM
                </TableCell>
                <TableCell className={classes.font}>All Coding Stops (Hard Deadline)</TableCell>
                <TableCell align="left" className={classes.font}>
                  N/A
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 AM
                </TableCell>
                <TableCell className={classes.font}>Breakfast</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (3rd floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  10:00 AM
                </TableCell>
                <TableCell className={classes.font}>Presentations Fair</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  12:00 PM
                </TableCell>
                <TableCell className={classes.font}>Lunch</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson Hall (1st floor lobby) */}
                  TBD
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  12:30 PM
                </TableCell>
                <TableCell className={classes.font}>Top 10 Demos & Judging</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson 110 */}
                  TBD
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  1:45 PM
                </TableCell>
                <TableCell className={classes.font}>Awards & Closing Ceremony</TableCell>
                <TableCell align="left" className={classes.font}>
                  {/* Hodson 110 */}
                  TBD
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
