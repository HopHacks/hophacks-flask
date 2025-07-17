import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
const useStyles = makeStyles({
  margin: {
    marginBottom: '13px'
  },
  color: {
    backgroundColor: 'rgba(6, 26, 64, 1)'
  },
  body: {
    maxHeight: '150px',
    overflow: 'auto'
  },
  title: {
    fontSize: '3rem',
    color: '#061a40',
    fontFamily: 'Inter',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  schedule: {
    backgroundColor: 'rgba(45, 153, 224, 1)',
    fontStyle: 'italic'
  },
  font: {
    fontFamily: 'Inter',
    color: 'rgba(6, 26, 64, 1)',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    '&.Mui-selected': {
      color: 'rgba(6, 26, 64, 1)',
      fontWeight: 'bold'
    },
    fontSize: '15px'
  },
  titleFont: {
    fontFamily: 'Inter',
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'transparent',
    fontWeight: 'bolder',
    '&.Mui-selected': {
      color: 'rgba(6, 26, 64, 1)',
      fontWeight: 'bolder'
    },
    fontSize: '15px'
  },
  divFont: {
    fontFamily: 'Inter',
    color: 'rgba(6, 26, 64, 1)',
    height: '35px',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  indicator: {
    backgroundColor: 'rgba(250, 192, 19, 1)'
  },
  selected: {
    backgroundColor: 'rgba(250, 192, 19, 1)',
    color: 'rgba(250, 192, 19, 1)'
  }
});
// TODO: update table cells with the new schedule and/or create a better style of table
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
        style={{ color: 'rgba(6, 26, 64, 1)', fontWeight: 'bold', fontStyle: 'italic' }}
      >
        All times in EDT (GMT-4)
      </Typography>

      <TableContainer
        component={Paper}
        style={{ width: '100%', backgroundColor: 'rgba(45, 153, 224, 1)' }}
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
          classes={{ indicator: classes.indicator }}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: 'white'
          }}
          variant="fullWidth"
        >
          <Tab
            label="[Day 1]"
            value="fri"
            className={classes.font}
            style={{
              textTransform: 'none'
            }}
          />
          <Tab
            label="[Day 2]"
            value="sat"
            className={classes.font}
            style={{
              textTransform: 'none'
            }}
          />
          <Tab
            label="[Day 3]"
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
              <TableCell className={classes.titleFont}>Time</TableCell>
              <TableCell className={classes.titleFont}>Event</TableCell>
              <TableCell className={classes.titleFont}>Location</TableCell>
            </TableRow>
          </TableHead>
          {day === 'fri' && (
            <TableBody className={classes.body}>
              <TableRow className={classes.bodycolor}>
                <TableCell className={classes.font}>6:00 PM</TableCell>
                <TableCell className={classes.font}>Check-in Begins </TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Glass Pavilion
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  6:30 PM
                </TableCell>
                <TableCell className={classes.font}>Dinner</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Glass Pavilion
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:00 PM
                </TableCell>
                <TableCell className={classes.font}>Opening Ceremony</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall - Auditorium (Hodson 110)
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:45 PM
                </TableCell>
                <TableCell className={classes.font}>Team Building</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 101
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 PM
                </TableCell>
                <TableCell className={classes.font}> Sponsor Hall Opens</TableCell>
                <TableCell width="40%" align="left" className={classes.font}>
                  Levering Hall - Great Hall
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 PM
                </TableCell>
                <TableCell className={classes.font}> Hacking Begins!</TableCell>
                <TableCell width="40%" align="left" className={classes.font}>
                  Hodson 210, 211, 213, 216, 301, 303, 311, 315
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 PM
                </TableCell>
                <TableCell className={classes.font}> PST Workshop</TableCell>
                <TableCell width="40%" align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  10:00 PM
                </TableCell>
                <TableCell className={classes.font}> CBID Workshop - CBID Track </TableCell>
                <TableCell width="40%" align="left" className={classes.font}>
                  Hodson 316
                </TableCell>
              </TableRow>
              <TableRow className={classes.font}>
                <TableCell className={classes.font}>11:00 PM</TableCell>
                <TableCell className={classes.font}> Sponsor Hall Closes </TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Great Hall
                </TableCell>
              </TableRow>
              <TableRow className={classes.font}>
                <TableCell className={classes.font}>11:00 PM</TableCell>
                <TableCell className={classes.font}> Sleeping Rooms Open </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 203
                </TableCell>
              </TableRow>
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
                  Levering Lounge
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  11:00 AM
                </TableCell>
                <TableCell className={classes.font}>JHU IT Workshop - Real World SDLC</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  12:00 PM
                </TableCell>
                <TableCell className={classes.font}>
                  {' '}
                  Bloomberg Technical Interview Workshop{' '}
                </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 316
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  2:00 PM
                </TableCell>
                <TableCell className={classes.font}>Lunch</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Lounge
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  3:00 PM
                </TableCell>
                <TableCell className={classes.font}> Marshall Wace Workshop </TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 313
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  4:00 PM
                </TableCell>
                <TableCell className={classes.font}>MLH Workshop - MS Paint Bob Ross</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall - Auditorium (Hodson 110)
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  8:00 PM
                </TableCell>
                <TableCell className={classes.font}>Dinner</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Glass Pavilion
                </TableCell>
              </TableRow>
              <TableRow className={classes.font}>
                <TableCell className={classes.font}>11:00 PM</TableCell>
                <TableCell className={classes.font}> Sponsor Hall Closes</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Great Hall
                </TableCell>
              </TableRow>
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
                  Devpost
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 AM
                </TableCell>
                <TableCell className={classes.font}>Breakfast</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Great Hall
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  9:00 AM
                </TableCell>
                <TableCell className={classes.font}>Sleeping Rooms Close</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 203
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  10:00 AM
                </TableCell>
                <TableCell className={classes.font}>Presentations Fair</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson 210, 211, 213, 216, 301, 303, 311, 315
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  12:00 PM
                </TableCell>
                <TableCell className={classes.font}>Lunch</TableCell>
                <TableCell align="left" className={classes.font}>
                  Levering Hall - Great Hall
                </TableCell>
              </TableRow>
              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  1:15 PM
                </TableCell>
                <TableCell className={classes.font}>Top 10 Demos & Judging</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall - Auditorium (Hodson 110)
                </TableCell>
              </TableRow>

              <TableRow className={classes.bodycolor}>
                <TableCell width="20%" className={classes.font}>
                  2:30 PM
                </TableCell>
                <TableCell className={classes.font}>Awards & Closing Ceremony</TableCell>
                <TableCell align="left" className={classes.font}>
                  Hodson Hall - Auditorium (Hodson 110)
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Box>
  );
}
