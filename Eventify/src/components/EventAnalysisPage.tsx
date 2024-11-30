import React, { useEffect, useState, useRef } from 'react';

import axios from 'axios';

import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  format,
  parseISO,
  isAfter,
  isSameMonth,
  isSameYear,
} from 'date-fns';

import {
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
  Pagination,
} from '@mui/material';

import SaveAltIcon from '@mui/icons-material/SaveAlt';

import DateRangeIcon from '@mui/icons-material/DateRange';

import SearchIcon from '@mui/icons-material/Search';

import GetAppIcon from '@mui/icons-material/GetApp';

import * as htmlToImage from 'html-to-image';

import { CSVLink } from 'react-csv';

import EventHeader from './EventHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: string;
  description: string;
  eventType: string;
  organiser: string;
  email: string;
  phoneNumber: string;
  speaker: string;
  videoUrl: string;
  zip: string;
  latitude: number;
  longitude: number;
  isRegistered: boolean;
}

const EventAnalysisPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const eventsPerPage = 4; // Number of events per page

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events');
        setEvents(response.data);
        filterUpcomingEvents(response.data);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedMonth === 'all') {
      filterUpcomingEvents(events);
    } else {
      filterEventsByMonth(selectedMonth);
    }
  }, [selectedMonth, events]);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, selectedType]);

  const filterUpcomingEvents = (events: EventData[]) => {
    const now = new Date();
    const upcomingEvents = events.filter((event) => isAfter(parseISO(event.date), now));
    setFilteredEvents(upcomingEvents);
  };

  const filterEventsByMonth = (month: string) => {
    const [year, monthNumber] = month.split('-').map(Number);
    const filtered = events.filter((event) => {
      const eventDate = parseISO(event.date);
      return isSameMonth(eventDate, new Date(year, monthNumber - 1)) && isSameYear(eventDate, new Date(year, monthNumber - 1));
    });
    setFilteredEvents(filtered);
  };

  const filterEvents = () => {
    let filtered = events;
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.eventType === selectedType);
    }
    setFilteredEvents(filtered);
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonth(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedType(event.target.value as string);
  };

  const handleDownload = () => {
    if (chartRef.current) {
      htmlToImage.toPng(chartRef.current)
        .then(dataUrl => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'chart.png';
          link.click();
        })
        .catch(error => {
          console.error('Error generating image:', error);
        });
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const csvData = filteredEvents.map(event => ({
    ID: event.id,
    Event: event.title,
    Description: event.description,
    Date: event.date,
    Location: event.location,
    Organiser: event.organiser,
    Type: event.eventType,
    Status: isAfter(parseISO(event.date), new Date()) ? 'Upcoming' : 'Completed'
  }));

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Upcoming',
      data: filteredEvents.map(event => parseISO(event.date).getMonth() + 1).reduce((acc, month) => {
        acc[month - 1] = (acc[month - 1] || 0) + 1;
        return acc;
      }, Array(12).fill(0)),
      backgroundColor: 'rgba(0, 123, 255, 0.8)', // More solid color
    }],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          borderDash: [4, 4],
          color: 'rgba(0, 0, 0, 0.1)', // Subtle horizontal lines
        },
      },
      x: {
        grid: {
          display: false, // Hide vertical lines
        },
      },
    },
    maintainAspectRatio: false // Enable responsive resizing
  };

  const years = ['2024', '2025'];

  return (
    <>
      <EventHeader />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center', // Center the heading
            margin: '20px 0 20px', // Add margin between heading and first card
            fontWeight: 'bold', // Make the font bold
            color: '#3f51b5', // Use a nice color
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)', // Add text shadow for appeal
            fontFamily: 'Arial, sans-serif', // Change font family
          }}
        >
          Event Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <TextField
                    select
                    label="Month"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 200 }}
                    InputProps={{
                      startAdornment: <DateRangeIcon />,
                    }}
                  >
                    <MenuItem key="all" value="all">
                      All
                    </MenuItem>
                    {years.map((year) =>
                      Array.from({ length: 12 }, (_, i) => {
                        const date = new Date(Number(year), i); // Convert year to number
                        return (
                          <MenuItem key={`${year}-${i + 1}`} value={format(date, 'yyyy-MM')}>
                            {format(date, 'MMMM yyyy')}
                          </MenuItem>
                        );
                      }),
                    )}
                  </TextField>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveAltIcon />}
                    onClick={handleDownload}
                  >
                    Download Chart
                  </Button>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2, justifyContent:"center", alignItems:"center"}}>
                  <Grid item xs={3}>
                    <Typography variant="body1">Upcoming</Typography>
                    <Typography variant="h5">{filteredEvents.length}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">Completed</Typography>
                    <Typography variant="h5">{events.length - filteredEvents.length}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body1">Total</Typography>
                    <Typography variant="h5">{events.length}</Typography>
                  </Grid>
                  {/* <Grid item xs={3}>
                    <Typography variant="body1">My Events</Typography>
                    <Typography variant="h5"></Typography>
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>
            <Box ref={chartRef} sx={{ margin: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Event Overview Bar Chart
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar data={barChartData} options={options} />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Event List
                </Typography>
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search By Event or Description"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: <SearchIcon />,
                    }}
                    sx={{ minWidth: 300 }}
                  />
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mt: { xs: 2, sm: 0 } }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={selectedType}
                      onChange={handleTypeChange}
                      label="Type"
                    >
                      <MenuItem value="all">All</MenuItem>
                      <MenuItem value="festival">Festival</MenuItem>
                      <MenuItem value="conference">Conference</MenuItem>
                      <MenuItem value="playground">Playground</MenuItem>
                    </Select>
                  </FormControl>
                  <CSVLink
                    data={csvData}
                    filename={"event_data.csv"}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<GetAppIcon />}
                      sx={{ mt: { xs: 2, sm: 0 } }}
                    >
                      Export CSV
                    </Button>
                  </CSVLink>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Event</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Organiser</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.id}</TableCell>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>{event.organiser}</TableCell>
                          <TableCell>{event.eventType}</TableCell>
                          <TableCell>
                            <Box sx={{
                              width: '100%',
                              padding: '0.5em',
                              borderRadius: '5px',
                              textAlign: 'center',
                              color: 'white',
                              bgcolor: isAfter(parseISO(event.date), new Date()) ? 'green' : 'red'
                            }}>
                              {isAfter(parseISO(event.date), new Date()) ? 'Upcoming' : 'Completed'}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Pagination
                  count={Math.ceil(filteredEvents.length / eventsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EventAnalysisPage;
