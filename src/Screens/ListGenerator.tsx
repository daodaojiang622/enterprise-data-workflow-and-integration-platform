import React, {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Container,
    Grid2,
    OutlinedInput,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import { boxStyle, buttonStyle, colors } from '../Utils/Style';

import {useStore} from "../store.ts";


interface DonorData {
    pmm: string;
    smm: string;
    vmm: string;
    exclude: "yes" | "no";
    deceased: "yes" | "no";
    first_name: string;
    nick_name: string;
    last_name: string;
    organization_name: string;
    total_donations: string;
    total_pledge: string;
    largest_gift: string;
    largest_gift_appeal: string;
    first_gift_date: string;
    last_gift_date: string;
    last_gift_amount: string;
    last_gift_request: string;
    last_gift_appeal: string;
    address_line1: string;
    address_line2: string;
    city: string;
    contact_phone_type: string;
    phone_restrictions: string;
    email_restrictions: string;
    communication_restrictions: string;
    subscription_events_in_person: "Opt-in" | "Opt-out";
    subscription_events_magazine: "Opt-in" | "Opt-out";
    communication_preference: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    owner: string;
    typeOfCancer: string;
    description: string;
    region: string;
    particularTopic: string;
    hasGeneratedList: boolean;
}

interface ListGeneratorProps {
    selectedEventId: string | null;
}

const ListGenerator: React.FC<ListGeneratorProps> = ( {selectedEventId}) => {
    const [event, setEvent] = useState<Event | null>(null);
    const {events} = useStore();
    const [region, setRegion] = useState<string[]>([]);
    const [cancerType, setCancerType] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [donorData, setDonorData] = useState<DonorData[]>([]);
    const [regions, setRegions] = useState<string[]>([
        "Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond", "Kelowna", "Kamloops", "Nanaimo", "Prince George",
        "Abbotsford", "Coquitlam", "Langley", "Saanich", "Delta", "Maple Ridge", "New Westminster", "Port Coquitlam",
        "North Vancouver", "West Vancouver", "Chilliwack", "Vernon", "Courtenay", "Penticton", "Campbell River",
        "Fort St. John", "Cranbrook", "Terrace", "Dawson Creek", "Port Moody", "White Rock", "Quesnel", "Squamish",
        "Salmon Arm", "Parksville", "Powell River", "Williams Lake", "Trail", "Castlegar", "Kitimat", "Revelstoke"
    ]);
    const [filteredData, setFilteredData] = useState<DonorData[]>([]);
  
    // Fetch donor data from API and parse HTML
    useEffect(() => {
      fetch("https://bc-cancer-faux.onrender.com/donors?format=json&limit=100")
        .then((response) => response.json())
        .then((datas) => {
            const {headers, data} = datas;
            const donors = [];
            for (let item of data) {
                let donor: any = {};
                for (let index = 0; index < headers.length; index++) {
                    donor[headers[index]] = item[index];
                }
                donors.push(donor);
            }
            setDonorData(donors);
        })
        .catch((error) => console.error("Error fetching donor data:", error));
    }, []);

    // Handle the filtering and generation of the list
    const handleGenerate = () => {
        let filtered: DonorData[] = donorData.filter((donor) => {
        return (
            (region.length === 0 || region.includes(donor.city))
            // && (cancerType === "" || donor.largest_gift_appeal === cancerType)
        //     && (date === null ||
        //     dayjs(new Date(parseInt(donor.last_gift_request) * 1000)).isSame(
        //         date,
        //         "day"
        //     )) 
        );
        });

        setFilteredData(filtered);
    };

    // export CSV
    const handleExportCSV = () => {
        const csvRows = [
            // CSV header
            ["Name", "Region", "Email", "Phone", "Last Invited", "Donor"],
            // CSV data
            ...filteredData.map((donor) => [
                donor.first_name + " " + donor.last_name,
                donor.city,
                donor.email_restrictions || "N/A",
                donor.contact_phone_type || "N/A",
                new Date(parseInt(donor.last_gift_request) * 1000).toLocaleDateString(),
                donor.total_donations,
            ]),
        ];

        const csvContent =
            "data:text/csv;charset=utf-8," +
            csvRows.map((row) => row.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "donors_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (selectedEventId) {
            const selectedEvent = events.find(e => e.id === selectedEventId);
            setEvent(selectedEvent || null);
            setRegion(Array.isArray(selectedEvent?.region) ? selectedEvent.region : [selectedEvent?.region || ""]);
            setDate(selectedEvent?.date ? dayjs(selectedEvent.date) : null);
            setCancerType(selectedEvent?.typeOfCancer || "");
        }
    }, [selectedEventId]);



    return (
        <Box p={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Container>
                    <Grid2 container spacing={4}>
                        {/* Filters Section */}
                        <Grid2 
                            item 
                            xs={12} 
                            sm={4}
                            ml={-1}                       
                            >
                            <Typography variant="h4" gutterBottom>Filters</Typography>
                                <Paper sx={{ p: 2, height: '405px', overflow: 'auto', width: '200px' }}>
                                <FormControl fullWidth margin="normal">
                                <InputLabel>Regions</InputLabel>
                                <Select
                                    multiple
                                    value={region} // This will now hold an array of selected regions
                                    onChange={(e) => {
                                        if (Array.isArray(e.target.value) && e.target.value.some(item => item.length === 0)) {
                                            setRegion([]);
                                        }else {
                                            setRegion(e.target.value as string[])
                                        }
                                    }} // Update region state as an array
                                    renderValue={(selected) => selected.join(", ")} // Display selected regions as a comma-separated string
                                    label="Regions"
                                    sx={{maxWidth: "200px", minWidth: "200px", overflow: "auto"}}
                                >   

                                    <MenuItem value="">All</MenuItem>
                                    {regions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                        {region}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                                <DatePicker
                                    label="Date"
                                    value={date}
                                    onChange={(newDate) => setDate(newDate)}
                                    slotProps={{
                                        textField: {
                                        fullWidth: true,
                                        margin: "normal",
                                        sx: { maxWidth: "200px", minWidth: "200px"
                                        },
                                        },
                                    }}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel sx={{backgroundColor: "white"}}> Cancer Type </InputLabel>
                                    <Select
                                        value={cancerType}
                                        onChange={(e) => setCancerType(e.target.value)}
                                        sx={{maxWidth: "200px", minWidth: "200px", overflow: "auto"}}
                                    >
                                    <MenuItem value="">All</MenuItem>
                                        {[
                                            "Lung Cancer", "Breast Cancer", "Prostate Cancer", "Colorectal Cancer", "Skin Cancer",
                                            "Pancreatic Cancer", "Ovarian Cancer", "Leukemia", "Stomach Cancer", "Brain Cancer"
                                        ].map((cancerType) => (
                                            <MenuItem key={cancerType} value={cancerType}>
                                                {cancerType}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Box display="flex" alignItems="center" mt={2}>
                                    <TextField
                                        label="#Guests"
                                        type="number"
                                        value={amount || ""}
                                        onChange={(e) => setAmount(parseInt(e.target.value))}
                                        InputProps={{
                                            endAdornment: (
                                                <>
                                                    <IconButton size="small">
                                                        <ArrowDropUp />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <ArrowDropDown />
                                                    </IconButton>
                                                </>
                                            ),
                                        }}
                                        fullWidth
                                        sx={{maxWidth: "200px", minWidth: "200px", overflow: "auto"}}
                                    />
                                </Box>
                                </Paper>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: "#36a0c8"}}
                                    onClick={handleGenerate}
                                    fullWidth
                                    sx={{margin: "38px 0 0 0"}}
                                >
                                    Generate
                                </Button>
                            </Grid2>


                        {/* Invite List Section */}

                        <Grid2 item xs={12} sm={8}>
                            <Typography variant="h4" gutterBottom>{event ? `Invite List for ${event.title}` : 'List Generator'}</Typography>
                                <Paper sx={{ p: 2, height: '405px', overflow: 'auto', width: '800px'}}>
                                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Region</TableCell>
                                                    <TableCell>Email</TableCell>
                                                    <TableCell>Phone</TableCell>
                                                    <TableCell>Last Invited</TableCell>
                                                    <TableCell>Donor</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredData.map((donor, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {donor.first_name} {donor.last_name}
                                                        </TableCell>
                                                        <TableCell>{donor.city}</TableCell>
                                                        <TableCell>
                                                            {donor.email_restrictions || "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {donor.contact_phone_type || "N/A"}
                                                        </TableCell>
                                                        <TableCell>
                                                            {new Date(
                                                                parseInt(donor.last_gift_request) * 1000
                                                            ).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell>{donor.total_donations}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                            </Paper>
                            <Box sx={boxStyle}>
                                    <Button
                                        variant="contained"
                                        sx={buttonStyle}
                                        onClick={handleExportCSV}
                                    >
                                        Export
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        sx={buttonStyle}
                                    >
                                        Save
                                    </Button>
                                </Box>
                        </Grid2>
                    </Grid2>
                </Container>
            </LocalizationProvider>
        </Box>
    );
};

export default ListGenerator;
