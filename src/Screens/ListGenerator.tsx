import React, { useState } from "react";
import {
    Box,
    Grid,
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import donorsData from "../donors.json";
import dayjs, {Dayjs} from "dayjs";


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

const datas: DonorData[] = donorsData as DonorData[];

const regions = [...new Set(datas.map(item => item.city))];
const communication_preferences = [...new Set(datas.map(item => item.communication_preference))];

const ListGenerator: React.FC = () => {
    const [region, setRegion] = useState("");
    const [cancerType, setCancerType] = useState("");
    const [amount, setAmount] = useState<number | null>(null);
    const [date, setDate] = useState<Dayjs | null>(null);
    const [filteredData, setFilteredData] = useState<DonorData[]>([]);

    // 筛选逻辑
    const handleGenerate = () => {

        let filtered: DonorData[] = datas.filter((donor) => {
            // 筛选条件
            return (
                (region === "" || donor.city === region) &&
                (cancerType === "" || donor.communication_preference === cancerType) &&
                (date === null || dayjs(new Date(parseInt(donor.last_gift_request) * 1000)).isSame(date, 'day'))
            );
        });
        if (amount) {
            filtered = filtered.slice(0, amount);
        }
        setFilteredData(filtered);
    };

    // 导出CSV
    const handleExportCSV = () => {
        const csvRows = [
            // CSV表头
            ["Name", "Region", "Email", "Phone", "Last Invited", "Donor"],
            // 数据行
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

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container>
                <Grid container spacing={4}>
                    {/* Filters Section */}
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6">Filters</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Region</InputLabel>
                            <Select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                            >
                                <MenuItem key={'all'} value="">All</MenuItem>
                                {regions.map(region => {
                                    return <MenuItem key={region} value={region}>{region}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Cancer Type</InputLabel>
                            <Select
                                value={cancerType}
                                onChange={(e) => setCancerType(e.target.value)}
                            >
                                <MenuItem key={'all'} value="">All</MenuItem>
                                {communication_preferences.map(communication_preference => {
                                    return <MenuItem key={communication_preference} value={communication_preference}>{communication_preference}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <Box display="flex" alignItems="center" mt={2}>
                            <TextField
                                label="Amount"
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
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={handleGenerate}
                        >
                            Generate
                        </Button>
                    </Grid>

                    {/* Invite List Section */}
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h6">Event: xxxxxx</Typography>
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>
                            Invite List
                        </Typography>
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
                        <Box display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                                variant="outlined"
                                sx={{ mr: 2 }}
                                onClick={handleExportCSV}
                            >
                                Export
                            </Button>
                            <Button variant="outlined">Save</Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default ListGenerator;
