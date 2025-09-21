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
  Box,
  Paper,
  Chip
} from '@mui/material';
import { Add, Edit, Delete, Schedule, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { User, ClassSchedule, HangoutSuggestion } from '../types';

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
  const [currentWeek, setCurrentWeek] = useState(new Date());
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

  const getAcceptedHangoutsForDay = (dayOfWeek: number) => {
    return user.suggestions
      .filter(suggestion => suggestion.status === 'accepted')
      .filter(suggestion => {
        const suggestionDate = new Date(suggestion.suggestedTime);
        return suggestionDate.getDay() === dayOfWeek;
      })
      .map(suggestion => {
        const suggestionDate = new Date(suggestion.suggestedTime);
        const startTime = suggestionDate.toTimeString().slice(0, 5); // HH:MM format
        const endTime = new Date(suggestionDate.getTime() + suggestion.duration * 60000)
          .toTimeString().slice(0, 5); // HH:MM format
        
        return {
          id: `hangout-${suggestion.id}`,
          name: suggestion.title,
          dayOfWeek: dayOfWeek,
          startTime: startTime,
          endTime: endTime,
          location: suggestion.location,
          isHangout: true,
          originalSuggestion: suggestion
        };
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getAllEventsForDay = (dayOfWeek: number) => {
    const classes = getClassesForDay(dayOfWeek);
    const hangouts = getAcceptedHangoutsForDay(dayOfWeek);
    return [...classes, ...hangouts].sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Start from Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const getTimeSlotPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours - 7) * 60 + minutes; // Start from 7 AM
  };

  const getEventHeight = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    return endTotal - startTotal;
  };

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7; // 7 AM to 10 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDates = getWeekDates(currentWeek);

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

      {/* Week Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          startIcon={<ChevronLeft />}
          onClick={() => navigateWeek('prev')}
        >
          Previous Week
        </Button>
        <Typography variant="h6">
          {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
        </Typography>
        <Button
          endIcon={<ChevronRight />}
          onClick={() => navigateWeek('next')}
        >
          Next Week
        </Button>
      </Box>

      {/* Weekly Calendar */}
      <Paper elevation={2}>
        <Box sx={{ overflow: 'auto' }}>
          <Grid container>
            {/* Time column */}
            <Grid item xs={1}>
              <Box sx={{ height: 60, borderBottom: 1, borderColor: 'divider' }} />
              {timeSlots.map((time) => (
                <Box
                  key={time}
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }}
                >
                  {time}
                </Box>
              ))}
            </Grid>

            {/* Days of week */}
            {DAYS_OF_WEEK.map((day, dayIndex) => {
              const events = getAllEventsForDay(dayIndex);
              const isToday = weekDates[dayIndex].toDateString() === new Date().toDateString();
              
              return (
                <Grid item xs={1.57} key={day}>
                  {/* Day header */}
                  <Box
                    sx={{
                      height: 60,
                      borderBottom: 1,
                      borderRight: 1,
                      borderColor: 'divider',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isToday ? 'primary.light' : 'background.paper',
                      color: isToday ? 'primary.contrastText' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {day}
                    </Typography>
                    <Typography variant="caption">
                      {weekDates[dayIndex].getDate()}
                    </Typography>
                  </Box>

                  {/* Time slots for this day */}
                  <Box sx={{ position: 'relative', minHeight: 960 }}>
                    {timeSlots.map((time) => (
                      <Box
                        key={time}
                        sx={{
                          height: 60,
                          borderBottom: 1,
                          borderRight: 1,
                          borderColor: 'divider',
                          position: 'relative'
                        }}
                      />
                    ))}

                    {/* Events for this day */}
                    {events.map((event) => {
                      const top = getTimeSlotPosition(event.startTime);
                      const height = getEventHeight(event.startTime, event.endTime);
                      const isHangout = (event as any).isHangout;
                      
                      return (
                        <Box
                          key={event.id}
                          sx={{
                            position: 'absolute',
                            top: top,
                            left: 4,
                            right: 4,
                            height: height,
                            backgroundColor: isHangout ? 'secondary.main' : 'primary.main',
                            color: isHangout ? 'secondary.contrastText' : 'primary.contrastText',
                            borderRadius: 1,
                            p: 1,
                            cursor: 'pointer',
                            border: isHangout ? '2px solid' : 'none',
                            borderColor: isHangout ? 'secondary.dark' : 'transparent',
                            '&:hover': {
                              backgroundColor: isHangout ? 'secondary.dark' : 'primary.dark'
                            }
                          }}
                          onClick={() => !isHangout && handleOpen(event as ClassSchedule)}
                        >
                          <Typography variant="caption" fontWeight="bold" noWrap>
                            {isHangout ? '🎉 ' : ''}{event.name}
                          </Typography>
                          <Typography variant="caption" display="block" noWrap>
                            {event.startTime} - {event.endTime}
                          </Typography>
                          {event.location && (
                            <Typography variant="caption" display="block" noWrap>
                              {event.location}
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Paper>

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
