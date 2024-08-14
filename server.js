const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { FlightRadar24API } = require("flightradarapi");
const frApi = new FlightRadar24API();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Sample route
app.get('/api', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// New route to fetch flights
app.get('/api/getflights', async (req, res) => {
    try {
        const { page = 1, limit = 10, sortBy = 'flightNumber', sortOrder = 'asc' } = req.query;

        let flights = await frApi.getFlights();

        // Sort flights
        flights = flights.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1;
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1;
            }
        });

        // Calculate start and end index for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);

        // Paginate the data
        const paginatedFlights = flights.slice(startIndex, endIndex);

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total: flights.length,
            flights: paginatedFlights
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch flights', details: err.message });
    }
});

app.get('/api/getairports', async (req, res) => {
    try {
        const { page = 1, limit = 10} = req.query;

        let airports = await frApi.getAirports();

        // Sort flights
        // airports = airports.sort((a, b) => {
        //     if (sortOrder === 'asc') {
        //         return a[sortBy] > b[sortBy] ? 1 : -1;
        //     } else {
        //         return a[sortBy] < b[sortBy] ? 1 : -1;
        //     }
        // });

        // Calculate start and end index for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);

        // Paginate the data
        const paginatedAirports = airports.slice(startIndex, endIndex);

        res.json({
            page: parseInt(page),
            limit: parseInt(limit),
            total: airports.length,
            airports: paginatedAirports
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch airports', details: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
