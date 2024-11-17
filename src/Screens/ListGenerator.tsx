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
import donorsData from "../donors.json";
import dayjs, {Dayjs} from "dayjs";
import { boxStyle, buttonStyle, colors } from '../Utils/Style';


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

const ListGenerator: React.FC = () => {
    const [region, setRegion] = useState<string[]>([]);
    const [cancerType, setCancerType] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [donorData, setDonorData] = useState<DonorData[]>([]);
    const [regions, setRegions] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<DonorData[]>([]);
  
    // Fetch donor data from API and parse HTML
    useEffect(() => {
      fetch("https://bc-cancer-faux.onrender.com/donors")
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const tableRows = doc.querySelectorAll("table tr");
  
          const data: DonorData[] = [];
          tableRows.forEach((row, index) => {
            if (index === 0) return; // Skip header row
  
            const cells = row.querySelectorAll("td");
            if (cells.length === 0) return; // Skip empty rows
  
            const donor: DonorData = {
              pmm: cells[0].textContent || "",
              smm: cells[1].textContent || "",
              vmm: cells[2].textContent || "",
              exclude: cells[3].textContent === "yes" ? "yes" : "no",
              deceased: cells[4].textContent === "yes" ? "yes" : "no",
              first_name: cells[5].textContent || "",
              nick_name: cells[6].textContent || "",
              last_name: cells[7].textContent || "",
              organization_name: cells[8].textContent || "",
              total_donations: cells[9].textContent || "",
              total_pledge: cells[10].textContent || "",
              largest_gift: cells[11].textContent || "",
              largest_gift_appeal: cells[12].textContent || "",
              first_gift_date: cells[13].textContent || "",
              last_gift_date: cells[14].textContent || "",
              last_gift_amount: cells[15].textContent || "",
              last_gift_request: cells[16].textContent || "",
              last_gift_appeal: cells[17].textContent || "",
              address_line1: cells[18].textContent || "",
              address_line2: cells[19].textContent || "",
              city: cells[20].textContent || "",
              contact_phone_type: cells[21].textContent || "",
              phone_restrictions: cells[22].textContent || "",
              email_restrictions: cells[23].textContent || "",
              communication_restrictions: cells[24].textContent || "",
              subscription_events_in_person: cells[25].textContent === "Opt-in" ? "Opt-in" : "Opt-out",
              subscription_events_magazine: cells[26].textContent === "Opt-in" ? "Opt-in" : "Opt-out",
              communication_preference: cells[27].textContent || "",
            };
  
            data.push(donor);
          });
  
          setDonorData(data);
  
          // Extract unique cities
          const uniqueCities = [...new Set(data.map((donor) => donor.city))];
          setRegions(uniqueCities);
        })
        .catch((error) => console.error("Error fetching donor data:", error));
    }, []);

    // Handle the filtering and generation of the list
    const handleGenerate = () => {
        let filtered: DonorData[] = donorData.filter((donor) => {
        return (
            (region.length === 0 || region.includes(donor.city)) &&
            (date === null ||
            dayjs(new Date(parseInt(donor.last_gift_request) * 1000)).isSame(
                date,
                "day"
            ))
        );
        });

        if (amount) {
        filtered = filtered.slice(0, amount);
        }
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

    // useEffect(() => {
    //     const eventStr = localStorage.getItem('event');
    //     if (eventStr) {
    //         try {
    //             const data: any = JSON.parse(eventStr);
    //             if (data) {
    //                setRegion(data.region);
    //                setDate(dayjs(data.date));
    //                setCancerType(data.typeOfCancer);
    //                const region = data.region;
    //                  const cancerType = data.typeOfCancer;
    //                  const date = dayjs(data.date);
    //                 let filtered: DonorData[] = datas.filter((donor) => {
    //                     // filter conditions
    //                     return (
    //                         (data.region === "" || donor.city === region) &&
    //                         (data.typeOfCancer === "" || donor.communication_preference === cancerType) &&
    //                         (!data.date || dayjs(new Date(parseInt(donor.last_gift_request) * 1000)).isAfter(date, 'day'))
    //                     );
    //                 });

    //                 setFilteredData(filtered);
    //             }
    //         } catch (error) {

    //         }
    //     }
    // }, []);

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
                                    onChange={(e) => setRegion(e.target.value as string[])} // Update region state as an array
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
                                    {/* {regions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                        {region}
                                        </MenuItem>
                                        ))} */}
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
                            <Typography variant="h4" gutterBottom>Invite List for Event XXXX</Typography>
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
