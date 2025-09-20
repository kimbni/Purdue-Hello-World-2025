import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box
} from '@mui/material';
import { Add, Edit, Delete, Schedule } from '@mui/icons-material';
import { User, ClassSchedule } from '../types';

interface ScheduleManagerProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const DAYS_OF_WEEK = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ user, onUpdateUser }) => {
  const [open, setOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dayOfWeek: 1,
    startTime: '',
    endTime: '',
    location: ''
  });

  const handleOpen = (classItem?: ClassSchedule) => {
    if (classItem) {
      setEditingClass(classItem);
      setFormData({
        name: classItem.name,
        dayOfWeek: classItem.dayOfWeek,
        startTime: classItem.startTime,
        endTime: classItem.endTime,
        location: classItem.location || ''
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        dayOfWeek: 1,
        startTime: '',
        endTime: '',
        location: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClass(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.startTime || !formData.endTime) {
      return;
    }

    const newClass: ClassSchedule = {
      id: editingClass?.id || Date.now().toString(),
      name: formData.name,
      dayOfWeek: formData.dayOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location
    };

    const updatedSchedule = editingClass
      ? user.schedule.map(c => c.id === editingClass.id ? newClass : c)
      : [...user.schedule, newClass];

    onUpdateUser({
      ...user,
      schedule: updatedSchedule
    });

    handleClose();
  };

  const handleDelete = (classId: string) => {
    const updatedSchedule = user.schedule.filter(c => c.id !== classId);
    onUpdateUser({
      ...user,
      schedule: updatedSchedule
    });
  };

  const getClassesForDay = (dayOfWeek: number) => {
    return user.schedule
      .filter(c => c.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">My Class Schedule</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add Class
        </Button>
      </Box>

      <Grid container spacing={3}>
        {DAYS_OF_WEEK.map((day, index) => {
          const classes = getClassesForDay(index);
          return (
            <Grid item xs={12} md={6} lg={4} key={day}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {day}
                  </Typography>
                  {classes.length > 0 ? (
                    <List dense>
                      {classes.map((classItem) => (
                        <ListItem key={classItem.id}>
                          <ListItemText
                            primary={classItem.name}
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {classItem.startTime} - {classItem.endTime}
                                </Typography>
                                {classItem.location && (
                                  <Typography variant="body2" color="text.secondary">
                                    {classItem.location}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => handleOpen(classItem)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => handleDelete(classItem.id)}
                              size="small"
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      No classes scheduled
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Class Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Day of Week</InputLabel>
                <Select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as number })}
                >
                  {DAYS_OF_WEEK.map((day, index) => (
                    <MenuItem key={day} value={index}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location (Optional)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingClass ? 'Update' : 'Add'} Class
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleManager;
