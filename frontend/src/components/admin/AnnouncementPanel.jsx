import React, { useState, useEffect } from "react";
import { withAdminAuthCheck } from "../../util/auth";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import SchoolAutocomplete from '../account/SchoolAutocomplete'
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({

  pagination: {
    marginTop: "3%",
    marginLeft: "40%",
  },

  title: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 25,
  },

  table: {
    width: "50%",
    marginTop: "2.5%",
  },

  cell: {
    minWidth: '800'
  },

  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '32ch',
  },
  verticalCenter: {
    position: 'flex',
    marginTop: "-2.5%",
    marginLeft: "36.5%",
  },

  cssLabel: {
    color: "black"
  },
  panel: {
    marginTop: 50,
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
    marginBottom: 50,
  },
  right: {
    maxHeight: 325,
    minWidth: 500,
    margin: 'auto',
    marginTop: 0,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  button: {
    marginLeft: 35,
  },
})
);


const Panel = function () {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTitle, setdeleteTitle] = useState("");
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    "_id": "6249fa566bcdae51504b5a0b",
    "title": "1",
    "content": "2",
    "event": "Spring_2022",
    "importance": true
  });
  const [page, setPage] = useState(1);

  async function getAnnouncements() {
    try {
      const response = await axios.get("/api/announcements/");
      setAnnouncements(response.data['announcements']);
    } catch (ex) {
      console.log('Unable to get all announcements');
    }
  }

  function populateAnnouncements(page) {
    return (
      announcements?.filter((announcement, index) => index >= page.page * 5 - 5 && index < page.page * 5).map((announcement, index) => (
        <TableRow key={index}  >
          <TableCell className={classes.cell} style={{ width: '1000%' }} scope="row">
            <Grid container>
              <Grid item xs={8} lg={10}>
                {announcement.title}
              </Grid>
              <Grid item sm={1.5} lg={1}>
                <Button variant="contained" color="white" id={announcement.title} onClick={handleOpenDeleteDialog}>
                  Edit
                </Button>
              </Grid>
              <Grid item sm={1.5} lg={1}>
                <Button variant="contained" color="white" id={announcement.title} onClick={handleOpenDeleteDialog}>
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
            <DialogTitle>{"You are going to delete the announcement"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <p>Title: {deleteTitle}</p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              < Button onClick={handleCloseDeleteDialog} id="back">Back</Button>
              < Button onClick={handleCloseDeleteDialog} id="confirm">Confirm</Button>
            </DialogActions>
          </Dialog>
        </TableRow>
      ))
    )
  }

  function makeAnnouncement(currentAnnouncement) {
    console.log(currentAnnouncement._id)
    console.log(currentAnnouncement.title)
    console.log(currentAnnouncement.content)
    if (currentAnnouncement._id == "") {
      return (
        <Grid container item spacing={1} xs={10} sm={8} className={classes.left}>
          <Grid container item spacing={1} direction="column" alignItems="center">
            <Dialog
              open={open}
              // TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Please Confirm The Announcement"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <p> Title : {currentAnnouncement.title} </p>
                  <p> Content : {currentAnnouncement.content} </p>
                  <p> Event : {currentAnnouncement.event} </p>
                  <p> Priority : {currentAnnouncement.importance} </p>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                < Button onClick={handleCloseDialog} id="back">Back</Button>
                < Button onClick={handleCloseDialog} id="confirm">Confirm</Button>
              </DialogActions>
            </Dialog>

            <div className={classes.root}>
              <div>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Title"
                  defaultValue=""
                  rows={2}
                  style={{ margin: 8, marginBottom: 16 }}
                  fullWidth
                  color="white"
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                  }}
                  onChange={handleTitleChange}
                />
                <TextField
                  id="outlined-multiline-static"
                  label="Content"
                  defaultValue=""
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  style={{ margin: 8, marginBottom: 16 }}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                  }}
                  onChange={handleContentChange}
                />
                <div>
                  <TextField
                    select
                    label="Event"
                    defaultValue=""
                    variant="outlined"
                    style={{ margin: 8, marginBottom: 16 }}
                    className={classes.textField}
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                      }
                    }}
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }
                    }}
                    onChange={handleEventChange}
                  >
                    <MenuItem value={"Spring_2022"}>Spring 2022</MenuItem>
                    <MenuItem value={"Fall 2022"}>Fall 2022</MenuItem>
                  </TextField>
                  <TextField
                    label="Priority"
                    defaultValue=""
                    select
                    className={classes.textField}
                    style={{ margin: 8, marginBottom: 16 }}
                    variant="outlined"
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                      }
                    }}
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }
                    }}
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
            <Button variant="contained" color="white" onClick={handleOpenDialog} className={classes.button}>
              Submit
            </Button>
            <Button variant="contained" color="white" onClick={handleCancelButton} className={classes.button}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container item spacing={1} xs={10} sm={8} className={classes.left}>
          <Grid container item spacing={1} direction="column" alignItems="center">
            <Dialog
              open={open}
              // TransitionComponent={Transition}
              keepMounted
              onClose={handleCloseDialog}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Please Confirm The Updating"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <p> Title : {currentAnnouncement.title} </p>
                  <p> Content : {currentAnnouncement.content} </p>
                  <p> Event : {currentAnnouncement.event} </p>
                  {/* <p> Image Filename : {image['name']} </p> */}
                  <p> Priority : {currentAnnouncement.importance} </p>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                < Button onClick={handleCloseDialogForEditing} id="back">Back</Button>
                < Button onClick={handleCloseDialogForEditing} id="confirm">Confirm</Button>
              </DialogActions>
            </Dialog>

            <div className={classes.root}>
              <div>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Title"
                  defaultValue={currentAnnouncement.title}
                  rows={2}
                  style={{ margin: 8, marginBottom: 16 }}
                  fullWidth
                  color="white"
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
                    }
                  }}
                  onChange={handleTitleChange}
                />
                <TextField
                  id="outlined-multiline-static"
                  label="Content"
                  defaultValue={currentAnnouncement.content}
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  style={{ margin: 8, marginBottom: 16 }}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      notchedOutline: classes.notchedOutline,
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
                        focused: classes.cssFocused,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                      }
                    }}
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }
                    }}
                    value={currentAnnouncement.event}
                    onChange={handleEventChange}
                  >
                    <MenuItem value={"Spring_2022"}>Spring 2022</MenuItem>
                    <MenuItem value={"Fall_2022"}>Fall 2022</MenuItem>
                  </TextField>
                  <TextField
                    label="Priority"
                    select
                    defaultValue={currentAnnouncement.importance}
                    className={classes.textField}
                    style={{ margin: 8, marginBottom: 16 }}
                    variant="outlined"
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      },
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        notchedOutline: classes.notchedOutline,
                      }
                    }}
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }
                    }}
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
            <Button variant="contained" color="white" onClick={handleOpenDialog} className={classes.button}>
              Submit
                </Button>
            <Button variant="contained" color="white" onClick={handleCancelButton} className={classes.button}>
              Cancel
                </Button>
          </Grid>
        </Grid>
      );
    }
  }

  useEffect(() => {
    getAnnouncements()
    populateAnnouncements()
  }, []);

  const handleTitleChange = (event) => {
    currentAnnouncement.title = (event.target.value)
  };

  const handleContentChange = (event) => {
    currentAnnouncement.content = (event.target.value)
  };

  const handleEventChange = (event) => {
    currentAnnouncement.event = (event.target.value)
  };

  const handlePriorityChange = (event) => {
    currentAnnouncement.importance = (event.target.value)
  };

  const handleOpenDialog = () => {
    setOpen(true);
  }

  const handleOpenDeleteDialog = (event) => {
    setdeleteTitle(event.currentTarget.id)
    setOpenDelete(true);
  }

  const handlePreviewAndEditButton = (event) => {
    setCurrentAnnouncement(event.currentTarget.id)
  }

  const handleCancelButton = () => {
    setCurrentAnnouncement({
      "_id": "",
      "title": "",
      "content": "",
      "event": "",
      "importance": null
    })
  }

  const handlePageChange = (page) => {
    setPage(page);
  }

  async function sendAnnouncement() {
    try {
      await axios.post("/api/announcements/", { "title": currentAnnouncement.title, "content": currentAnnouncement.content, "event": currentAnnouncement.event, "importance": currentAnnouncement.importance });
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  async function updateAnnouncement() {
    try {
      await axios.put("/api/announcements/update", { "_id": currentAnnouncement._id, "title": currentAnnouncement.title, "content": currentAnnouncement.content, "event": currentAnnouncement.event, "importance": currentAnnouncement.importance });
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  async function deleteAnnouncement() {
    try {
      await axios.delete("/api/announcements/", { data: { "title": deleteTitle } });
      window.location.reload();
    } catch (ex) {
      console.log(ex);
    }
  }

  const handleCloseDialog = (event) => {
    if (event.currentTarget.id === "confirm") {
      sendAnnouncement();
    }
    setOpen(false);
  }

  const handleCloseDialogForEditing = (event) => {
    if (event.currentTarget.id === "confirm") {
      updateAnnouncement();
    }
    setOpen(false);
  }
  
  const handleCloseDeleteDialog = (event) => {
    if (event.currentTarget.id === "confirm") {
      deleteAnnouncement();
    }
    setOpenDelete(false);
  }

  return (
    <>
      <Grid container className={classes.panel}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" className={classes.title}>Announcement Panel</Typography>
        </Grid>
        {makeAnnouncement(currentAnnouncement)}
        <Grid container xs={10} sm={6} className={classes.right}>
          {/* <div className={classes.table}> */}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              {/* <TableHead>
                  <TableRow>
                    <TableCell align="left">Announcements</TableCell>
                  </TableRow>
                </TableHead> */}
              <TableBody>
                {populateAnnouncements({ page })}
              </TableBody>
            </Table>
            <Pagination count={announcements.length / 5} size="small" className={classes.pagination} onChange={(e, p) => handlePageChange(p)} />
          </TableContainer>
          {/* </div> */}
        </Grid>
      </Grid>
      {/* </div> */}
    </>
  );

};

export default withAdminAuthCheck(Panel);

