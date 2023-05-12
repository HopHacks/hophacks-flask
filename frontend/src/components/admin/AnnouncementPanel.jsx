import React, { useState, useEffect } from 'react';
import { withAdminAuthCheck } from '../../util/auth';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 25
  },
  table: {
    width: '50%',
    marginTop: '2.5%'
  },
  cell: {
    minWidth: '800'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '32ch'
  },
  verticalCenter: {
    position: 'flex',
    marginTop: '-2.5%',
    marginLeft: '36.5%'
  },
  cssLabel: {
    color: 'black'
  },
  panel: {
    marginTop: 50
  },
  left: {
    backgroundColor: 'white',
    borderRadius: 5,
    maxHeight: 475,
    minWidth: 500,
    maxWidth: 600,
    paddingTop: 30,
    paddingBottom: 30,
    paddingRight: 25,
    margin: 'auto',
    marginBottom: 50
  },
  right: {
    maxHeight: 325,
    minWidth: 500,
    margin: 'auto',
    marginTop: 0
  },
  button: {
    marginLeft: 35
  },
  createUpdateTitle: {
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 30
  }
}));
const Panel = function () {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTitle, setdeleteTitle] = useState('');
  const [updatedFilter, setUpdatedFilter] = useState({
    creator: '',
    created_time: ''
  });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [event, setEvent] = useState('');
  const [priority, setPriority] = useState(false);
  const [page, setPage] = useState(1);
  const [isCreating, setIsCreating] = useState(true);

  async function getAnnouncements() {
    try {
      const response = await axios.get('/api/announcements/');
      setAnnouncements(response.data['announcements']);
    } catch (ex) {
      console.log('Unable to get all announcements');
    }
  }
  function populateAnnouncements(page) {
    return announcements
      ?.filter((announc, index) => index >= page.page * 5 - 5 && index < page.page * 5)
      .map((announc, index) => (
        <TableRow key={index}>
          <TableCell className={classes.cell} style={{ width: '1000%' }} scope="row">
            <Grid container>
              <Grid item xs={8} lg={10}>
                {announc.title}
              </Grid>
              <Grid item sm={1.5} lg={1}>
                <Button
                  variant="contained"
                  color="white"
                  id={announc.created_time}
                  onClick={() => {
                    setUpdatedFilter({
                      creator: announc['creator'],
                      created_time: announc.created_time
                    });
                    setTitle(announc.title);
                    setContent(announc.content);
                    setEvent(announc.event);
                    setPriority(announc.importance);
                    setIsCreating(false);
                  }}
                >
                  Edit
                </Button>
              </Grid>
              <Grid item sm={1.5} lg={1}>
                <Button
                  variant="contained"
                  color="white"
                  id={announc.title}
                  onClick={handleOpenDeleteDialog}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </TableCell>
          <Dialog
            open={openDelete}
            keepMounted
            onClose={handleCloseDeleteDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{'You are going to delete the announcement'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <p>Title: {deleteTitle}</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} id="back">
                Back
              </Button>
              <Button onClick={handleCloseDeleteDialog} id="confirm">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </TableRow>
      ));
  }
  function dialogTitle() {
    if (isCreating) {
      return <DialogTitle>{'Please Confirm The New Announcement'}</DialogTitle>;
    } else {
      return <DialogTitle>{'Please Confirm The Updated Announcement'}</DialogTitle>;
    }
  }
  function panelTitle() {
    if (isCreating) {
      return <Typography className={classes.createUpdateTitle}>Create Announcement</Typography>;
    } else {
      return <Typography className={classes.createUpdateTitle}>Update Announcement</Typography>;
    }
  }
  function makeAnnouncement() {
    return (
      <Grid container item spacing={1} xs={10} sm={8} className={classes.left}>
        <Grid container item spacing={1} direction="column" alignItems="center">
          <Dialog
            open={open}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            {dialogTitle()}
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <p> Title : {title} </p>
                <p> Content : {content} </p>
                <p> Event : {event} </p>
                <p> Priority : {priorityToString(priority)} </p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} id="back">
                Back
              </Button>
              <Button onClick={handleCloseDialog} id="confirm">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <div className={classes.root}>
            <div>
              {panelTitle()}
              <TextField
                id="outlined-multiline-flexible"
                label="Title"
                value={title}
                rows={2}
                style={{ margin: 8, marginBottom: 16 }}
                fullWidth
                color="white"
                variant="outlined"
                InputLabelProps={{
                  classes: {
                    root: classes.cssLabel,
                    focused: classes.cssFocused
                  }
                }}
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
                onChange={handleTitleChange}
              />
              <TextField
                id="outlined-multiline-static"
                label="Content"
                value={content}
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                style={{ margin: 8, marginBottom: 16 }}
                InputLabelProps={{
                  classes: {
                    root: classes.cssLabel,
                    focused: classes.cssFocused
                  }
                }}
                InputProps={{
                  classes: {
                    root: classes.cssOutlinedInput,
                    focused: classes.cssFocused,
                    notchedOutline: classes.notchedOutline
                  }
                }}
                onChange={handleContentChange}
              />
              <div>
                <TextField
                  select
                  label="Event"
                  variant="outlined"
                  style={{ margin: 8, marginBottom: 16 }}
                  className={classes.textField}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused
                    }
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline
                    }
                  }}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      getContentAnchorEl: null
                    }
                  }}
                  value={event}
                  onChange={handleEventChange}
                >
                  <MenuItem value={'Spring 2022'}>Spring 2022</MenuItem>
                  <MenuItem value={'Fall 2022'}>Fall 2022</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Priority"
                  className={classes.textField}
                  style={{ margin: 8, marginBottom: 16 }}
                  variant="outlined"
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline
                    }
                  }}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                      getContentAnchorEl: null
                    }
                  }}
                  value={priority}
                  onChange={handlePriorityChange}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </TextField>
              </div>
            </div>
          </div>
        </Grid>
        <Grid container item xs={12} direction="row" justify="flex-start">
          <Button
            variant="contained"
            color="white"
            onClick={handleOpenDialog}
            className={classes.button}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="white"
            onClick={handleCancelButton}
            className={classes.button}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    );
  }
  useEffect(() => {
    getAnnouncements();
    populateAnnouncements();
    makeAnnouncement();
  }, []);
  function priorityToString(p) {
    if (p) {
      return 'Yes';
    } else {
      return 'No';
    }
  }
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const handleContentChange = (event) => {
    setContent(event.target.value);
  };
  const handleEventChange = (event) => {
    setEvent(event.target.value);
  };
  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleOpenDeleteDialog = (event) => {
    setdeleteTitle(event.currentTarget.id);
    setOpenDelete(true);
  };
  const handleCancelButton = () => {
    setUpdatedFilter({ creator: '', created_time: '' });
    setTitle('');
    setContent('');
    setEvent('');
    setPriority('');
    setIsCreating(true);
  };
  const handlePageChange = (page) => {
    setPage(page);
  };
  async function createAnnouncement() {
    try {
      await axios.post('/api/announcements/', {
        title: title,
        content: content,
        event: event,
        importance: priority
      });
      window.location.reload();
      setIsCreating(true);
    } catch (ex) {
      console.log(ex);
    }
  }
  async function updateAnnouncement() {
    try {
      await axios.put('/api/announcements/update', {
        filter: updatedFilter,
        title: title,
        content: content,
        event: event,
        importance: priority
      });
      window.location.reload();
      setIsCreating(true);
    } catch (ex) {
      console.log(updatedFilter);
      console.log(title);
      console.log(content);
      console.log(event);
      console.log(priority);
      console.log(ex);
    }
  }
  const handleCloseDialog = (event) => {
    if (isCreating) {
      handleCloseDialogForCreating(event);
    } else {
      handleCloseDialogForEditing(event);
    }
  };

  const handleCloseDialogForCreating = (event) => {
    if (event.currentTarget.id === 'confirm') {
      createAnnouncement();
    }
    setOpen(false);
  };
  const handleCloseDialogForEditing = (event) => {
    if (event.currentTarget.id === 'confirm') {
      updateAnnouncement();
    }
    setOpen(false);
  };
  async function deleteAnnouncement() {
    try {
      await axios.delete('/api/announcements/', {
        data: { title: deleteTitle }
      });
      setIsCreating(true);
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }
  const handleCloseDeleteDialog = (event) => {
    if (event.currentTarget.id === 'confirm') {
      deleteAnnouncement();
    }
    setOpenDelete(false);
  };
  return (
    <>
      <Grid container className={classes.panel}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" className={classes.title}>
            Announcement Panel
          </Typography>
        </Grid>
        {makeAnnouncement()}
        <Grid container xs={10} sm={6} className={classes.right}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableBody>{populateAnnouncements({ page })}</TableBody>
            </Table>
            <Pagination
              count={Math.ceil(announcements.length / 5)}
              size="small"
              className={classes.pagination}
              onChange={(e, p) => handlePageChange(p)}
            />
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};
export default withAdminAuthCheck(Panel);
