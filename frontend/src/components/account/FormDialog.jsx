import React, { useState } from 'react';
import { withAuthCheck } from '../../util/auth.jsx';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import { Divider } from '@mui/material';

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
