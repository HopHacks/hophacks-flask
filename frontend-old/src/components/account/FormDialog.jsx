import React, { useState } from 'react';
import { withAuthCheck } from '../../util/auth.jsx';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { Divider } from '@material-ui/core';

const FormDialog = function FormDialog({
  title,
  form,
  handleProfileSave,
  primaryText,
  secondaryText
}) {
  const [dialogopen, setdialogOpen] = useState(false);

  const handleClickOpen = () => {
    setdialogOpen(true);
  };

  const handleClose = () => {
    setdialogOpen(false);
  };
  return (
    <div>
      <Divider variant="inset" component="li" />
      <ListItem button>
        <ListItemText
          primary={primaryText}
          secondary={secondaryText}
          primaryTypographyProps={{
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '4px' // vertical space between primary and secondary
            }
          }}
          secondaryTypographyProps={{
            style: {
              fontSize: '18px',
              color: 'white'
            }
          }}
        />
        <CardActions>
          <IconButton>
            <EditIcon fontSize="small" color="primary" onClick={handleClickOpen} />
            <Dialog open={dialogopen} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">{title}</DialogTitle>
              <DialogContent>{form}</DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleProfileSave();
                    handleClose();
                  }}
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </IconButton>
        </CardActions>
      </ListItem>
    </div>
  );
};

export default withAuthCheck(FormDialog);
